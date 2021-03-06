const settings = require('../settings');
const mongoose = settings.database;
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  qid:{
    type: String,
    unique: true,
    required: true
  },
  tlm: {
    type: Date,
  },
  toc: {
    type: Date,
    default: Date.now,
    index: 1
  },
  category: {
    type: String,
    required: true,
    index: 1
  },
  type: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true,
    index: 1
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: [String],
    required: true
  }
},
{toObject: {
  getters: true,
  virtuals: true
}});

questionSchema.virtual('user')
  .get(function() {
    return this._user;
  })
  .set(function(u) {
    this._user = u;
  });

questionSchema.pre('save', function(next){
  try {
    if (!this.tlm) {
      this.tlm = this.toc;
    }
    return next()
  } catch(e) {
    return next(e)
  }
});


questionSchema.methods.extendUser = async function () {
  const UserModel = require('./UserModel');
  const user = await UserModel.findOnly({uid: this.uid});
  return this.user = user;
};


module.exports = mongoose.model('questions', questionSchema);