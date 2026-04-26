const produits = require("../models/Produits")
const { Category } = require("../models/Categories")

async function createProduit(req, res) {
    try {
        const { nom, prix, category } = req.body
        console.log('createProduit body:', req.body)
        console.log('createProduit file:', req.file)

        if (!nom || !prix || !category) {
            return res.status(400).json({ message: "il manque des informations", error: true, success: false })
        }
        if (!req.file) {
            return res.status(400).json({ message: "image requise", error: true, success: false })
        }

        const imageUrl = req.file.path || req.file.secure_url || req.file.url
        if (!imageUrl) {
            return res.status(400).json({ message: "Impossible de récupérer l'URL de l'image", error: true, success: false })
        }

        const newProduit = new produits({
            noms: nom,
            prix: prix,
            categories: category,
            image: imageUrl
        })
        await newProduit.save()
        return res.status(200).json({ message: "produit créé avec succès", error: false, success: true })
    } catch (e) {
        console.error(e)
        return res.status(400).json({ message: "erreur de création de produit", error: true, success: false })
    }
}

async function getProduits(req,res){
    try{
        const allProduits=await produits.find().populate("categories")
        return res.status(200).json({produits: allProduits,error:false,success:true})
    }catch(e){
        return res.status(400).json({message:"erreur de récupération des produits",error:true,success:false})
    }
}

async function getProduitById(req,res){
    try{
        const {id}=req.params
        if(!id){
            return res.status(400).json({message:"il manque l'id du produit",error:true,success:false})
        }
        const produit=await produits.findById(id).populate("categories")
        return res.status(200).json({data:produit,error:false,success:true})
    }catch(e){
        return res.status(400).json({message:"erreur de récupération du produit",error:true,success:false})
    }
}


module.exports={createProduit,getProduits,getProduitById}