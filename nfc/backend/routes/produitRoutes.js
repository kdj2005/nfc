const express=require("express")
const ProduitRouter =express.Router();
const {upload} = require('../utils/upload');
const {createProduit, getProduits,getProduitById} = require('../controllers/produits');

ProduitRouter.post('/create-produits', upload.single('image'), createProduit);
ProduitRouter.get('/getAll-produits', getProduits);
ProduitRouter.get('/get-produit/:id', getProduitById);
module.exports = ProduitRouter;