const mongoose=require('mongoose');
const produitSchema=new mongoose.Schema({
    noms:{
        type:String,
        required:true},
    description:{
        type:String,
        required:false}, 
    prix:{
        type:Number,
        required:true
    },
    categories:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categories',
        required:true
    },

    image:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('Produit',produitSchema);
        