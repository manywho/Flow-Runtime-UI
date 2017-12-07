import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { default as utils } from '../test-utils';

import ItemsContainer from '../js/components/items-container';

describe('ItemsContainer component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount({
        id = 'xxx', 
        parentId = 'xxx', 
        flowKey = 'xxx',
        isDesignTime = false,
        objectData = [],
        paginationSize = null,
        loading = null,
        page = null,
        objectDataRequest = null,
        fileDataRequest = null,
    } = {}) {

        const props = {
            id, parentId, flowKey, isDesignTime,
        };

        globalAny.window.manywho.model.getComponent = () => ({
            objectData,
            objectDataRequest,
            fileDataRequest,
            componentType: 'xxx',
            attributes: {
                paginationSize,
                pagination: true,
            },
        });

        globalAny.window.manywho.state.getComponent = () => ({
            loading, page,
        });

        return mount(<ItemsContainer {...props} />);
    }

    afterEach(() => {
        componentWrapper.unmount();
    });

    test('Component renders without crashing', () => {
        componentWrapper = manyWhoMount();
        expect(componentWrapper.length).toEqual(1);
    });

    test('Component gets registered', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register)
        .toHaveBeenCalledWith('mw-items-container', ItemsContainer); 
    });

    test('areBulkActionsDefined returns true when bulk actions present', () => {
        componentWrapper = manyWhoMount();

        const hasBulkActions = ItemsContainer.prototype.areBulkActionsDefined([
            { isBulkAction: true },
            { isBulkAction: false },
        ]);

        expect(hasBulkActions).toBe(true);
    });

    test('areBulkActionsDefined returns false when bulk actions aren\'t present', () => {
        componentWrapper = manyWhoMount();

        const hasBulkActions = ItemsContainer.prototype.areBulkActionsDefined([
            { isBulkAction: false },
            { isBulkAction: false },
        ]);

        expect(hasBulkActions).toBe(false);
    });

    test('Correct child component gets rendered', () => {

        globalAny.window.manywho.component.getByName = jest.fn();

        componentWrapper = manyWhoMount();

        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-xxx'); 
    });

    test('Empty items element is rendered when required', () => {

        const stubComponent = jest.fn(() => <div/>);

        globalAny.window.manywho.component.getByName = () => stubComponent;
        globalAny.window.manywho.component.getDisplayColumns = () => [{}];

        componentWrapper = manyWhoMount({
            objectData: [],
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                contentElement: expect.objectContaining({
                    props: expect.objectContaining({
                        className: 'mw-items-empty',
                    }),
                }),
            }),
            expect.any(Object),
            expect.any(Object),
        ); 

    });

    test('Error element is rendered when no display columns have been defined', () => {
        
        const stubComponent = jest.fn(() => <div/>);

        globalAny.window.manywho.component.getByName = () => stubComponent;
        globalAny.window.manywho.component.getDisplayColumns = () => [];

        componentWrapper = manyWhoMount({
            objectData: [],
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                contentElement: expect.objectContaining({
                    props: expect.objectContaining({
                        className: 'mw-items-error',
                    }),
                }),
            }),
            expect.any(Object),
            expect.any(Object),
        ); 

    });

    test('Error element is rendered when state has error', () => {
        
        const stubComponent = jest.fn(() => <div/>);

        globalAny.window.manywho.component.getByName = () => stubComponent;
        globalAny.window.manywho.state.getComponent = () => ({
            error: true,
        });

        componentWrapper = manyWhoMount({
            objectData: [],
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                contentElement: expect.objectContaining({
                    props: expect.objectContaining({
                        className: 'mw-items-error',
                    }),
                }),
            }),
            expect.any(Object),
            expect.any(Object),
        ); 

    });

    test('Pagination size is passed to child component', () => {
        
        const stubComponent = jest.fn(() => <div/>);

        globalAny.window.manywho.component.getByName = () => stubComponent;
        globalAny.window.manywho.utils.isEqual = () => true;

        componentWrapper = manyWhoMount({
            objectData: [],
            paginationSize: 23,
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                limit: 23,
            }),
            expect.any(Object),
            expect.any(Object),
        ); 

    });

    test('Pagination size is retreived from settings', () => {
        
        const stubComponent = jest.fn(() => <div/>);

        globalAny.window.manywho.component.getByName = () => stubComponent;
        globalAny.window.manywho.utils.isEqual = () => true;
        globalAny.window.manywho.settings.flow = () => 16;

        componentWrapper = manyWhoMount({
            objectData: [],
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                limit: 16,
            }),
            expect.any(Object),
            expect.any(Object),
        ); 

    });

    test('id, parentId, flowKey, isDesignTime are passed directly to child component', () => {
        const stubComponent = jest.fn(() => <div/>);

        const id = utils.generateRandomString(4);
        const parentId = utils.generateRandomString(4);
        const flowKey = utils.generateRandomString(4);
        const isDesignTime = true;
        
        globalAny.window.manywho.component.getByName = () => stubComponent;

        componentWrapper = manyWhoMount({
            id, parentId, flowKey, isDesignTime,
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                id, parentId, flowKey, isDesignTime,
            }),
            expect.any(Object),
            expect.any(Object),
        ); 
    });

    test('isLoading is correctly passed to child component', () => {
        const stubComponent = jest.fn(() => <div/>);
        
        globalAny.window.manywho.component.getByName = () => stubComponent;

        componentWrapper = manyWhoMount({
            loading: true,
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                isLoading: true,
            }),
            expect.any(Object),
            expect.any(Object),
        ); 
    });

    test('Page number is correctly passed to child component', () => {
        const stubComponent = jest.fn(() => <div/>);
        
        globalAny.window.manywho.component.getByName = () => stubComponent;

        componentWrapper = manyWhoMount({
            page: 42,
        });
        
        expect(stubComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 42,
            }),
            expect.any(Object),
            expect.any(Object),
        ); 
    });

    test('sort method updates state.sortedBy property', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: {},
        });

        const str = utils.generateRandomString(5);

        componentWrapper.instance().sort(str);

        expect(componentWrapper.state().sortedBy).toBe(str);
    });

    test('sort method toggles state.sortedIsAscending property', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: {},
        });
        
        const str = utils.generateRandomString(5);

        expect(componentWrapper.state().sortedIsAscending).toBe(null);

        componentWrapper.instance().sort(str);

        expect(componentWrapper.state().sortedIsAscending).toBe(true);

        componentWrapper.instance().sort(str);

        expect(componentWrapper.state().sortedIsAscending).toBe(false);
    });

    test('sort method logs an error when ObjectDataRequest is null', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const str = utils.generateRandomString(5);

        componentWrapper.instance().sort(str);

        expect(globalAny.window.manywho.log.error).toBeCalledWith(expect.any(String));
    });

    test('search method resets sorting state', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const str = utils.generateRandomString(5);

        componentWrapper.instance().sort(str);
        componentWrapper.instance().search(str, false);

        expect(componentWrapper.state().sortedIsAscending).toBe(null);
        expect(componentWrapper.state().sortedBy).toBe(null);
    });

    test('search method clears selection when clearSelection param is true', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const clearSpy = jest.spyOn(componentWrapper.instance(), 'clearSelection');

        componentWrapper.instance().search('', true);

        expect(clearSpy).toBeCalledWith(false);
    });

    test('search is cleared when clearSelection is called with true param', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const setComponentSpy = globalAny.window.manywho.state.setComponent = jest.fn();

        componentWrapper.instance().search(utils.generateRandomString(5), true);
        componentWrapper.instance().clearSelection(true);

        expect(setComponentSpy).toBeCalledWith(
            expect.anything(),
            expect.objectContaining({
                search: null,
            }),
            expect.anything(),
            expect.anything(),
        );
    });
    
    test('component.onOutcome gets called within instance onOutcome method', () => {
        componentWrapper = manyWhoMount();

        componentWrapper.instance().onOutcome(
            utils.generateRandomString(4),
            utils.generateRandomString(4),
        );

        expect(globalAny.window.manywho.component.onOutcome).toBeCalled();
    });
    
    test('load method calls manywho.engine.objectDataRequest if model.objectDataRequest is present', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: {},
        });

        componentWrapper.instance().load();
        
        expect(globalAny.window.manywho.engine.objectDataRequest).toBeCalled();
    });
    
    test('load method calls manywho.engine.fileDataRequest if model.fileDataRequest is present', () => {
        componentWrapper = manyWhoMount({
            fileDataRequest: {},
        });

        componentWrapper.instance().load();
        
        expect(globalAny.window.manywho.engine.fileDataRequest).toBeCalled();
    });

    test('load method forces update if model.objectDataRequest and model.fileDataRequest are falsy', () => {
        componentWrapper = manyWhoMount();

        const forceUpdateSpy = jest.spyOn(componentWrapper.instance(), 'forceUpdate');
        
        componentWrapper.instance().load();

        expect(forceUpdateSpy).toBeCalled();
    });

});
