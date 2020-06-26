/**
 * @description Some utility functions that can be shared across UI components
 */

import IOutcomeMetaData from '../../interfaces/IOutcomeMetaData';

/* eslint-disable import/prefer-default-export */

interface IRenderOutcomesInOrder {
    (element: JSX.Element, outcomes: JSX.Element[], outcomeMeta: Array<IOutcomeMetaData>, isVisible: boolean);
}

/**
 * @param element A JSX snippet describing the component to be rendered
 * @param outcomes An array of outcome components to be displayed inline
 * @param outcomeMeta An array of objects, each describing an outcome
 * @param isVisible A boolean of whether the component is visible or not (usually model.isVisible)
 *
 * @description Determines whether to render a just the UI component or the component with an inline outcome
 *
 * @returns Either the JSX for the component being rendered, or if there is
 * an inline outcome to be displayed, an array of JSX snippets (one being the outcome, the other the component)
 * the order of which depends on the isBulkAction key value in the outcome metadata
 */
export const renderOutcomesInOrder: IRenderOutcomesInOrder = (element, outcomes, outcomeMeta, isVisible) => {
    if ((!outcomes || outcomes.length === 0) || (!outcomeMeta || outcomeMeta.length === 0) || isVisible === false) {
        return element;
    }

    const resultToRender = [element];

    outcomeMeta.forEach((outcome, currentIndex) => {
        const displayTop = outcome.isBulkAction;
        if (displayTop && currentIndex === 0) {
            resultToRender.unshift(outcomes[currentIndex]);
        }

        if (displayTop && currentIndex > 0) {
            const elementPosition = resultToRender.indexOf(element);
            resultToRender.splice(elementPosition, 0, outcomes[currentIndex]);
        }

        if (!displayTop) {
            resultToRender.push(outcomes[currentIndex]);
        }
    });

    return resultToRender;
};

/**
 * @param reference It is a React reference to a DOM element
 *
 * @description It sets the focus to the referenced element if the windows width is more than 768 and the focus is in
 * the document body or undefined. If the element type is text it also unselect the text.
 */
export const focusInFirstInputElement = (reference) => {
    if (reference !== null && reference !== undefined && window.innerWidth > 768 &&
        (document.activeElement === undefined || document.activeElement.nodeName === 'BODY')) {
        reference.current.focus();

        if (reference.current.type && reference.current.type.toLowerCase() === 'text') {
            reference.current.setSelectionRange(reference.current.value.length, reference.current.value.length);
        }
    }
};
