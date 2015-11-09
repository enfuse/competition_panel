'use strict';

var express = require('express');
var controller = require('./participante.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/activos', controller.active);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);
router.put('/:id', controller.update);

module.exports = router;