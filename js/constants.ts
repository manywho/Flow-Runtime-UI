export const METADATA_TYPES = {
    visible: 'METADATA.VISIBLE',
    required: 'METADATA.REQUIRED',
    enabled: 'METADATA.ENABLED',
};

export const CRITERIA = {
    isEmpty: 'IS_EMPTY',
    isEqual: 'EQUAL',
    isNotEqual: 'NOT_EQUAL',
};

export const DEFAULT_POLL_INTERVAL = 30000;

export const STRIP_VALUE_TAGS_REGEX = /[^a-zA-Z0-9 ]/g;

export const CONTENT_TYPES = {
    OBJECT: 'ContentObject',
    BOOLEAN: 'ContentBoolean',
    STRING: 'ContentString',
    LIST: 'ContentList',
    NUMBER: 'ContentNumber',
    DATETIME: 'ContentDateTime',
    PASSWORD: 'ContentPassword',
    CONTENT: 'ContentContent',
};
