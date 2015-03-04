define([
    'amplify',
    'jquery',
    'fx-dashboard/views/base/collection-view',
    'fx-dashboard/views/widget-view'
], function(amplify, $, CollectionView, WidgetView) {
    'use strict';

    var WidgetsCollectionView = CollectionView.extend({
        itemView: WidgetView,
        autoRender: false,
        events : {
        },

        defaults: {

        },

        initialize: function(attributes, options) {
            this.options = _.extend(this.defaults, attributes);
            //This is useful to bind(or delegate) the this keyword inside all the function objects to the view
            //Read more here: http://documentcloud.github.com/underscore/#bindAll
            _.bindAll(this);
            _(this).bindAll('add', 'remove');

            if (!this.options.childViewConstructor) throw "no child view constructor provided";

            this._childViewConstructor = this.options.childViewConstructor;

            this._childViews = [];

            this.collection.fetch({
                add: true,
                success: this.loadComplete,
                error: this.errorHandler
            });

             this.collection.bind('add', this.add);
            //this.collection.bind('remove', this.remove);
       },

        add : function(model) {
           // console.log("ADD ++++++++++++++++++++++");
           // console.log(model);

            var childView = new this._childViewConstructor({
                el: $(this.listSelector),
                model : model
            });

            this._childViews.push(childView);

            if (this._rendered) {
                $(this.listSelector).append(childView.render().el);
             }
        },

        remove : function(model) {
            var viewToRemove = _(this._childViews).select(function(cv) { return cv.model === model; })[0];
            this._childViews = _(this._childViews).without(viewToRemove);

            if (this._rendered) $(viewToRemove.el).remove();
        },

        render : function() {
            var that = this;
            this._rendered = true;

            _(this._childViews).each(function(childView) {
                //console.log("RENDER::: HERE CHILD VIEW");
               // $(that.el).append(childView.render().el);
            });

            return this;
        },


        loadComplete : function(response){
            //console.log("===================== WIDGETS VIEW ================================ loadComplete");
            amplify.publish('fx.component.dashboard.collectionrendered', this.collection);
           // Chaplin.mediator.publish('collectionRenderedEvent',this.collection);
        },

        errorHandler : function(){
            throw "Error loading JSON file";
        }

    });

    return WidgetsCollectionView;
});