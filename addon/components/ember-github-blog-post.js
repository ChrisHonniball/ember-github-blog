import Ember from 'ember';
import layout from '../templates/components/ember-github-blog-post';

export default Ember.Component.extend({
  layout: layout,
  
  classNames: ['ember-github-blog-post'],
  
  
  ///////////////
  //! Computed //
  ///////////////
  
  nicename: Ember.computed('model.post_name', {
    get: function(){
      var that = this;
      
      return that.get('model.post_name').replace(/-|_/g, ' ');
    }
  }),
  
  willInsertElement: function() {
    var that = this,
      promise = new Ember.RSVP.Promise(function(resolve, reject){
        var ajaxSettings = {
          "type": "GET",
          "url": "https://api.github.com/repos/ChrisHonniball/chrishonniball.github.io/contents/_posts/" + that.get('model.post_name') + ".md",
          "dataType": "json",
          "success": resolve,
          "error": reject
        };
        
        Ember.$.ajax(ajaxSettings);
      }).then(function(response) {
        console.log(response);
      }, function(error) {
        console.log(
          "%c%s#promise ERROR :%O",
          "color: red", // http://www.w3schools.com/html/html_colornames.asp
          that.toString(),
          error
        );
      });
    
    /* */
    console.log(
      "%c%s#willInsertElement - Get GitHub post `%s` now...",
      "color: purple", // http://www.w3schools.com/html/html_colornames.asp
      that.toString(),
      that.get('model.post_name')
    );
    //*/
  }
});
