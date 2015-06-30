import Ember from 'ember';
import layout from '../templates/components/ember-github-blog-post-list';

export default Ember.Component.extend({
  layout: layout,
  
  store: Ember.inject.service(),
  
  classNames: ['ember-github-blog-post-list'],
  
  sortProperties: ['postDate:desc', 'id:asc'],
  
  sortedPosts: Ember.computed.sort('model', 'sortProperties'),
  
  /////////////
  //! Events //
  /////////////
  
  willInsertElement: function() {
    var that = this,
      config = that.container.lookupFactory('config:environment'),
      promise = new Ember.RSVP.Promise(function(resolve, reject){
        that.set('loadingPosts', true);
        
        var ajaxSettings = {
          "type": "GET",
          "url": "https://api.github.com/repos/" + config.emberGithubBlog.username + "/" + config.emberGithubBlog.repository + "/contents/" + config.emberGithubBlog.postsPath,
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
        response.forEach(function(post) {
          post.name = post.name.replace(/\.(.*)$/, '');
          post.id = post.sha;
        });
        
        that.setProperties({
          'model': that.get('store').pushMany('ember-github-blog-post', response),
          'loadingPosts': false
        });
      }, function(error) {
        console.error(error);
      });
    
    return promise;
  },
  
  
  //////////////
  //! Actions //
  //////////////
});
