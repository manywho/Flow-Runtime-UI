import * as React from 'react';
import { ITourState, ITourProps, ITourStep } from '../interfaces/ITour';
import { CSSTransitionGroup } from 'react-transition-group';
import registeredComponents from '../constants/registeredComponents';

declare let manywho: any;

class Tour extends React.Component<ITourProps, ITourState> {

    domWatcher: any;
    stepRef: any;

    constructor(props) {
        super(props);

        this.state = {
            foundTarget: false,
            style: null,
        };

        this.onNext = this.onNext.bind(this);
        this.onBack = this.onBack.bind(this);
        this.onDone = this.onDone.bind(this);

        this.stepRef = null;
    }

    onInterval(stepIndex: number) {
        const targetElement = manywho.tours.getTargetElement(this.props.tour.steps[stepIndex]);

        if (targetElement && !this.state.foundTarget)
            this.setState({ foundTarget: true, style: this.state.style });
        else if (!targetElement && this.state.foundTarget)
            this.setState({ foundTarget: false, style: this.state.style });
    }

    onNext: () => void = () => {
        manywho.tours.next(this.props.tour);
    }

    onBack: () => void = () => {
        manywho.tours.previous(this.props.tour);
    }

    onDone: () => void = () => {
        manywho.tours.done(this.props.tour);
    }

    UNSAFE_componentWillReceiveProps(nextProps: ITourProps) {
        if (this.props.stepIndex !== nextProps.stepIndex) {
            this.setState({ foundTarget: false, style: this.state.style });
            this.domWatcher = setInterval(() => { this.onInterval(this.props.stepIndex); }, 500);
        }
    }

    componentDidMount(): void {
        this.domWatcher = setInterval(() => { this.onInterval(this.props.stepIndex); }, 500);
    }

    componentDidUpdate(prevProps: ITourProps, prevState: ITourState) {
        if (prevState.foundTarget === false && this.state.foundTarget) {
            const step = this.props.tour.steps[this.props.tour.currentStep];
            const stepBoundingRect = (this.stepRef as HTMLElement).getBoundingClientRect();

            const target = manywho.tours.getTargetElement(step);
            const targetRect = target.getBoundingClientRect();

            const style = {
                left: 0,
                top: 0,
            };

            switch (step.placement.toUpperCase()) {
            case 'LEFT':
                style.left = targetRect.left - stepBoundingRect.width - 16;
                break;

            case 'RIGHT':
                style.left = targetRect.right + 16;
                break;

            case 'BOTTOM':
                style.top = targetRect.bottom + 16;
                break;

            case 'TOP':
                style.top = targetRect.top - stepBoundingRect.height - 16;
                break;
            }

            if (manywho.utils.isEqual(step.placement, 'bottom', true) ||
                manywho.utils.isEqual(step.placement, 'top', true))
                switch (step.align.toUpperCase()) {
                case 'LEFT':
                    style.left = targetRect.left;
                    break;

                case 'CENTER':
                    style.left = targetRect.left + (targetRect.width / 2);
                    break;

                case 'RIGHT':
                    style.left = targetRect.left + (targetRect.width - stepBoundingRect.width);
                    break;
                }

            if (manywho.utils.isEqual(step.placement, 'left', true) ||
                manywho.utils.isEqual(step.placement, 'right', true))
                switch (step.align.toUpperCase()) {
                case 'TOP':
                    style.top = targetRect.top;
                    break;

                case 'CENTER':
                    style.top = (targetRect.top + (targetRect.height / 2)) - (stepBoundingRect.height / 2);
                    break;

                case 'BOTTOM':
                    style.top = targetRect.bottom - stepBoundingRect.height;
                    break;
                }

            this.setState({ style, foundTarget: this.state.foundTarget });
        }
    }

    componentWillUnMount(): void {
        clearInterval(this.domWatcher);
    }

    render() {
        if (!this.state.foundTarget)
            return null;

        manywho.log.info(`Rendering Tour ${this.props.tour.id}, Step ${this.props.stepIndex}`);

        const step = this.props.tour.steps[this.props.tour.currentStep] as ITourStep;
        const className = 'mw-tour-step popover ' + step.placement;

        let arrowStyle = null;
        const offset = manywho.utils.isNullOrUndefined(step.offset) ? 16 : step.offset;
        

        switch (step.placement.toUpperCase()) {
        case 'LEFT':
        case 'RIGHT':
            let top = '50%';
            if (manywho.utils.isEqual(step.align, 'top', true))
                top = `calc(0% + ${offset.toString()}px)`;
            else if (manywho.utils.isEqual(step.align, 'bottom', true))
                top = `calc(100% - ${offset.toString()}px)`;

            arrowStyle = { top };
            break;

        case 'TOP':
        case 'BOTTOM':
            let left = '50%';
            if (manywho.utils.isEqual(step.align, 'left', true))
                left = `calc(0% + ${offset.toString()}px)`;
            else if (manywho.utils.isEqual(step.align, 'right', true))
                left = `calc(100% - ${offset.toString()}px)`;

            arrowStyle = { left };
            break;
        }

        return <CSSTransitionGroup transitionName="mw-tour-step"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={true}
            transitionLeaveTimeout={250}>

            <div className={className}
                ref={ (node) => { 
                    this.stepRef = node ? node : null;
                }}
                style={this.state.style}
                key={this.props.stepIndex}
                id={`tour-${this.props.tour.id}-step${this.props.stepIndex}`}>

                <div className="arrow" style={arrowStyle} />
                {manywho.utils.isNullOrWhitespace(step.title) ? null :
                    <div className="popover-title">
                        {step.title}
                        <button className="close"
                            onClick={this.onDone}>
                            <span>&times;</span>
                        </button>
                    </div>}

                <div className="popover-content">
                    <p>{step.content}</p>
                    <div className="popover-buttons">
                        {step.showBack ? <button className="btn btn-default btn-sm"
                            onClick={this.onBack}>Back</button> : null}
                        {step.showNext ? <button className="btn btn-primary btn-sm"
                            onClick={this.onNext}>Next</button> : null}
                    </div>
                </div>
            </div>
        </CSSTransitionGroup>;
    }
}

manywho.component.register(registeredComponents.TOUR, Tour);

manywho.tours.getTargetElement = function (step: ITourStep) {
    if (!step)
        return null;

    if (step.querySelector)
        return document.querySelector(step.target);

    return document.getElementById(step.target);
};

export const getTour = () : typeof Tour => manywho.component.getByName(registeredComponents.TOUR);

export default Tour;
