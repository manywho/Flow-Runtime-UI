import * as React from 'react';
import IComponentProps from '../interfaces/IComponentProps';
import registeredComponents from '../constants/registeredComponents';
import { isNil, isEmpty } from 'ramda';

import '../../css/historical-navigation.less';

declare const manywho: any;

const navigateToPath = (flowKey, path) => {
    manywho.engine.navigate(null, null, null, flowKey, path);
};

/**
 * @description Renders a list of navigation links to previously visited map elements
 */
const HistoricalNavigation:React.FC<IComponentProps> = ({ flowKey }) => {

    const [expanded, setExpanded] = React.useState(false);

    const navigation = manywho.model.getHistoricalNavigation(flowKey);
    const mapElement = manywho.model.getMapElement(flowKey);

    const onEntryClick = (entry) => {
        setExpanded(false); 
        navigateToPath(flowKey, entry.path);
    };

    if (!isNil(navigation)) {

        return (
            <nav className={`historical-navigation${expanded ? ' expanded' : ''}`}>
                <ul>
                    {
                        !isNil(navigation.entries)
                            ? navigation.entries.map((entry, index) => (
                                <li key={index}>
                                    <button className="btn btn-link" onClick={() => onEntryClick(entry)}>
                                    {
                                        entry.mapElementName
                                    }
                                    </button>
                                    {
                                        index === 0 ? (
                                            <button 
                                                title="expand"
                                                className="historical-navigation-expand"
                                                onClick={() => setExpanded(true)}
                                            >
                                                <span>expand</span>
                                            </button> 
                                        ): null
                                    }
                                </li>
                            ))
                        : null
                    }
                    {
                        !isNil(mapElement) && !isEmpty(mapElement)
                        ? (
                            <li key={"current"}><span className="historical-navigation-current">{ mapElement.name }</span></li>
                        )
                        : null
                    }
                </ul>
            </nav>
        );
    }

    return null;

}

manywho.component.register(registeredComponents.HISTORICAL_NAVIGATION, HistoricalNavigation);

export const getHistoricalNavigation = () : typeof HistoricalNavigation => manywho.component.getByName(registeredComponents.HISTORICAL_NAVIGATION) || HistoricalNavigation;

export default HistoricalNavigation;
