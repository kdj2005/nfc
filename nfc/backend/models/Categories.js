const mongoose = require('mongoose');
const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    produits:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Produit'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Categories', categoriesSchema);