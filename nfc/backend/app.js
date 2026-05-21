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




app.listen(port,()=>{
    console.log(`le serveur est en cours d'exécution sur le port ${port}`)
})