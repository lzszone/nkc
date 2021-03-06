const settings = require('../settings');
const mongoose = settings.database;
const Schema = mongoose.Schema;

const answerSheetsSchema = new Schema({
	key: {
    type: String,
    unique: true,
    required: true
  },
  uid: {
    type: String,
    default: '',
    index: 1
  },
  score: {
    type: Number,
    required: true
  },
  toc: {
    type: Date,
    default: Date.now,
    index: true
  },
  tsm: {
    type: Date,
    default: Date.now,
    index: 1
  },
  ip: {
    type: String,
    default: '0.0.0.0',
    index: 1,
  },
  isA: {
    type: Boolean,
    default: false,
    index: 1
  },
  records: {
    type: [Schema.Types.Mixed],
    required: true
  },
  category: {
    type: String,
    default: ''
  }
});
answerSheetsSchema.pre('save', function(next) {
  try {
    let num = 0;
    for (let answer of this.records) {
      if (answer.correct) {
        num++;
      }
    }
    this.score = num;
    return next()
  } catch(e) {
    return next(e)
  }
});
module.exports = mongoose.model('answerSheets', answerSheetsSchema, 'answerSheets');