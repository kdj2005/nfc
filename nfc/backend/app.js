const express = require('express');
const port=3000
const cookies=require("cookie-parser")
const app =express()
const UserRouter=require("./routes/userRoutes")
const CategoriesRouter=require("./routes/categoryRoutes")
const ProduitRouter=require("./routes/produitRoutes")
const PayementRouter=require("./routes/payementRoute")
const frontendRouter=require("./routes/frontendRoutes")
const GoPresenseRouter=require("./routes/go-presence")
const cors=require("cors")

const connectDB=require("./connexion")

connectDB()
app.use(cookies())
app.use(cors({
    
    credentials: true
})) 


app.use(express.json())
app.use(express.static('public'))
app.use("/user",UserRouter)
app.use("/categories",CategoriesRouter)
app.use("/produits",ProduitRouter)
app.use("/paiements",PayementRouter)
app.use("/",frontendRouter)
app.use("/presence",GoPresenseRouter)
app.get("/click",(req,res)=>{
     const ligne=`${new Date().toISOString()} - Click enregistré\n`;;
    require('fs').appendFile('clicks.txt', ligne, (err) => {
        if (err) {
            console.error('Erreur lors de l\'enregistrement du click:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement du click' });
        }
    });
    res.redirect('https://amazon.com');
});
app.get("/logs",(req,res)=>{
    const content=require('fs').readFileSync('clicks.txt','utf-8');
    res.type('text/plain').send(content);
    
});




app.listen(port,()=>{
    console.log(`le serveur est en cours d'exécution sur le port ${port}`)
})
