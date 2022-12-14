import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';

declare let manywho: any;

const notFoundWrapper = (componentType) => {
    // eslint-disable-next-line react/display-name
    return () => (
        <div style={{ color: 'red' }}>
            {`Component of type: "${componentType}" could not be found`}
        </div>
    );
};

manywho.component.register(registeredComponents.NOT_FOUND, notFoundWrapper);
