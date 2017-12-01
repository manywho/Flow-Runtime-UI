import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import TableInput from '../js/components/table-input';

describe('Table input component behaviour', () => {

    let tableInputWrapper;
    const globalAny:any = global;
    const props = {
        id: 'string',
        parentId: 'string',
        flowKey: 'string',
        contentType: 'string',
        contentFormat: 'string',
        propertyId: 'string',
        onCommitted: jest.fn(),
        value: 'any',
    };

    function manyWhoMount() {
        globalAny.window.manywho['utils'] = {
            isEqual: jest.fn(),
        };
        globalAny.window.manywho.component['contentTypes'] = {
            boolean: 'CONTENTBOOLEAN',
            content: 'CONTENTCONTENT',
            datetime: 'CONTENTDATETIME',
            list: 'CONTENTLIST',
            number: 'CONTENTNUMBER',
            object: 'CONTENTOBJECT',
            password: 'CONTENTPASSWORD',
            string: 'CONTENTSTRING',
        };
        return mount(<TableInput {...props} />);
    }

    afterEach(() => {
        tableInputWrapper.unmount();
    });

    test('Table input component renders without crashing', () => {
        tableInputWrapper = manyWhoMount();
        expect(tableInputWrapper.length).toEqual(1);
    });

    test('Table input component gets registered', () => {
        tableInputWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
