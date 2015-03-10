'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DisputeSchema = new Schema({
  Ref: String,
  Client: String,
  Account: String,
  Amount: Number,
  Description: String,
  Question: String,
  Answer: String,
  Status:String
});

module.exports = mongoose.model('Dispute', DisputeSchema);