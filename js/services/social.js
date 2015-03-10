manywho.social = (function (manywho) {

    var streams = {}

    return {

        initialize: function(flowKey, streamId) {

            manywho.state.setLoading('feed', { message: 'Loading' }, flowKey);

            var tenantId = manywho.utils.extractTenantId(flowKey);
            var stateId = manywho.utils.extractStateId(flowKey);
            var authenticationToken = manywho.state.getAuthenticationToken(flowKey);

            streams[flowKey] = {
                id: streamId
            };

            return manywho.ajax.getSocialMe(tenantId, streamId, stateId, authenticationToken)
                .then(function (response) {

                    streams[flowKey].me = response;

                    return manywho.ajax.getSocialFollowers(tenantId, streamId, stateId, authenticationToken);

                })
                .then(function (response) {

                    streams[flowKey].followers = response;

                    return manywho.ajax.getSocialMessages(tenantId, streamId, stateId, 1, 10, authenticationToken);

                })
                .then(function (response) {

                    streams[flowKey].messages = response;

                    manywho.state.setLoading('feed', null, flowKey);
                    manywho.engine.render(flowKey);

                });

        },
        
        getStream: function(flowKey) {

            return streams[flowKey];

        },

        refreshMessages: function(flowKey) {

            manywho.state.setLoading('feed', { message: 'Loading' }, flowKey);
            manywho.engine.render(flowKey);

            var tenantId = manywho.utils.extractTenantId(flowKey);
            var stateId = manywho.utils.extractStateId(flowKey);
            var authenticationToken = manywho.state.getAuthenticationToken(flowKey);
            var streamId = streams[flowKey].id;
            
            return manywho.ajax.getSocialMessages(tenantId, streamId, stateId, 1, 10, authenticationToken)
                .then(function (response) {

                    streams[flowKey].messages = response;

                    manywho.state.setLoading('feed', null, flowKey);
                    manywho.engine.render(flowKey);

                });

        },

        getMessages: function(flowKey) {

            manywho.state.setLoading('feed', { message: 'Loading' }, flowKey);
            manywho.engine.render(flowKey);

            var tenantId = manywho.utils.extractTenantId(flowKey);
            var stateId = manywho.utils.extractStateId(flowKey);
            var authenticationToken = manywho.state.getAuthenticationToken(flowKey);
            var streamId = streams[flowKey].id;

            return manywho.ajax.getSocialMessages(tenantId, streamId, stateId, streams[flowKey].messages.nextPage, 10, authenticationToken)
                .then(function (response) {

                    streams[flowKey].messages.messages = streams[flowKey].messages.messages.concat(response.messages);
                    streams[flowKey].messages.nextPage = response.nextPage;

                    manywho.state.setLoading('feed', null, flowKey);
                    manywho.engine.render(flowKey);

                });

        },

        sendMessage: function (flowKey, message, repliedTo) {

            var tenantId = manywho.utils.extractTenantId(flowKey);
            var stateId = manywho.utils.extractStateId(flowKey);
            var authenticationToken = manywho.state.getAuthenticationToken(flowKey);
            var stream = streams[flowKey];

            var request = {
                mentionsWhos: [],
                messageText: message,
                senderId: stream.me.id,
            }

            if (repliedTo) {

                request.repliedTo = repliedTo;

            }

            manywho.state.setLoading('feed', { message: 'sending' }, flowKey);
            manywho.engine.render(flowKey);

            return manywho.ajax.sendSocialMessage(tenantId, stream.id, stateId, request, authenticationToken)
                .then(function (response) {
                    
                    if (repliedTo) {

                        var repliedToMessage = stream.messages.messages.filter(function (message) {

                            return message.id == repliedTo;

                        })[0];

                        repliedToMessage.comments = repliedToMessage.comments || [];
                        repliedToMessage.comments.push(response);

                    }
                    else {

                        stream.messages.messages = stream.messages.messages || [];
                        stream.messages.messages.unshift(response);

                    }
                    
                    manywho.state.setLoading('feed', null, flowKey);
                    manywho.engine.render(flowKey);

                });

        }

    }

})(manywho);