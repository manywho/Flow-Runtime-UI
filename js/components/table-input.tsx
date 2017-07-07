/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    class TableInput extends React.Component<any, any> {

        getInputType(contentType) {

            switch(contentType.toUpperCase())
            {
                case manywho.component.contentTypes.string:
                    return 'text';
                case manywho.component.contentTypes.number:
                    return 'number';
                case manywho.component.contentTypes.boolean:
                    return 'checkbox';
                case manywho.component.contentTypes.password:
                    return 'password';
                case manywho.component.contentTypes.datetime:
                    return 'datetime';
                default:
                    return 'text';
            }
        }

        isEmptyDate(date) {

            if (date == null
                || date.indexOf('01/01/0001') != -1
                || date.indexOf('1/1/0001') != -1
                || date.indexOf('0001-01-01') != -1)
                return true;

            return false;
        }

        onChange = (e) => {
            if (manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.boolean, true)) {
                const checked = typeof this.state.value === 'string' && manywho.utils.isEqual(this.state.value, 'false', true) ? false : (new Boolean(this.state.value)).valueOf();
                this.setState({ value: !checked });
            }
            else if ((manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.datetime, true)))
                this.setState({ value: e });
            else
                this.setState({ value: e.currentTarget.value });
        }

        onKeyUp = (e) => {
            if (e.keyCode == 13 && !this.props.isDesignTime && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                this.onCommit();
            }
        }

        onFocus = (e) => {
            this.setState({ isFocused: true });
        }

        onBlur = () => {
            this.setState({ isFocused: false });

            if (!this.props.isDesignTime)
                this.onCommit();
        }

        onClick = (e) => {
            e.stopPropagation();

            if (manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.datetime, true)) {
                this.setState({ currentValue: this.state.value });
                manywho.model.setModal(this.props.flowKey, {
                    content: React.createElement(manywho.component.getByName('table-input-datetime'), {
                        value: this.state.value, 
                        onChange: this.onChange,
                        format: manywho.formatting.toMomentFormat(this.props.contentFormat)
                    }),
                    onConfirm: this.onCommit,
                    onCancel: this.onCloseDateTimePicker,
                    flowKey: this.props.flowKey,
                });
            }
        }

        onCommit = () => {
            if (manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.datetime, true) && !this.isEmptyDate(this.state.value)) {
                const dateTime = moment(this.state.value, ["MM/DD/YYYY hh:mm:ss A ZZ", moment.ISO_8601, this.props.contentFormat || '']);
                this.props.onCommitted(this.props.id, this.props.propertyId, dateTime.format());
                manywho.model.setModal(this.props.flowKey, null);
            }
            else
                this.props.onCommitted(this.props.id, this.props.propertyId, this.state.value);
        }

        onCloseDateTimePicker = (e) => {
            this.setState({ value: this.state.currentValue, currentValue: null });
            manywho.model.setModal(this.props.flowKey, null);
        }

        componentWillMount = () => {
            this.setState({ value: this.props.value });
        }

        render() {
            manywho.log.info('Rendering Table Input: ' + this.props.id);

            let className = 'input-sm';

            if (!this.state.isFocused)
                className += ' table-input-display';

            if (!manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.boolean, true))
                className += ' form-control';
            
            const props: any = {
                className: className,
                onClick: this.onClick,
                onChange: this.onChange,
                onKeyUp: this.onKeyUp,
                value: this.state.value,
                onFocus: this.onFocus,
                ref: 'input'
            }

            if (!manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.datetime, true))
                props.onBlur = this.onBlur;

            if (manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.boolean, true))
                props.checked = this.state.value === true || manywho.utils.isEqual(this.state.value, 'true', true);
            
            if (manywho.utils.isEqual(this.props.contentType, manywho.component.contentTypes.string, true)) {
                props.rows = 1;
                return React.DOM.textarea(props);
            }
            else {
                props.type = this.getInputType(this.props.contentType);
                return React.DOM.input(props);
            }
        }
    }

    manywho.component.register("table-input", TableInput);

}(manywho));
