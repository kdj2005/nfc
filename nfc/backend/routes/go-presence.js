const express = require('express');
const { getGoPresense } = require('../controllers/go_presense');
const GoPresenseRouter = express.Router();

GoPresenseRouter.post('/go-presence', getGoPresense);
module.exports = GoPresenseRouter;