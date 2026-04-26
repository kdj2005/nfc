const express=require("express")
const CategoriesRouter =express.Router();
const {createCategories, getAllCategories} = require('../controllers//Category');

CategoriesRouter.post('/create-categories', createCategories);
CategoriesRouter.get('/getAll-categories', getAllCategories);
module.exports = CategoriesRouter;