const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');

const gigSchema = new mongoose.Schema({
    owner: {type:mongoose.SchemaTypes.ObjectId, ref: 'Users'},
    title: String,
    category: String,
    description: String,
    price: Number,
    picture: {type: String, default: 'http://placehold.it/350x150'},
    created: {type: Date, default: Date.now}
});

gigSchema.plugin(mongooseAlgolia,{
    appId: 'S61XR194QB',
    apiKey: '31027bbb5563a937ac3fb2597ed04c6b',
    indexName: 'GigSchema', //The name of the index in Algolia, you can also pass in a function
    selector: 'title _id owner category about price picture', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
    populate: {
      path: 'owner',
      select: 'name'
    },
    defaults: {
      author: 'unknown'
    },
    mappings: {
      title: function(value) {
        return `Title: ${value}`
      }
    },
    debug: true // Default: false -> If true operations are logged out in your console
  });
  
  
  let Model = mongoose.model('gigs', gigSchema);
  
  Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
  Model.SetAlgoliaSettings({
    searchableAttributes: ['title','owner.name',''] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
  });

module.exports = Model