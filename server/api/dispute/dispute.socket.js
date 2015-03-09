/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Dispute = require('./dispute.model');

exports.register = function(socket) {
  Dispute.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Dispute.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('dispute:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('dispute:remove', doc);
}