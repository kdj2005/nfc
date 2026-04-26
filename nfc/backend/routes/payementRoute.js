const express=require('express');
const PayementRouter= new express.Router();
const { payer, getScanStatut,finaliserPaiement, getEtatPaiement}=require('../controllers/payements')


PayementRouter.post('/payer',payer);
PayementRouter.get('/statut',getScanStatut);
PayementRouter.post('/carte-scanner',finaliserPaiement);
PayementRouter.get('/etat',getEtatPaiement);
module.exports=PayementRouter;