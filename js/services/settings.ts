/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

manywho.settings = (function (manywho, $) {

    let globals = {
        localization: {
            initializing: '',
            executing: '',
            loading: '',
            navigating: '',
            syncing: '',
            joining: 'Joining',
            sending: 'Sending',
            returnToParent: 'Return To Parent',
            noResults: 'No Results',
            status: null,
            validation: {
                required: 'This field is required'
            },
            searchFirst: 'Perform a search to display results here'
        },
        i18n: {
            overrideTimezoneOffset: false,
            timezoneOffset: null,
            culture: null
        },
        paging: {
            table: 10,
            files: 10,
            select: 250,
            tiles: 20
        },
        collaboration: {
            uri: 'https://realtime.manywho.com'
        },
        platform: {
            uri: ''
        },
        navigation: {
            isFixed: true,
            isWizard: false
        },
        files: {
            downloadUriPropertyId: '6611067a-7c86-4696-8845-3cdc79c73289',
            downloadUriPropertyName: 'Download Uri'
        },
        richText: {
            url: 'https://cdn.tinymce.com/4/tinymce.min.js',
            fontSize: '14px',
            plugins: [
                'advlist autolink link lists link image charmap print hr anchor spellchecker',
                'searchreplace visualblocks fullscreen wordcount code insertdatetime',
                'media table directionality emoticons contextmenu paste textcolor'
            ],
            toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link mwimage'
        },
        errorMessage: 'Whoops, something went wrong inside ManyWho - if this keeps happening, contact us at support@manywho.com',
        outcomes: {
            display: null,
            isFixed: false,
        },
        shortcuts: {
            progressOnEnter: true
        },
        isFullWidth: false,
        collapsible: {
            default: {
                enabled: false,
                collapsed: false,
                group: null
            }
        },
        history: false,
        containerSelector: '#manywho',
        syncOnUnload: true,
        toggle: {
            shape: 'round',
            background: null
        },
        charts: {
            backgroundColors: ['#42a5f5', '#66bb6a', '#ef5350', '#ab47bc', '#ffa726', '#78909c', '#5c6bc0'],
            borderColors: ['#42a5f5', '#66bb6a', '#ef5350', '#ab47bc', '#ffa726', '#78909c', '#5c6bc0'],
            options: {},
            bar: {
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            },
            line: {
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            },
            polarArea: {
                backgroundColors: ['rgba(66, 165, 245, 0.4)', 'rgba(102, 187, 106, 0.4)', 'rgba(239, 83, 80, 0.4)', 'rgba(171, 71, 188, 0.4)', 'rgba(255, 167, 38, 0.4)', 'rgba(120, 144, 156, 0.4)', 'rgba(92, 107, 192, 0.4)']
            }
        },
        validation: {
            isEnabled: false
        },
        location: {
            isTrackingEnabled: false
        },
        formatting: {
            isEnabled: false,
            currency: '0.00'
        },
        tours: {
            defaults: {
                target: null,
                title: null,
                content: null,
                placement: 'bottom',
                showNext: true,
                showBack: true,
                offset: null,
                align: 'center',
                order: null,
                querySelector: false
            },
            autoStart: false,
            container: '.mw-bs'
        },
        components: {
            static: []
        }
    };

    let flows = {};

    let themes = {
        url: '/css/themes'
    };

    let events = {
        initialization: {},
        invoke: {},
        sync: {},
        navigation: {},
        join: {},
        flowOut: {},
        login: {},
        log: {},
        objectData: {},
        fileData: {},
        getFlowByName: {},
        sessionAuthentication: {},
        social: {},
        ping: {}
    };

    return {
        initialize(custom, handlers) {
            globals = $.extend(true, {}, globals, custom);
            events = $.extend(true, {}, events, handlers);
        },

        initializeFlow(settings, flowKey) {
            const lookUpKey = manywho.utils.getLookUpKey(flowKey);
            flows[lookUpKey] = $.extend(true, {}, globals, settings);
        },

        global(path, flowKey, defaultValue) {
            const lookUpKey = manywho.utils.getLookUpKey(flowKey);
            const globalValue = manywho.utils.getValueByPath(globals, path.toLowerCase());

            if (flowKey) {
                const flowValue = manywho.utils.getValueByPath(flows[lookUpKey] || {}, path.toLowerCase());

                if (typeof flowValue !== 'undefined')
                    return flowValue;
                else if (typeof globalValue !== 'undefined')
                    return globalValue;
                else if (typeof defaultValue !== 'undefined')
                    return defaultValue;
            }

            return globalValue;
        },

        flow(path, flowKey) {
            const lookUpKey = manywho.utils.getLookUpKey(flowKey);

            if (manywho.utils.isNullOrWhitespace(path))
                return flows[lookUpKey];
            else
                return manywho.utils.getValueByPath(flows[lookUpKey] || {}, path.toLowerCase());
        },

        event(path) {
            return manywho.utils.getValueByPath(events, path.toLowerCase());
        },

        theme(path) {
            return manywho.utils.getValueByPath(themes, path.toLowerCase());
        },

        isDebugEnabled(flowKey, value) {
            const lookUpKey = manywho.utils.getLookUpKey(flowKey);

            if (typeof value === 'undefined')
                return manywho.utils.isEqual(this.flow('mode', flowKey), 'Debug', true) || manywho.utils.isEqual(this.flow('mode', flowKey), 'Debug_StepThrough', true);
            else
                if (value)
                    flows[lookUpKey].mode = 'Debug';
                else
                    flows[lookUpKey].mode = '';
        },

        remove(flowKey) {
            const lookUpKey = manywho.utils.getLookUpKey(flowKey);
            flows[lookUpKey] == null;
            delete flows[lookUpKey];
        }
    };

})(manywho, jQuery);
