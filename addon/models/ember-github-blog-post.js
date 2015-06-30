import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  download_url: DS.attr('string'),
  git_url: DS.attr('string'),
  html_url: DS.attr('string'),
  name: DS.attr('string'),
  path: DS.attr('string'),
  size: DS.attr('string'),
  type: DS.attr('string'),
  url: DS.attr('string'),
  sha: DS.attr('string'),
  content: DS.attr('string'),
  
  
  ///////////////
  //! Computed //
  ///////////////
  
  basename: Ember.computed('name', {
    get: function(){
      return this.get('name').replace(/([0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}-)(.*)/, '$2').replace(/\.(.*)$/, '');
    }
  }),
  
  nicename: Ember.computed('name', {
    get: function(){
      return this.get('name').replace(/([0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}-)(.*)/, '$2').replace(/\.(.*)$/, '').replace(/-|_/g, ' ');
    }
  }),
  
  postDate: Ember.computed('name', {
    get: function(){
      return this.get('name').match(/([0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2})/)[1];
    }
  }),
  
  mdContent: Ember.computed('content', {
    get: function(){
      var that = this;
      
      if(!that.get('content')) {
        that.loadContent();
        
        return undefined;
      }
      
      var mdContent = window.atob(that.get('content'));
      
      return mdContent;
    }
  }),
  
  htmlContent: Ember.computed('mdContent', {
    get: function() {
      var that = this;
      
      if(!that.get('mdContent')) {
        return undefined;
      }
      
      var content = that.get('mdContent').replace(/^---([\s\S]*?)---\n\n/, ''),
        formattedContent = marked(content);
      
      return formattedContent;
    }
  }),
  
  postMeta: Ember.computed('mdContent', {
    get: function() {
      var that = this;
      
      if(!that.get('mdContent')) {
        return undefined;
      }
      
      var matches = that.get('mdContent').match(/^---\n([\s\S]*?)\n---\n\n/, ''),
        postMeta = matches[1],
        searchFlags = ['title', 'description', 'summary', 'tags'],
        postMetaObj = {
          string: postMeta
        };
      
      searchFlags.forEach(function(term) {
        var matches = postMeta.match(new RegExp(term + ": (.*)"), '$1');
        
        if(matches) {
          postMetaObj[term] = matches[1];
        } else {
          postMetaObj[term] = undefined;
        }
      });
      
      postMetaObj.tags = postMetaObj.tags.replace(', ', ',').split(',');
      
      return postMetaObj;
    }
  }),
  
  
  //////////////
  //! Actions //
  //////////////
  
  loadContent: function() {
    var that = this,
      config = that.container.lookupFactory('config:environment'),
      promise = new Ember.RSVP.Promise(function(resolve, reject){
        that.set('loadingContent', true);
        
        var ajaxSettings = {
          "type": "GET",
          "url": "https://api.github.com/repos/" + config.emberGithubBlog.username + "/" + config.emberGithubBlog.repository + "/contents/" + that.get('path'),
          "dataType": "json",
          "success": function(response){
            resolve(response);
          },
          "error": function(error){
            console.log(
              "%c%s#promise ERROR :%O",
              "color: red", // http://www.w3schools.com/html/html_colornames.asp
              that.toString(),
              error
            );
            reject(error);
          }
        };
        
        Ember.$.ajax(ajaxSettings);
      }).then(function(response) {
        that.setProperties({
          'content': response.content,
          'loadingContent': false
        });
      }, function(error) {
        console.error(error);
      });
  
    return promise;
  }
});
