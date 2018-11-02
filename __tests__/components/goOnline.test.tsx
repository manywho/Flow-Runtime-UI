import * as React from 'react';
import { mount } from 'enzyme';
import { GoOnline } from '../../js/components/GoOnline';
import Request from '../../js/components/Request';

jest.mock('../../js/services/Storage', () => ({
    getOfflineData: jest.fn(() => Promise.resolve({})),
    removeOfflineData: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../js/models/Flow', () => ({
    FlowInit: jest.fn(() => {
        return {
            requests: [{ key: 'test' }],
            state: {
                id: 'test',
                token: 'test',
            },
            tenantId: 'test',
        };
    }),
}));

const globalAny: any = global;

describe('GoOnline component behaviour', () => {

    let componentWrapper;

    const props = {
        flowKey: '',
        onOnline: jest.fn(),
        onClose: jest.fn(),
        toggleIsReplaying: jest.fn(),
    };

    beforeEach(() => {
        componentWrapper = mount(<GoOnline {...props} />);
    });

    test('GoOnline component renders without crashing', () => {
        expect(componentWrapper.length).toEqual(1);
    });

    test('The request component always gets an auth token from state passed as a prop', () => {
        const mockAuthenticationToken = 'test auth';
        globalAny.manywho.state.getAuthenticationToken.mockImplementation(() => {
            return mockAuthenticationToken;
        });
        componentWrapper.setState({});
        const requestComponent = componentWrapper.find(Request);
        expect(requestComponent.props().authenticationToken).toEqual(mockAuthenticationToken);
    });

});
