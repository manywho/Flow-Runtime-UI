/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IComponentProps.ts" />

declare var manywho: any;
declare var MaskedInput: any;

interface IInputState {

}

class Input extends React.Component<IComponentProps, IInputState> {

    validationRegex: RegExp;

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChange(e: React.FormEvent | string | boolean | number | null) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        if (typeof e === 'string' || typeof e === 'boolean' || typeof e === 'number' || e === null)
            manywho.state.setComponent(this.props.id, { contentValue: e }, this.props.flowKey, true);
        else
            manywho.state.setComponent(this.props.id, { contentValue: (e.target as HTMLInputElement).value }, this.props.flowKey, true);

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};

        if (this.validationRegex && manywho.settings.global('validation.isenabled', this.props.flowKey, false)) {
            try {
                if (this.validationRegex.test(state.contentValue))
                    manywho.state.setComponent(this.props.id, { isValid: true, validationMessage: null }, this.props.flowKey, true);
                else
                    manywho.state.setComponent(this.props.id, { isValid: false, validationMessage: model.attributes.validationMessage || `Value is invalid` }, this.props.flowKey, true);
            }
            catch (ex) {
                manywho.log.error(ex.toString());
            }
        }

        if (model.contentType.toUpperCase() === manywho.component.contentTypes.boolean)
            this.onBlur(e);

        this.forceUpdate();
    }

    onBlur(e) {
        let callback = null;
        const relatedElement = e.relatedTarget;

        if (relatedElement && (relatedElement.classList.contains('outcome') || relatedElement.classList.contains('control-label')))
            callback = () => relatedElement.click();

        manywho.component.handleEvent(this, manywho.model.getComponent(this.props.id, this.props.flowKey), this.props.flowKey, callback);
    }

    componentWillMount() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        if (model && model.attributes && model.attributes.validation)
            this.validationRegex = new RegExp(model.attributes.validation);
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering Input: ${model.developerName}, ${this.props.id}`);

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        const contentValue = state && state.contentValue !== undefined ? state.contentValue : model.contentValue;

        let mask = null;
        if (model.attributes && model.attributes.mask)
            mask = model.attributes.mask;

        let autocomplete = null;
        if (model.attributes && model.attributes.autocomplete)
            autocomplete = model.attributes.autocomplete;

        const props: any = {
            value: contentValue,
            id: this.props.id,
            maxLength: model.maxSize,
            size: mask ? mask.length : model.size,
            readOnly: model.isEditable === false,
            disabled: model.isEnabled === false,
            required: model.isRequired === true,
            onChange: this.onChange,
            onBlur: this.onBlur,
            flowKey: this.props.flowKey,
            format: model.contentFormat,
            mask: mask,
            autoComplete: autocomplete
        };

        if (this.props.isDesignTime) {
            props.onChange = null;
            props.onBlur = null;
            props.isDesignTime = true;
        }

        if (!manywho.utils.isNullOrWhitespace(model.hintValue))
            props.placeholder = model.hintValue;

        let className = manywho.styling.getClasses(this.props.parentId, this.props.id, 'input', this.props.flowKey).join(' ');

        if (model.isValid === false || state.isValid === false)
            className += ' has-error';

        if (model.isVisible === false)
            className += ' hidden';

        if (outcomes)
            className += ' has-outcomes';

        className += ' form-group';

        let contentType = model.contentType || 'ContentString';
        if (model.valueElementValueBindingReferenceId)
            if (model.valueElementValueBindingReferenceId.contentType)
                contentType = model.valueElementValueBindingReferenceId.contentType;
            else if (Array.isArray(model.valueElementValueBindingReferenceId) && model.valueElementValueBindingReferenceId.length > 0 && model.valueElementValueBindingReferenceId[0].properties)
                contentType = (manywho.utils.getObjectDataProperty(model.valueElementValueBindingReferenceId[0].properties, 'ContentType') || {}).contentValue;

        let label = <label>{model.label}{model.isRequired ? <span className="input-required"> *</span> : null}</label>;
        let inputElement = null;

        switch (contentType.toUpperCase()) {
            case manywho.component.contentTypes.datetime:
                inputElement = React.createElement(manywho.component.getByName('input-datetime'), props);
                break;

            case manywho.component.contentTypes.boolean:
                label = null;
                inputElement = React.createElement(manywho.component.getByName('input-boolean'), props);
                break;

            case manywho.component.contentTypes.number:
                inputElement = React.createElement(manywho.component.getByName('input-number'), props);
                break;

            case manywho.component.contentTypes.password:
                inputElement = <input {...props} className="form-control" type="password" />;
                break;

            default:
                if (manywho.utils.isNullOrEmpty(mask))
                    inputElement = <input {...props} className="form-control" type={model.attributes.type ? model.attributes.type : 'text'} />;
                else
                    inputElement = <MaskedInput {...props} className="form-control" type={model.attributes.type ? model.attributes.type : 'text'} />;
                break;
        }

        const outcomeButtons = outcomes && outcomes.map(outcome => React.createElement(manywho.component.getByName('outcome'), { id: outcome.id, flowKey: this.props.flowKey }));

        return <div className={className}>
            {label}
            {inputElement}
            <span className="help-block">{model.validationMessage || state.validationMessage}</span>
            <span className="help-block">{model.helpInfo}</span>
            {outcomeButtons}
        </div>;
    }
}

manywho.component.register('input', Input, ['checkbox']);
