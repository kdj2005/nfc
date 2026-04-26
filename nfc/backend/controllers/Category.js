const categories=require("../models/Categories")



async function  createCategories(req,res){
    try{
        const {name}=req.body
        if(!name){
            return res.status(400).json({message:"Nom de catégorie requis"})
        }
        const newCategories=new categories({name})
        await newCategories.save()
       return  res.status(200).json({message:"Catégories créées  avec succès",error:false,success:true})
    }catch(err){
         return res.status(500).json({message:err.message})
    }
}


async function getAllCategories(req,res){
    try{
        const allCategories=await categories.find()
        return res.status(200).json({categories:allCategories,error:false,success:true})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
module.exports={createCategories,getAllCategories}
