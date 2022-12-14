import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';

class ErrorFallback extends React.Component<{ componentStack; error }> {
    state = {
        showDetails: false,
    };

    render() {
        const { componentStack, error } = this.props;
        const { showDetails } = this.state;

        const detailsStyle = {
            display: showDetails ? 'block' : 'none',
        };

        const glyphiconClass = showDetails ? 'glyphicon-triangle-down' : 'glyphicon-triangle-right';

        const onShowDetails = (event) => {
            event.stopPropagation();
            this.setState({ showDetails: !showDetails });
        };

        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
        return (
            <div className="alert alert-danger">
                <p onClick={onShowDetails}>
                    <span className={`glyphicon ${glyphiconClass}`} />
                    Sorry, something has gone wrong.
                </p>
                <pre style={detailsStyle}>
                    {error.message}
                    {componentStack}
                </pre>
            </div>
        );
        /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
    }
}

manywho.component.register(registeredComponents.ERROR_FALLBACK, ErrorFallback);

export const getErrorFallback = (): typeof ErrorFallback =>
    manywho.component.getByName(registeredComponents.ERROR_FALLBACK) || ErrorFallback;

export default ErrorFallback;
