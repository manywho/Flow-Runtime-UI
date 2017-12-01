
/**
 * A setup files used by jest for adding
 * mock objects to the global namespace that
 * the Tooling expects to be there.
 */
 
// The global ManyWho object
window.manywho = {
    adminTenantId: 'test',
    cdnUrl: '',
    component: {
        getChildComponents: jest.fn(),
        getByName: jest.fn(),
        register: jest.fn(),
        registerItems: jest.fn(),
        registerContainer: jest.fn(),
        getDisplayColumns: jest.fn(() => []),
    },
    log: {
        info: jest.fn(),
    },
    styling: {
        registerContainer: jest.fn(),
        getClasses: jest.fn(() => []),
    },
    model: {
        getChildren: jest.fn(() => []),
        getComponent: jest.fn(() => ({})),
        getContainer: jest.fn(() => ({})),
        getOutcomes: jest.fn(),
    },
    state: {
        getComponent: jest.fn(),
        getComponents: jest.fn(() => ({})),
        setComponent: jest.fn(() => ({})),
    },
    utils: {
        convertToArray: jest.fn(() => []),
        isNullOrWhitespace: jest.fn(),
        isNullOrUndefined: jest.fn(() => true),
        isEqual: jest.fn(),
        guid: jest.fn(() => 'xxx'),
    },
    tours: {
        getTargetElement: jest.fn(() => {
            return {
                getBoundingClientRect: jest.fn()
            }
        }),
    },
    settings: {
        global: jest.fn(),
    },
    social: {
        getStream: jest.fn(),
    },
    formatting: {
        toMomentFormat: jest.fn(() => 'xxx'),
    }
};

