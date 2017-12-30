var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripDataSchema = new Schema({
  // Asset_id: { type: Schema.Types.ObjectId, ref: 'Fleet' },
  Asset_id: { type: String, index: true },
  AssetID: { type: String, index: true },
  AssetName: String,
  DeviceICCID: { type: String, index: true },
  RecordType: { type: String, index: true },
  TripData: String,
  Latitude: { type: Number, index: true },
  Longitude: { type: Number, index: true },
  LonLat: { type: Array, index: true },
  Heading: Number,
  Speed: Number,
  Misc: String,
  InputOnStatus: Array,
  RecordDateTime: { type: Date, index: true },
  ReportDateTime: { type: Date, index: true },
  UniqueID: { type: String, index: true },
  segment_id: String
},{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

TripDataSchema
  .virtual('RecordTypeName')
  .get(function () {
    var RecordTypeName = "";
    switch(this.RecordType){
      case "aFE00":
        RecordTypeName = "Accumulator Record";
        break;
      case "aFE01":
        RecordTypeName = "Accumulator Record";
        break;
      case "rFE01":
        RecordTypeName = "Accumulator Record";
        break;
      case "cFD00":
        RecordTypeName = "Configuration Record - General";
        break;
      case "cFD01":
        RecordTypeName = "Configuration Record - Cellular";
        break;
      case "cFD02":
        RecordTypeName = "Configuration Record - Cellular to Record";
        break;
      case "rDF01":
        RecordTypeName = "Power On";
        break;
      case "rDF0C":
        RecordTypeName = "Power On";
        break;
      case "rDF0A":
        RecordTypeName = "Time";
        break;
      case "rDF0B":
        RecordTypeName = "Distance";
        break;
      case "rDF0E":
        RecordTypeName = "Secondary System Event";
        break;
      case "rDF0F":
        RecordTypeName = "Angle Change";
        break;
      case "rDF10":
        RecordTypeName = "Stop or Resume After Stop";
        break;
      case "rDF02":
        RecordTypeName = "Excess Speed Entry";
        break;
      case "rDF03":
        RecordTypeName = "Excess Speed Exit";
        break;
      case "rDF04":
        RecordTypeName = "Loss of GPS Signal";
        break;
      case "rDF05":
        RecordTypeName = "Restoration of GPS Signal";
        break;
      case "rDF06":
        RecordTypeName = "Stationary Point Entry";
        break;
      case "rDF07":
        RecordTypeName = "Stationary Point Exit";
        break;
      case "rDF0D":
        RecordTypeName = "System Off";
        break;
      case "rDF20":
        RecordTypeName = "Input 1 Off";
        break;
      case "rDF21":
        RecordTypeName = "Input 1 On";
        break;
      case "rDF22":
        RecordTypeName = "Input 2 Off";
        break;
      case "rDF23":
        RecordTypeName = "Input 2 On";
        break;
      case "rDF24":
        RecordTypeName = "Input 3 Off";
        break;
      case "rDF25":
        RecordTypeName = "Input 3 On";
        break;
      case "rDF26":
        RecordTypeName = "Input 4 Off";
        break;
      case "rDF27":
        RecordTypeName = "Input 4 On";
        break;
      case "rDF2A":
        RecordTypeName = "Ignition Off";
        break;
      case "rDF2B":
        RecordTypeName = "Ignition On";
        break;
      case "rDF2C":
        RecordTypeName = "Input 5 Off";
        break;
      case "rDF2D":
        RecordTypeName = "Input 5 On";
        break;
      case "rDF2E":
        RecordTypeName = "Input 6 Off";
        break;
      case "rDF2F":
        RecordTypeName = "Input 6 On";
        break;
      case "rDF11":
        RecordTypeName = "Trip Voltage";
        break;
      case "r7F00":
        RecordTypeName = "CAN Message Data - VDT";
        break;
      case "r7F01":
        RecordTypeName = "CAN Message Data - External";
        break;
      case "rEF00":
        RecordTypeName = "Secondary Input Device";
        break;
      case "rEF02":
        RecordTypeName = "J1708 Data";
        break;
      case "rBF":
        RecordTypeName = "Force America Record";
        break;
    }
    return RecordTypeName + " (" + this.RecordType + ")";
  });

// function ToInt32(x) {
//   return ("0x" + x) | 0;
// };
//
// tripData2Time = function(tripDataString) {
//   var timeString = tripDataString.substr(tripDataString.length - 8);
//   var seconds = parseInt(timeString, 16);
//   var oldDateObject = new Date("2000-03-01T00:00:00Z");
//   var newDateObject = new Date(oldDateObject.getTime() + seconds/60*60000);
//   return newDateObject
// };
//
// tripData2LatLon = function(tripDataString) {
//   // console.log(tripDataString);
//   var tempLat = ToInt32(tripDataString.substring(0, 6));
//   var latitude = (tempLat / 60000.0).toFixed(5);
//   var tempLon = ToInt32(tripDataString.substring(6, 14));
//   var longitude = (tempLon / 60000.0).toFixed(5);
//   return [longitude,latitude];
// };
//
// tripData2Heading = function(tripDataString) {
//   var tempHeading = tripDataString.substring(14, 16);
//   var heading = tempHeading * 2;
//   return heading;
// };
//
// tripData2Speed = function(tripDataString) {
//   var tempSpeed = tripDataString.substring(16, 20);
//   var speedMPH = tempSpeed * 2.237;
//   return speedMPH;
// };

// {
// "AssetName": "3261 SWEEP",
// "RecordType": "rDF0C",
// "TripData": "01424C205645520105001F35F713",
// "Misc": "",
// "ReportDateTime": "2016-10-03T12:52:35",
// "UniqueID": "DFON_3118020207"
// }

// TripDataSchema.pre('save', function(next) {
//   self = this;
//   var tripData = self.TripData;
//   var eventCodes = ["rDF0A","rDF0B","rDF0E","rDF0F","rDF10",
//                     "rDF01","rDF02","rDF03","rDF04","rDF05",
//                     "rDF06","rDF07","rDF0D","rDF20","rDF21",
//                     "rDF22","rDF23","rDF24","rDF25","rDF26",
//                     "rDF27","rDF2A","rDF2B","rDF2C","rDF2D",
//                     "rDF2E","rDF2F"];
//   if (eventCodes.indexOf(self.RecordType) > -1) {
//     var tripDataLonLat = tripData2LatLon(tripData);
//     self.LonLat = tripDataLonLat;
//     self.Latitude = tripDataLonLat[1];
//     self.Longitude = tripDataLonLat[0];
//     self.Heading = tripData2Heading(tripData);
//     self.Speed = tripData2Speed(tripData);
//     var inputStatus = [false,false,false,false,false,false]
//     switch(self.RecordType) {
//       case "rDF21":
//         inputStatus[0] = true;
//         break;
//       case "rDF23":
//         inputStatus[1] = true;
//         break;
//       case "rDF25":
//         inputStatus[2] = true;
//         break;
//       case "rDF27":
//         inputStatus[3] = true;
//         break;
//       case "rDF2D":
//         inputStatus[4] = true;
//         break;
//       case "rDF2F":
//         inputStatus[5] = true;
//         break;
//       // default:
//           // Nothing
//     }
//     self.InputOnStatus = inputStatus;
//   };
//   self.RecordDateTime = tripData2Time(tripData).toUTCString();
//
//   next();
// });

module.exports = mongoose.model('TripData', TripDataSchema);

// <AssetName>3261 SWEEP</AssetName>
// <RecordType>cFD00</RecordType>
// <TripData>00FF001E0320000AFFFF00140003</TripData>
// <Misc/>
// <ReportDateTime>2016-10-03T12:52:35-06:00</ReportDateTime>
// <UniqueID>FD00_3210689978</UniqueID>

// RecordType: 'cFD00',
// TripData: '249557FF9FC4840E00001F3123F6',
// Latitude: '39.95878',
// Longitude: '-105.1114',
// Heading: '28',
// Speed: '0',
// RecordDateTime: '2016-09-29T21:02:46',
// Misc: '',
// InputOnStatus: 'False,False,False,False,False,False',
// ReportDateTime: '2016-09-29T21:02:46',
// UniqueID: 'DFGPS_4271732554'
