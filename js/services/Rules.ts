import { getStateValue } from '../models/State';
import { IState } from '../interfaces/IModels';

declare var manywho: any;
declare var moment: any;

/**
 * Support for simulating rules whilst a flow is offline
 */
const Rules = {

    /**
     * @param outcomes
     * @param state
     * @param snapshot
     */
    getOutcome(outcomes: any[], state: IState, snapshot: any) {
        if (!outcomes) {
            return null;
        }

        const sortedOutcomes = outcomes.sort((a, b) => a.order - b.order);

        for (const outcome of sortedOutcomes) {
            let result = false;

            if (outcome.comparison) {
                result = Rules.evaluateComparisons([outcome.comparison], state, snapshot);
            } else {
                result = true;
            }

            if (result) {
                return outcome;
            }
        }
    },

    /**
     * @param comparisons
     * @param state
     * @param snapshot
     */
    evaluateComparisons(comparisons: any[], state: IState, snapshot: any[]): boolean {
        let result = false;

        for (const comparison of comparisons) {
            if (comparison.rules) {
                result = Rules.evaluateRules(comparison.rules, comparison.comparisonType, state, snapshot);
            }
            if (comparison.comparisons) {
                result = Rules.evaluateComparisons(comparison.comparisons, state, snapshot);
            }
            if (result && comparison.comparisonType === 'OR') {
                return true;
            }
        }

        return result;
    },

    /**
     * @param rules
     * @param criteriaType
     * @param state
     * @param snapshot
     */
    evaluateRules(rules: any[], criteriaType: any, state: IState, snapshot): boolean {
        let result = false;

        for (const rule of rules) {
            const contentType = manywho.component.contentTypes.string;

            let left = snapshot.getValue(rule.leftValueElementToReferenceId);
            left = getStateValue(rule.leftValueElementToReferenceId, left.typeElementId, left.contentType, '') || left;

            let right = snapshot.getValue(rule.rightValueElementToReferenceId);
            right = getStateValue(rule.rightValueElementToReferenceId, right.typeElementId, right.contentType, '') || right;

            result = Rules.compareValues(left, right, contentType, rule.criteriaType);

            if (result && criteriaType === 'OR') {
                return true;
            }
        }

        return result;
    },

    /**
     * @param left
     * @param right
     * @param contentType
     * @param criteriaType
     */
    compareValues(left: any, right: any, contentType: any, criteriaType: string) {
        switch (contentType) {
        case manywho.component.contentTypes.object:
            return Rules.compareObjects(criteriaType);
        case manywho.component.contentTypes.list:
            return Rules.compareLists(criteriaType);
        default:
            const rightContentValue = criteriaType === 'IS_EMPTY' ?
                Rules.getContentValue(right, manywho.component.contentTypes.boolean) :
                Rules.getContentValue(right, contentType);

            return Rules.compareContentValues(Rules.getContentValue(left, contentType), rightContentValue, criteriaType, contentType);
        }
    },

    /**
     * @param value
     * @param contentType
     */
    getContentValue(value: any, contentType: any) {
        const contentValue = value.defaultContentValue || value.contentValue;

        switch (contentType) {
        case manywho.component.contentTypes.string:
        case manywho.component.contentTypes.content:
        case manywho.component.contentTypes.password:
        case manywho.component.contentTypes.encrypted:
            return contentValue ? contentValue.toUpperCase() : contentValue;
        case manywho.component.contentTypes.number:
            return contentValue ? parseFloat(contentValue) : contentValue;
        case manywho.component.contentTypes.datetime:
            return contentValue ? moment(contentValue) : contentValue;
        case manywho.component.contentTypes.boolean:
            return contentValue ? Boolean(contentValue) : contentValue;
        }
    },

    /**
     * @param left
     * @param right
     * @param criteriaType
     * @param contentType
     */
    compareContentValues(left: any, right: any, criteriaType: string, contentType: string) {
        switch (criteriaType.toUpperCase()) {
        case 'EQUAL':
            return left === right;

        case 'NOT_EQUAL':
            return  left !== right;

        case 'GREATER_THAN':
            return left > right;

        case 'GREATER_THAN_OR_EQUAL':
            return left >= right;

        case 'LESS_THAN':
            return left < right;

        case 'LESS_THAN_OR_EQUAL':
            return left <= right;

        case 'STARTS_WITH':
            return left.startsWith(right);

        case 'ENDS_WITH':
            return left.endsWith(right);

        case 'CONTAINS':
            return left.indexOf(right) !== -1;

        case 'IS_EMPTY':
            switch (contentType.toUpperCase()) {
            case manywho.component.contentTypes.string:
            case manywho.component.contentTypes.password:
            case manywho.component.contentTypes.content:
            case manywho.component.contentTypes.encrypted:
                return (manywho.utils.isNullOrEmpty(left) && right) || (!manywho.utils.isNullOrEmpty(left) && !right);
            case manywho.component.contentTypes.number:
            case manywho.component.contentTypes.boolean:
            case manywho.component.contentTypes.datetime:
                return (left === null && right) || (left !== null && !right);
            }
        }
    },

    /**
     * TODO: Un-hide the docs for this onces its implemented
     * @hidden
     * @param criteriaType
     */
    compareObjects(criteriaType: string) {
        switch (criteriaType.toUpperCase()) {
        case 'IS_EMPTY':
            return true;
        }
    },

    /**
     * TODO: Un-hide the docs for this onces its implemented
     * @hidden
     * @param criteriaType
     */
    compareLists(criteriaType: string) {
        switch (criteriaType.toUpperCase()) {
        case 'IS_EMPTY':
            return true;
        }
    },
};

export default Rules;
