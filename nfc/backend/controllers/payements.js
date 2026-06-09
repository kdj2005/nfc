
const{setEtat,getEtat,payement }=require('../utils/etat')

const User=require('../models/User');


function payer(req,res){
    const {montant}=req.body;
    setEtat("en attente de carte");
    payement.Montant=montant;
    res.status(200).json({message:"Approchez votre carte  pres du lecteur"});
} 

function getScanStatut(req,res){
    const etat=getEtat();
    if(etat==="en attente de carte"){
        res.status(200).json({message:"En attente de carte", error:false, succes:true, etat:etat});
    }
    else{
        res.status(400).json({message:"Aucun paiement en cours", error:true, succes:false});
    }
};

async function finaliserPaiement(req,res){
    if(getEtat()!=="en attente de carte"){
        return res.status(400).json({message:"Aucun paiement en cours", error:true, succes:false});
    }
    setEtat("paiement en cours");

    const {cartId}=req.body;

    if(!cartId){
        setEtat("echec");
        return res.status(400).json({message:"ID de carte manquant", error:true, succes:false,id:cartId});
    }
    let user=await User.findOne({cartId:cartId});
    if(!user){
        setEtat("echec");
        return res.status(404).json({message:"Utilisateur non trouvé", error:true, succes:false});

    }
    if(user.solde>=payement.Montant){
        user.solde-=payement.Montant;
        await user.save();
        setEtat("succes");
        return res.status(200).json({message:"Paiement effectué avec succès", error:false, succes:true});
    }
    setEtat("echec");
    res.status(400).json({message:"Solde insuffisant", error:true, succes:false});

}

function getEtatPaiement(req,res){
    const etat=getEtat();

    res.status(200).json({etat:etat});
}
module.exports={
    payer,
    getScanStatut,
    finaliserPaiement,
    getEtatPaiement
}
