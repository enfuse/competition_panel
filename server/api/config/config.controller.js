'use strict';

var _ = require('lodash');
var datastore = require('nedb');
var db = {
  config: new datastore({
    filename: 'server/db/config.db',
    autoload: true,
    timestampData: true
  })
};
db.config.persistence.setAutocompactionInterval(5000);


// Get list of configs
exports.index = function(req, res) {
  db.config.findOne({}, function (err, docs) {
    if (err) {
      res.json([{'error': 'An error has occurred'}]);
    }
    else {
      res.json(docs);
    }
  });
};

exports.create = function (req, res) {
  //@todo add create time
  //console.log(req.body);
  db.config.findOne({_id:req.body._id}, function (err, docs) {
    if (err) {
      res.json([{'error': 'An error has occurred'}]);
    }
    else {
      if(docs == null){
        db.config.insert(req.body, function (err, newDoc) {   // Callback is optional
          if (err) {
            res.json([{'error': 'An error has occurred', 'errorObj': err}]);
          }
          else {
            res.json(newDoc);
          }
        });
      }else{
        db.config.update({_id: req.body._id},
          {$set: {timer: req.body.timer, steps: req.body.steps}}, function (err, numReplaced) {   // Callback is optional
            if (err) {
              res.json([{'error': 'An error has occurred'}]);
            }
            else {
              res.json([{'ok': numReplaced}]);
            }
          });
      }

    }
  });
  /*db.config.insert(req.body, function (err, newDoc) {   // Callback is optional
    if (err) {
      console.log(err);
      res.json([{'error': 'An error has occurred', 'errorObj': err}]);
    }
    else {
      res.json(newDoc);
    }
  });*/
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