'use strict';

var _ = require('lodash');
var Dispute = require('./dispute.model');


// Get list of disputes
exports.index = function(req, res) {
  Dispute.find(function (err, disputes) {
    if(err) { return handleError(res, err); }
    return res.json(200, disputes);
  });
};

// Get a single dispute
exports.show = function(req, res) {
  Dispute.findById(req.params.id, function (err, dispute) {
    if(err) { return handleError(res, err); }
    if(!dispute) { return res.send(404); }
    return res.json(dispute);
  });
};

// Creates a new dispute in the DB.
exports.create = function(req, res) {
  var body = req.body
  var content = '<?xml version="1.0" encoding="UTF-8"?><this:Recieve_dispute_requestRequest xmlns:this="http://integrationdemo.com/Processes/Core/DisputeManagement/Dispute_Management"><tns:Client xmlns:tns="http://www.example.org/DataSchema">' + body.Client + '</tns:Client><tns:Account xmlns:tns="http://www.example.org/DataSchema">'+ body.Account + '</tns:Account><tns:Amount xmlns:tns="http://www.example.org/DataSchema">' + body.Amount + '</tns:Amount><tns:Description xmlns:tns="http://www.example.org/DataSchema">' + body.Description + '</tns:Description></this:Recieve_dispute_requestRequest>'
  var http = require('http');

  var postRequest = {
    host: "bpms.local",
    path: "/intalio/ode/processes/IntegrationDemo_Processes_Core_DisputeManagement_Dispute_Management_Customer",
    port: 8080,
    method: "POST",
    headers: {
        'Cookie': "cookie",
        'Content-Type': 'application/xml',
        'Content-Length': Buffer.byteLength(content)
    }
  };

  var soapreq = http.request(postRequest,function(response){
    console.log( response.statusCode );
    var buffer = "";
    response.on( "data", function( data ) { buffer = buffer + data; } );
    response.on( "end", function( data ) { 
      console.log( buffer ); 
      var parseString = require('xml2js').parseString;
      parseString(buffer,function(err,result){
        // console.log(result.Recieve_dispute_requestResponse['tns:Ref'][0]._)
        body.Ref = result.Recieve_dispute_requestResponse['tns:Ref'][0]._
        body.Status = 'Pending';
        Dispute.create(body, function(err, dispute) {
          // console.log(client.lastRequest)
          if(err) { return handleError(res, err); }
          return res.json(201, dispute);
        });

      })
    });    
  })
  soapreq.write( content );
  soapreq.end();
};

// Updates an existing dispute in the DB.
exports.update = function(req, res) {
  Dispute.find({'Ref':req.params.id}, function (err, disputes) {
    if (err) { return handleError(res, err); }
    if(disputes.length == 0) { return res.send(404); }
    var dispute = disputes[0]
    if(req.body.newAnswer) {
      req.body.Answer = req.body.newAnswer;
      req.body = _.omit(req.body,'newAnswer');

      var content = '<?xml version="1.0" encoding="UTF-8"?><dis:Recieve_responseRequest xmlns:dis="http://integrationdemo.com/Processes/Core/DisputeManagement/Dispute_Management"><dat:Ref xmlns:dat="http://www.example.org/DataSchema">' + req.body.Ref + '</dat:Ref><dat:Answer xmlns:dat="http://www.example.org/DataSchema">' + req.body.Answer + '</dat:Answer></dis:Recieve_responseRequest>'
        console.log(content)
        var http = require('http');

        var postRequest = {
          host: "bpms.local",
          path: "/intalio/ode/processes/IntegrationDemo_Processes_Core_DisputeManagement_Dispute_Management_Customer",
          port: 8080,
          method: "POST",
          headers: {
              'Cookie': "cookie",
              'Content-Type': 'application/xml',
              'Content-Length': Buffer.byteLength(content)
          }
        };
        var soapreq = http.request(postRequest,function(response){
          console.log( response.statusCode );
          var buffer = "";
          response.on( "data", function( data ) { buffer = buffer + data; } );
          response.on( "end", function( data ) { 
            console.log(data)
          })
        }); 
        soapreq.on('error', function(e){ console.log(e)})  
        soapreq.write( content );
        soapreq.end();

    }
    else {
      req.body.Answer = '';
    }
    var updated = _.merge(dispute, req.body);
    console.log(updated)
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, dispute);
    });
  }); 
};

// Deletes a dispute from the DB.
exports.destroy = function(req, res) {
  Dispute.findById(req.params.id, function (err, dispute) {
    if(err) { return handleError(res, err); }
    if(!dispute) { return res.send(404); }
    dispute.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}