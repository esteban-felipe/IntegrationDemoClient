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
  var soap = require('soap');
  var url= 'http://bpms.local:8080/intalio/ode/processes/IntegrationDemo_Processes_Core_DisputeManagement_Dispute_Management_Customer?wsdl'
  var body = req.body
  soap.createClient(url,function(err,client){
    client.Recieve_dispute_request(req.body,function(err,results){
      if (err) throw err;
      req.body.Ref = results.Ref
      Dispute.create(req.body, function(err, dispute) {
        if(err) { return handleError(res, err); }
        return res.json(201, dispute);
      });
    })
  });
};

// Updates an existing dispute in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Dispute.findById(req.params.id, function (err, dispute) {
    if (err) { return handleError(res, err); }
    if(!dispute) { return res.send(404); }
    var updated = _.merge(dispute, req.body);
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