const settings = require('../settings');
const mongoose = settings.database;
const {getQueryObj} = require('../nkcModules/apiFunction');
const Schema = mongoose.Schema;
let personalForumsSchema = new Schema({
  uid: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    default: 'forum'
  },
  abbr: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  descriptionOfForum: {
    type: String,
    required: true
  },
  moderators: {
    type: [String],
    default: []
  },
  recPosts: {
    type: [String],
    default: []
  },
  toppedThreads: {
    type: [String],
    default: []
  },
  announcement: {
    type: String,
    default: ''
  }
});

personalForumsSchema.methods.extendModerator = function() {
  const {collection} = mongoose.connection.db;
  this.moderators = collection('users').find({uid: {$in: this.moderators}})
};


module.exports = mongoose.model('personalForums', personalForumsSchema, 'personalForums');