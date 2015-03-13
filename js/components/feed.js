(function (manywho) {

    var feed = React.createClass({

        onToggleFollow: function(e) {

            manywho.social.toggleFollow(this.props.flowKey);

        },

        onRefresh: function(e) {

            manywho.social.refreshMessages(this.props.flowKey);

        },

        onGetNextPage: function(e) {

            manywho.social.getMessages(this.props.flowKey);

        },

        onNewMessageChange: function(e) {

            this.setState({ message: e.currentTarget.value });

        },

        onCommentChange: function (e) {

            var state = this.state;
            state.comments[e.currentTarget.getAttribute('data-message-id')] = e.currentTarget.value;

            this.setState(state);

        },

        onSendMessage: function(e) {

            if ((e.keyCode && e.keyCode == 13 && !e.shiftKey) || !e.keyCode) {

                e.stopPropagation();
                e.preventDefault();

                var self = this;

                manywho.social.sendMessage(this.props.flowKey, this.state.message)
                    .done(function () {

                        self.setState({ message: '' });

                    });

            }           

        },

        onSendComment: function(e) {

            if ((e.keyCode && e.keyCode == 13 && !e.shiftKey) || !e.keyCode) {

                e.stopPropagation();
                e.preventDefault();

                var self = this;
                var messageId = e.currentTarget.getAttribute('data-message-id');
                
                if (!manywho.utils.isNullOrWhitespace(this.state.comments[messageId])) {

                    manywho.social.sendMessage(this.props.flowKey, this.state.comments[messageId], messageId)
                        .done(function () {

                            var state = self.state;
                            state.comments[messageId] = '';

                            self.setState(state);

                        });

                }

            }

        },

        renderInput: function() {

            return React.DOM.div({ className: 'input-group feed-post' }, [
                React.DOM.div({ className: 'input-group-btn feed-post-button' }, React.DOM.button({ className: 'btn btn-primary', onClick: this.onSendMessage }, 'Post')),
                React.DOM.textarea({ className: 'form-control feed-post-text', rows: '2', onKeyUp: this.onSendMessage, onChange: this.onNewMessageChange, value: this.state.message  }, null)
            ]);

        },

        renderCommenting: function(isEnabled, parentId) {

            if (isEnabled) {

                return React.DOM.div({ className: 'input-group feed-comment' }, [
                        React.DOM.span({ className: 'input-group-btn' }, React.DOM.button({ className: 'btn btn-primary', onClick: this.onSendComment, 'data-message-id': parentId }, 'Comment')),
                        React.DOM.input({ className: 'form-control feed-comment-input', type: 'text', onKeyUp: this.onSendComment, onChange: this.onCommentChange, value: this.state.comments[parentId], 'data-message-id': parentId }, null)
                    ])
                
            }

            return null;

        },

        renderThread: function(messages, isCommentingEnabled) {

            if (messages) {

                return React.DOM.ul({ className: 'media-list' }, messages.map(function (message) {

                    var createdDate = new Date(message.createdDate);

                    return React.DOM.li({ className: 'media' }, [
                        React.DOM.div({ className: 'media-left' },
                            React.DOM.a({ href: '#' },
                                React.DOM.img({ className: 'media-object', src: message.sender.avatarUrl, width: '32', height: '32' }, null)
                            )
                        ),
                        React.DOM.div({ className: 'media-body feed-message' }, [
                            React.DOM.div({ className: 'media-heading' }, [
                                React.DOM.span({ className: 'feed-sender' }, message.sender.fullName),
                                React.DOM.span({ className: 'feed-created-date' }, createdDate.toLocaleString()),
                            ]),
                            React.DOM.span({ className: 'feed-message-text' }, message.text),
                            this.renderCommenting(isCommentingEnabled, message.id),
                            this.renderThread(message.comments, false)
                        ])
                    ]);

                }, this));

            }

            return null;

        },

        renderFollowers: function(followers) {

            if (followers) {
                
                var followerElements = followers.map(function (follower) {

                    return React.DOM.img({ className: 'feed-follower', src: follower.avatarUrl, title: follower.fullName, width: '32', height: '32' });

                });

                return React.DOM.div({ className: 'feed-followers' }, [ React.DOM.h4(null, 'Followers') ].concat(followerElements));

            }

            return null;

        },

        getInitialState: function() {

            return {
                message: null,
                comments: {}
            }

        },

        render: function () {

            var stream = manywho.social.getStream(this.props.flowKey);

            if (stream && stream.me) {

                log.info('Rendering Feed');

                var streamMessages = stream.messages || {};
                var loading = manywho.state.getLoading('feed', this.props.flowKey);
                
                var followCaption = (stream.me.isFollower) ? 'Un-Follow' : 'Follow';
                var isFooterVisible = streamMessages.nextPage && streamMessages.nextPage > 1;
                
                return React.DOM.div({ className: 'panel panel-default feed', onKeyUp: this.onEnter }, [
                    React.DOM.div({ className: 'panel-heading clearfix' }, [
                        React.DOM.h3({ className: 'panel-title pull-left' }, 'Feed'),
                        React.DOM.div({ className: 'pull-right btn-group' }, [
                            React.DOM.button({ className: 'btn btn-default', onClick: this.onToggleFollow }, [
                                React.DOM.span({ className: 'glyphicon glyphicon-pushpin'}, null),
                                ' ' + followCaption
                            ]),
                            React.DOM.button({ className: 'btn btn-default', onClick: this.onRefresh }, [
                                React.DOM.span({ className: 'glyphicon glyphicon-refresh' }, null),
                                ' Refresh'
                            ])
                        ])                        
                    ]),
                    React.DOM.div({ className: 'panel-body' }, [
                        this.renderFollowers(stream.followers),
                        this.renderInput(),
                        this.renderThread(streamMessages.messages, true)
                    ]),
                    React.DOM.div({ className: 'panel-heading clearfix ' + (!isFooterVisible) ? 'hidden' : '' },
                        React.DOM.button({ className: 'btn btn-default pull-right', onClick: this.onGetNextPage }, 'More')
                    ),
                    React.createElement(manywho.component.getByName('wait'), loading, null)
                ]);
                
            }
            
            return null;

        }

    });

    manywho.component.register("feed", feed);

}(manywho));

