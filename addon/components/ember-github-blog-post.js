import Ember from 'ember';
import layout from '../templates/components/ember-github-blog-post';

export default Ember.Component.extend({
  layout: layout,
  
  store: Ember.inject.service(),
  
  classNames: ['ember-github-blog-post'],
  
  didRender: function(){
    var that = this,
      config = that.container.lookupFactory('config:environment');
    
    if(!that.get('model.htmlContent')) {
      return false;
    }
    
    if(config.emberGithubBlog.highlightjsEnabled) {
      that.$('pre').each(function(_i, block) {
        hljs.highlightBlock(block);
      });
    }
  },
  
  willInsertElement: function(){
    var that = this;
    
    that.send('loadPost');
  },
  
  //////////////
  //! Actions //
  //////////////
  
  actions: {
    loadPost: function() {
      var that = this,
        config = that.container.lookupFactory('config:environment'),
        promise = new Ember.RSVP.Promise(function(resolve, reject){
          that.set('loadingPost', true);
          
          var ajaxSettings = {
            "type": "GET",
            "url": "https://api.github.com/repos/" + config.emberGithubBlog.username + "/" + config.emberGithubBlog.repository + "/contents/" + config.emberGithubBlog.postsPath + "/" + that.get('post') + ".md",
            "dataType": "json",
            "success": resolve,
            "error": reject
          };
          
          Ember.$.ajax(ajaxSettings);
        }).then(function(post) {
          var model = {
            id: post.sha,
            type: 'ember-github-blog-post',
            attributes: post
          };
          
          that.setProperties({
            'model': that.get('store').push({
              data: model
            }),
            'loadingPost': false
          });
        }, function(error) {
          console.log(
            "%c%s#loadPost ERROR: %O",
            "color: red", // http://www.w3schools.com/html/html_colornames.asp
            that.toString(),
            error
          );
        });
    
      return promise;
    }
  }
});
