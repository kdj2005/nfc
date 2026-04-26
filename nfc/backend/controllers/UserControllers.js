const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const{generateToken,generateRefreshToken,refreshAccessToken}=require("../middlewares/authentification")

async function createUser(req,res){
     if(!req.body){
        
            return res.status(400).json({message:"il manque  des informations",error:true,success:false})
    }

    try{
        const {cartId,name,surname,email,code_pin,phone_number,birthday}=req.body
       
    const newUser=new User({
        cartId ,
        name,
        surname,
        email,
        code_pin,
        phone_number,
        birthday
    })
    await newUser.save()
    return res.status(200).json({message:"utilisateur créé avec succès",error:false,success:true})}

    catch(e){
        return res.status(400).json({message:"erreur de création d'utilisateur",error:true,success:false,data:e.message})
    }

}


async function loginUser(req,res){
  
    try{
        const{cartId,code_pin}=req.body
        if(!cartId || !code_pin){
            return res.status(400).json({message:"cartId et code_pin sont requis",error:true,success:false})
        }
        const user=await User.findOne({cartId})
        if(!user){
            return res.status(400).json({message:"utilisateur non trouvé",error:true,success:false})
        }
        const ispin=await bcrypt.compare(code_pin,user.code_pin)
        if(!ispin){
            return res.status(400).json({message:"code_pin incorrect",error:true,success:false})
        }
        const accessToken=generateToken(user)
        const refreshToken=generateRefreshToken(user)
       
        
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 5 * 60 * 1000
        })
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        

        return res.status(200).json({message:"connexion réussie",error:false,success:true})
    }catch(e){  console.log(e)
        return res.status(400).json({message:"erreur de connexion",error:true,success:false ,data:e.message}
          
        )
    }
}

async function logoutUser(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({
                message: "Déjà déconnecté",
                success: true,
                error: false
            });
        }

        // Supprimer le refreshToken en base
        await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null }
        );

        // Supprimer les cookies
        res.clearCookie("accessToken", {
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 5 * 60 * 1000

        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false, // Mettre à true en production avec HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Déconnexion réussie",
            success: true,
            error: false
        });

    } catch (e) {
        return res.status(500).json({
            message: "Erreur serveur",
            success: false,
            error: true
        });
    }
}
async function UserInfo(req,res){
    try{
        const id=req.user._id
        if(!id){
            return res.status(400).json({message:"id de l'utilisateur est requis",error:true,success:false})
        }
        const user=await User.findById(id)
        if(!user){
            return res.status(400).json({message:"utilisateur non trouvé",error:true,success:false})
        }
        return res.status(200).json({message:"informations de l'utilisateur récupérées avec succès",error:false,success:true,data:{name:user.name,surname:user.surname,solde:user.solde}})
    }catch(e){
        return res.status(400).json({message:"erreur lors de la récupération des informations de l'utilisateur",error:true,success:false})
    }
}
async function Depot(req,res){
    try{
        const{amount}=req.body
        if(!amount){
            return res.status(400).json({message:"montant est requis",error:true,success:false})
        }
        const id=req.user._id
        const user=await User.findById(id)
        if(!user){
            return res.status(400).json({message:"utilisateur non trouvé",error:true,success:false})
        }
        user.solde+=amount
        await user.save()
        return res.status(200).json({message:"dépôt effectué avec succès",solde:user.solde,error:false,success:true})
    }catch(e){
        return res.status(400).json({message:"erreur lors du dépôt",error:true,success:false})
    }
}

async function refreshToken(req,res){
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({message:"token de rafraîchissement manquant",error:true,success:false})
    }
    try{
        const decoded=jwt.verify(refreshToken,process.env.JWT_SECRET)
        const user=await User.findById(decoded._id)
        if(!user || user.refreshToken!==refreshToken){
            return res.status(401).json({message:"token de rafraîchissement invalide",error:true,success:false})
        }
        const tokens=await refreshAccessToken(user)
        const options_refrestoken={httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 * 1000

        }
        const options_accesstoken={httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 5 * 60 * 1000
        }
        res.cookie("accessToken",tokens.accessToken,options_accesstoken)
        res.cookie("refreshToken",tokens.refreshToken,options_refrestoken)
        return res.status(200).json({message:"token rafraîchi avec succès",error:false,success:true})
    }catch(e){
        return res.status(401).json({message:"token de rafraîchissement invalide",error:true,success:false})
    }
}

module.exports={createUser,loginUser,logoutUser,UserInfo,Depot,refreshToken}      
