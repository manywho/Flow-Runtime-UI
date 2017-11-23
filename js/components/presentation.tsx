import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';

declare var manywho: any;

class Presentation extends React.Component<IComponentProps, null> {

    replaceContent() {
        const node = ReactDOM.findDOMNode(this.refs.content);

        const imgs = node.querySelectorAll('img');
        if (imgs && imgs.length > 0)
            for (let i = 0; i < imgs.length; i += 1) {
                imgs[i].className += ' img-responsive';
            }
    }

    componentDidUpdate() { this.replaceContent(); }
    componentDidMount() { this.replaceContent(); }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering Presentation: ${this.props.id}, ${model.developerName}`);

        const Outcome = getOutcome();

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        const outcomes: any = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
        const outcomeElements: JSX.Element[] = outcomes && outcomes
            .map(outcome => <Outcome id={outcome.id} flowKey={this.props.flowKey}/>);

        let className = manywho.styling.getClasses(
            this.props.parentId, 
            this.props.id, 
            'presentation', 
            this.props.flowKey,
        ).join(' ');

        if (model.isVisible === false)
            className += ' hidden';

        let html = model.content;

        if (!manywho.utils.isNullOrUndefined(html))
            html = html.replace(/&quot;/g, '\"')
                .replace(/&#39;/g, '\'')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');

        return <div className={className} id={this.props.id}>
            <label>{model.label}</label>
            <div ref="content" dangerouslySetInnerHTML={{ __html: html }} />
            <span className="help-block">
                {model.validationMessage || state.validationMessage}
            </span>
            <span className="help-block">{model.helpInfo}</span>
            {outcomeElements}
        </div>;
    }

}

manywho.component.register(registeredComponents.PRESENTATION, Presentation);

export const getPresentation = () : typeof Presentation => manywho.component.getByName(registeredComponents.PRESENTATION);

export default Presentation;
