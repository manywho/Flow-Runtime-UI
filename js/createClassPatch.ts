import createReactClass from 'create-react-class';

declare global {
    interface Window { React: any; }
}

window.React.createClass = (args) => {
    console.error('React.createClass is no longer supported. ' +
        'This method is deprecated and has been removed from React. ' +
        'The method has been patched but this may cause unexpected results. ' +
        'In a future update this patch will be removed from Boomi Flow. ' +
        'Please use the create-react-class script instead.',
    );
    return createReactClass(args);
};
