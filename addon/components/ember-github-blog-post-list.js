import Ember from 'ember';
import layout from '../templates/components/ember-github-blog-post-list';

export default Ember.Component.extend({
  layout: layout,
  
  classNames: ['ember-github-blog-post-list'],
  
  
  /////////////
  //! Events //
  /////////////
  
  willInsertElement: function() {
    var that = this;
    
    /* */
    console.log(
      "%c%s#willInsertElement - Get GitHub post list now...",
      "color: purple", // http://www.w3schools.com/html/html_colornames.asp
      that.toString()
    );
    //*/
  },
  
  
  //////////////
  //! Actions //
  //////////////
});
