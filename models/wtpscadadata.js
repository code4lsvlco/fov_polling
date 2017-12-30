var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WtpScadaDataSchema = new Schema({
  TagName: { type: String, index: true },
  Timestamp: { type: Date, index: true },
  Value: { type: String },
  Quality: { type: String }
});

module.exports = mongoose.model('WtpScadaData', WtpScadaDataSchema);