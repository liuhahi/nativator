'use strict';

const router = require('express').Router();
const path = require('../services/path');

const {
	validator,
	schemas
} = require('../middlewares/validator');
const methodNotAllowed = require('../middlewares/method-not-allowed');

router.get('/', path.getPaths);
router.post('/', validator(schemas.createPath), path.createPath);
router.delete('/', path.deletePaths);
router.all('/', methodNotAllowed);

router.get('/:id(\\d+)/navigate', path.navigate);
router.all('/:id(\\d+)/navigate', methodNotAllowed);

module.exports = router;