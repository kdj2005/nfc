const jwt=require("jsonwebtoken")
const User=require("../models/User")

async function auth(req,res,next){
    let token=req.cookies?.accessToken

    if(!token){
        const authHeader=req.headers.authorization
        if(authHeader && authHeader.startsWith("Bearer ")){
            token= authHeader.replace("Bearer ","")
        }else{
            return res.status(401).json({message:"Impossible d'accéder a la ressource, token manquant",error:true,success:false})
        }
    }
    
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }catch(err){
        return res.status(401).json({message:"Token d'authentification invalide",error:true,success:false})
    }
}


function generateToken(user){
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"5m"})
    return token
}
function generateRefreshToken(user){
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    user.refreshToken=token
    user.save()
    return token
}

 async function refreshAccessToken(user){
    const newaccessToken=generateToken(user)
    const newRefreshToken=generateRefreshToken(user)
        user.refreshToken=newRefreshToken
        await user.save()

    return {accessToken:newaccessToken,refreshToken:newRefreshToken}

    
}
    

    
module.exports={auth,generateToken,generateRefreshToken,refreshAccessToken}


