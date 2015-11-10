/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /participantes              ->  index
 * POST    /participantes              ->  create
 * GET     /participantes/:id          ->  show
 * PUT     /participantes/:id          ->  update
 * DELETE  /participantes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var datastore = require('nedb');
var db = {
  participantes: new datastore({
    filename: 'server/db/participantes.db',
    autoload: true,
    timestampData: true
  })
};
db.participantes.persistence.setAutocompactionInterval(5000);

// Get list of participantes
exports.index = function (req, res) {
  db.participantes.find({name  : {$exists:true} }, function (err, docs) {
    if (err) {
      res.json([{'error': 'An error has occurred'}]);
    }
    else {
      res.json(docs);
    }
  });
};

// Get list of participantes
exports.active = function (req, res) {
  db.participantes.find({mostrar:true}, function (err, docs) {
    if (err) {
      res.json([{'error': 'An error has occurred'}]);
    }
    else {
      res.json(docs);
    }
  });
};

exports.create = function (req, res) {
  db.participantes.insert(req.body, function (err, newDoc) {   // Callback is optional
    console.log(req.body);
    if (err) {
      res.json([{'error': 'An error has occurred', 'errorObj': err}]);
    }
    else {
      res.json(newDoc);
    }
  });
}

exports.update = function (req, res) {
  db.participantes.update({_id: req.params.id}, {$set: {mostrar: req.body.mostrar}}, function (err, numReplaced) {   // Callback is optional
    if (err) {
      res.json([{'error': 'An error has occurred'}]);
    }
    else {
      res.json([{'ok': numReplaced}]);
    }
  });
}

exports.destroy = function (req, res) {
  db.participantes.remove({_id: req.params.id}, {}, function (err, numRemoved) {
    if (err) {
      res.json([{'error': 'An error has occurred'}]);
    }
    else {
      res.json([{'result': 'Ok'}]);
    }
  });
}

exports.show = function (req, res) {
  db.participantes.loadDatabase(function (err) {    // Callback is optional
    if (err) {
      res.json([{'error': 'An error has occurred'}]);
    }
    else {
      res.json([{}]);
    }
  });
};