console.log("Start fov_polling");

// require("babel-core").transform("code");

// Grab config info from .env
require ('dotenv').config();

var moment = require('moment');

// Database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.COL_MONGODB_URI);

var TripData = require('./models/tripdata');
var WtpScadaData = require('./models/wtpscadadata');

var sqlSCADA = require('mssql');
var config_scada = {
    user: process.env.NWTP_SCADA_SERV_USER,
    password: process.env.NWTP_SCADA_SERV_PASSWORD,
    server: process.env.NWTP_SCADA_SERV_IP, // You can use 'localhost\\instance' to connect to named instance
    port: process.env.NWTP_SCADA_SERV__PORT,
    database: process.env.NWTP_SCADA_SERV_DATABASE
};

try {
  console.log("Creating sqlPoolSCADA");
  var sqlPoolSCADA = new sqlSCADA.ConnectionPool(config_scada).connect();
}
catch(e) {;
  console.log("scada.js");
  console.log(e);
}

var getTop100 = function(table, res, select) {
    if (!select) select = '*';
    sqlPoolSCADA.then(function(pool) {
      return pool.request().query('SELECT TOP 100 ' + select + ' FROM ' + table + ';')
    }).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      res.json({err: err});
    })
  };
  
  var getQuery = function(query) {
    sqlPoolSCADA.then(function(pool) {
      return pool.request().query(query)
    }).then(function(result) {
      // result.recordset = result.recordset.map((record) => {
      //   record.TagName = record.TagName.split('/').pop();
      //   // console.log(record.TagName);
      //   return record
      // });
      // console.log(result.recordset);
      return result.recordset
    }).catch(function(err) {
      console.log(err)
      return {err: err}
    })
  };

  // WTP Database Tables
  // eldo
  // npminutes
  // spminutes
  // particles
  // ReportTags
  // totals
  // UTCConversion

  syncWtpScadaData();
  setInterval(syncWtpScadaData,1000 * 60 * 5);

  // findWtpLastSynced();
  // removeAllWtpData();

  function findWtpLastSynced() {
    const tables = ["eldo", "npminutes", "spminutes", "particles", "totals"];
    tables.forEach(function(table){
      let regexTagName = new RegExp("/" + table + "/","i");
      console.log(regexTagName);
      // .findOne({TagName: { $regex: /\/npminutes\// }}).sort({ Timestamp: -1 })
      WtpScadaData.findOne({TagName: { $regex: regexTagName }}).sort({ Timestamp: -1 }).exec(function(err,data){
        console.log(data)
      });
    })
  };

  function syncWtpScadaData() {
    // ua:HyperHistorian\\Configuration/nphst/npminutes/3mg_tank_level_ft
    console.log("Polling at: " + moment().local().toString());
    const tables = ["eldo", "npminutes", "spminutes", "particles", "totals"];
    tables.forEach(function(table){
      let regexTagName = new RegExp("/" + table + "/","i");
      WtpScadaData.findOne({TagName: { $regex: regexTagName }}).sort({ Timestamp: -1 }).exec(function(err,data){
        let utc_last_timestamp = null;
        let local_last_timestamp = null;
        let query_date = "";
        if (data != null) utc_last_timestamp = moment(data.Timestamp).utc().format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
        if (data != null) local_last_timestamp = moment(data.Timestamp).local().toString();
        // if (last_timestamp != null) query_date  =" WHERE Timestamp > Convert(datetime, '" + last_timestamp + "' )";
        if (utc_last_timestamp != null) query_date  =" WHERE Timestamp > '" + utc_last_timestamp + "'";
        let query = "SELECT * FROM dbo." + table + query_date;
        sqlPoolSCADA.then(function(pool) {
          return pool.request().query(query)
        }).then(function(result) {
          if (result.recordset.length == 0) {
            console.log("0 records inserted to " + table + ". --> " + query + " --> " + local_last_timestamp);
          } else {
            WtpScadaData.collection.insert(result.recordset,function(err,newScadaData){
              if (err) console.log(err);
              // console.log(result.recordset[0]);
              if (newScadaData)console.log(newScadaData.insertedCount + " records inserted to " + table + ". --> " + query + " --> " + local_last_timestamp);
            });
          };
        }).catch(function(err) {
          console.log(err)
          return {err: err}
        });

      });

    });

  };

  function removeAllWtpData() {
    WtpScadaData.remove({}).exec();
  };

  // function syncFleet(data) {

  //   console.log('syncFleet received the following data:');
  //   console.log(data);
  
  //   Fleet.findOne({AssetID: data.fleet_id}, function (err, foundAsset){
  //     if (err) res.send(err);
  
  //     console.log(foundAsset);
  
  //     // TripData.find({AssetID: foundAsset.AssetID}).exec(function(err, foundTripData){
  //       // if (err) res.send(err);
  //       //
  //       // var localTripData = [];
  //       // console.log("foundTripData Length: " + foundTripData.length);
  
  //     // Get Precise login information.
  //     var username = process.env.PRECISE_USERNAME;
  //     var password = process.env.PRECISE_PASSWORD;
  
  //     // Get the year and month passed from the router.
  //     var year = parseInt(data.year);
  //     var month = parseInt(data.month);
  
  //     // Create date objects from the browser.
  //     var fromDate = new Date(year,month,1);
  //     var toDate = new Date(year,month,1);
  //     console.log("Sync From Date: " + fromDate);
  //     console.log("Sync To Date: " + toDate);
  
  //     // Retrieve by Day
  //     // for (var d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
  //       // Dates to Get by Day
  //       // var startUTC = moment(new Date(d)).format("YYYY-MM-DD") + "T00:00:00.00Z";
  //       // var endUTC = moment(new Date(d)).format("YYYY-MM-DD") + "T23:59:59.00Z";
  
  //     // Retrieve by Month
  //     for (var d = fromDate; d <= toDate; d.setMonth(d.getMonth() + 1)) {
  
  //       // Dates to Get by Month
  //       var firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  //       var startUTC = moment(firstDayOfMonth).format("YYYY-MM-DD") + "T00:00:00.00Z";
  //       var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  //       var endUTC = moment(lastDayOfMonth).format("YYYY-MM-DD") + "T23:59:59.00Z";
  
  //       console.log ("Precise SOAP XML Query date range:");
  //       console.log(startUTC + " - " + endUTC);
  
  //       var execTime = [];
  //       var t0 = Date.now();
  //       preciseSOAPXML.GetAssetData(foundAsset.DeviceICCID,startUTC,endUTC,username,password,function(preciseTripData){
  //         // console.log("Test");
  //         // console.log(preciseTripData);
  //         // if (preciseTripData === null) {
  //         //   console.log("preciseTripData === null");
  //         //   return true;
  //         // }
  //         var t1 = Date.now();
  //         execTime.push("GetAssetData Query: " + (t1 - t0) + " milliseconds.");
  //         // Example Trip Object
  //         // {
  //         // "AssetName": "3261 SWEEP",
  //         // "RecordType": "rDF0C",
  //         // "TripData": "01424C205645520105001F35F713",
  //         // "Misc": "",
  //         // "ReportDateTime": "2016-10-03T12:52:35",
  //         // "UniqueID": "DFON_3118020207"
  //         // }
  //         var preciseUIDS = _.map(preciseTripData,"UniqueID");
  //         console.log("preciseUIDS Count: " + preciseUIDS.length);
  
  //         TripData.find({UniqueID: { $in: preciseUIDS }}).exec(function(err, foundTripData){
  //           console.log("found UniqueID Trip Data Count: " + foundTripData.length);
  //           var t2 = Date.now();
  //           execTime.push("TripData Find $in preciseUIDS: " + (t2 - t1) + " milliseconds.");
  //           if (err) res.send(err);
  //           var colUIDS = _.map(foundTripData,"UniqueID");
  //           console.log("colUIDS Count: " + colUIDS.length);
  //           var uidsToInsert = _.difference(preciseUIDS,colUIDS);
  //           console.log("uidsToInsert Count: " + uidsToInsert.length);
  //           var filteredPreciseTripData = [];
  //           _.each(preciseTripData,function(trip){
  //             if (uidsToInsert.indexOf(trip.UniqueID) > -1) {
  //               filteredPreciseTripData.push(preciseTripToColTrip(trip,foundAsset));
  //             };
  //           });
  //           console.log("Bulk Filtered Trip Data Count: " + filteredPreciseTripData.length);
  //           if (filteredPreciseTripData.length === 0) {
  //             console.log("Bulk Filtered Trip Data is Empty - No Batch Insert Attemped.")
  //             return;
  //           }
  //           var t3 = Date.now();
  //           execTime.push("Converted precise to col TripData: " + (t3 - t2) + " milliseconds.");
  //           TripData.collection.insert(filteredPreciseTripData,function(err,newTripData){
  //             if (err) console.log(err);
  //             console.log("Batch TripData Insert Completed")
  //             if (newTripData) console.log("TripData Count: " + newTripData.insertedCount);
  //             var t4 = Date.now();
  //             execTime.push("Total time to Process: " + (t4 - t0) + " milliseconds.");
  //             console.log(execTime);
  //             // uidsToInsert
  //             // exchange.publish({fleet_id: data.fleet_id, uids2Process: uidsToInsert}, { key: 'segmentdata' });
  //           });
  //         });
  //       });
  //     };
  //     // });
  //   });
  // };

