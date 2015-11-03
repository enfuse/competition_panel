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
  participantes: new datastore({ filename: 'server/db/participantes.db', autoload: true })
};

// Get list of participantes
exports.index = function(req, res) {
  db.participantes.find({}, function (err, docs) {
    if (err) {
      res.json([{'error':'An error has occurred'}]);
    } else {
      res.json(docs);
    }
  });
};

exports.create = function(req, res){
  var doc = { hello: 'world',
    n: 5,
    today: new Date(),
    nedbIsAwesome: true,
    notthere: null,
    notToBeSaved: undefined,
    fruits: [ 'apple', 'orange', 'pear' ],
    infos: { name: 'nedb' }
  };
  db.participantes.insert(doc, function (err, newDoc) {   // Callback is optional
    if (err) {
      res.json([{'error':'An error has occurred'}]);
    } else {
      res.json(newDoc);
    }
  });
}

exports.show = function(req, res) {
 /*var datos = [];
  var listaUsuarios = req.params.id
  var users_id = listaUsuarios.split(',');
  var i = 0, len = users_id.length;*/

  /*var Datastore = require('nedb')
    , db = new Datastore({ filename: 'path/to/datafile' });*/
  db.loadDatabase(function (err) {    // Callback is optional
    // Now commands will be executed
    //doSomethingOnceAllAreDone();
    console.log("carga");
  });
  res.json([{ hello: 'world',
    n: 5,
    today: new Date(),
    nedbIsAwesome: true,
    notthere: null,
    notToBeSaved: undefined,
    fruits: [ 'apple', 'orange', 'pear' ],
    infos: { name: 'nedb' }
  }]);
};