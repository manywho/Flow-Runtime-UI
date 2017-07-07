/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

export default {

    generateFlowInputs(inputsData) {
        if (inputsData && !Array.isArray(inputsData))
            inputsData = [inputsData];

        return inputsData.map(input => {

            for (const property in input) {
                if (input[property].objectData)
                    return {
                        'contentType': input[property].objectData.length > 1 ? 'ContentList' : 'ContentObject',
                        'contentValue': null,
                        'developerName': property,
                        'objectData': [input[property].objectData],
                        'typeElementDeveloperName': input[property].typeElementDeveloperName || null
                    };
                else if (input[property].contentType && input[property].developerName)
                    return input[property];
                else
                    return {
                        'contentType': 'Content' + (typeof input[property]).charAt(0).toUpperCase() + (typeof input[property]).substring(1).toLowerCase() || 'ContentString',
                        'contentValue': input[property],
                        'developerName': property,
                        'objectData': null,
                        'typeElementDeveloperName': null
                    };
            };
        });
    },

    generateInitializationRequest(flowId, stateId, annotations, inputs, playerUrl, joinUrl, mode, reportingMode) {
        return {
            'flowId': {
                'id': flowId.id,
                'versionId': flowId.versionid || flowId.versionId || null
            },
            'stateId': stateId || null,
            'annotations': annotations || null,
            'inputs': inputs || null,
            'playerUrl': playerUrl || null,
            'joinPlayerUrl': joinUrl || null,
            'mode': mode || '',
            'reportingMode': reportingMode || ''
        };
    },

    generateInvokeRequest(stateData, invokeType, selectedOutcomeId, selectedMapElementId, pageComponentInputResponses, navigationElementId, selectedNavigationElementId, annotations, location, mode) {
        return {
            'stateId': stateData.id,
            'stateToken': stateData.token,
            'currentMapElementId': stateData.currentMapElementId,
            'invokeType': invokeType,
            'annotations': annotations || null,
            'geoLocation': location || null,
            'mapElementInvokeRequest': {
                'pageRequest': {
                    'pageComponentInputResponses': pageComponentInputResponses || null
                },
                'selectedOutcomeId': selectedOutcomeId || null
            },
            'mode': mode || '',
            'selectedMapElementId': selectedMapElementId || null,
            'navigationElementId': navigationElementId || null,
            'selectedNavigationElementId': selectedNavigationElementId || null
        };
    },

    generateNavigateRequest(stateData, navigationId, navigationElementId, mapElementId, pageComponentInputResponses, annotations, location) {
        return {
            'stateId': stateData.id,
            'stateToken': stateData.token,
            'currentMapElementId': stateData.currentMapElementId,
            'invokeType': 'NAVIGATE',
            'navigationElementId': navigationId,
            'selectedMapElementId': mapElementId,
            'selectedNavigationItemId': navigationElementId,
            'annotations': annotations || null,
            'geoLocation': location || null,
            'mapElementInvokeRequest': {
                'pageRequest': {
                    'pageComponentInputResponses': pageComponentInputResponses || null
                },
                'selectedOutcomeId': null
            }
        };
    },

    generateSessionRequest(sessionId, sessionUrl, loginUrl, username, password, token) {
        return {
            'sessionToken': sessionId,
            'sessionUrl': sessionUrl,
            'loginUrl': loginUrl,
            'username': username || null,
            'password': password || null,
            'token': token || null
        };
    }

};

