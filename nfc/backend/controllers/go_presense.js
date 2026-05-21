const User=require('../models/User');

async function getGoPresense(req,res){
    try{
        const {cartId}=req.body
        if(!cartId){
            return res.status(400).json({message:"cartId requis"})
        }
        const user=await User.findOne({cartId})
        if(!user){
            return res.status(404).json({message:"Utilisateur non trouvé"})
        }
        return res.status(200).json({message:"Utilisateur trouvé",username:user.name,prenom:user.surname,error:false,success:true})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

module.exports={getGoPresense}