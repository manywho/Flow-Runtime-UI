(function (manywho) {

    function getInputType(contentType) {

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
            default:
                return 'text';
        }

    }

    function onChange(e) {

        var id = e.target.getAttribute('id');
        var value = e.target.getAttribute('value');
        manywho.state.setContentValue(id, value);

    }

    var input = React.createClass({

        render: function () {

            log.info('Rendering Input: ' + this.props.id);

            var model = manywho.model.getComponent(this.props.id);
            var state = manywho.state.get(this.props.id);

            var attributes = {
                type: getInputType(model.contentType),
                placeholder: model.hintValue,
                value: state.contentValue,
                input: onChange,
                change: onChange,
                id: this.props.id
            }

            if (!model.isEnabled) {
                attributes.disabled = "disabled";
            }

            if (model.isRequired) {
                attributes.required = "";
            }

            if (model.contentType.toUpperCase() == manywho.component.contentTypes.boolean) {

                if (Boolean(state.contentValue)) {
                    attributes.checked = "checked";
                }

                return React.DOM.div({ className: 'checkbox ' + (model.isVisible) ? "" : "hidden" },
                            React.DOM.label(null, [
                                React.DOM.input(attributes, null),
                                model.label,
                            ])
                        );

            }
            else {

                attributes.className = 'form-control';

                return React.DOM.div({ className: 'form-group ' + (model.isVisible) ? "" : "hidden" }, [
                            React.DOM.label({ 'for': this.props.id }, model.label),
                            React.DOM.input(attributes, null)
                        ]);

            }                       

        }

    });
    
    manywho.component.register("input", input);

}(manywho));