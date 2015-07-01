/* jshint node: true */
'use strict';

var _ = require('lodash');

module.exports = {
  name: 'ember-github-blog',
  
  included: function(app) {
    this._super.included(app);
    
    var settings = app.project.config().emberGithubBlog;
    
    if(!settings) {
      settings = _.merge(settings, {
        username: null,
        repository: null,
        branch: null,
        postsPath: null,
        highlightjsEnabled: true,
        highlightjsTheme: 'tomorrow'
      });
    }
    
    if(!settings.highlightjsTheme) {
      settings.highlightjsTheme = 'tomorrow';
    }
    
    // Import the javascript.
    app.import(app.bowerDirectory + '/marked/marked.min.js');
    app.import(app.bowerDirectory + '/highlightjs/highlight.pack.js');
    app.import(app.bowerDirectory + '/highlightjs/styles/' + settings.highlightjsTheme + '.css');
  },
  
  isDevelopingAddon: function() {
    return true;
  }
};
