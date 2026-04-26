const express = require("express")
const path = require("path")
const FrontendRouter = express.Router();
const publicFolder = path.join(__dirname, "..", "public");

FrontendRouter.get("/inscription", (req, res) => {
    res.sendFile(path.join(publicFolder, "inscription.html"))
})

FrontendRouter.get("/connexion", (req, res) => {
    res.sendFile(path.join(publicFolder, "connexion.html"))
})

FrontendRouter.get("/kiosque", (req, res) => {
    res.sendFile(path.join(publicFolder, "kiosque.html"))
})

FrontendRouter.get("/dashboard", (req, res) => {
    res.sendFile(path.join(publicFolder, "Dashbord.html"))
})

FrontendRouter.get("/espace-client", (req, res) => {
    res.sendFile(path.join(publicFolder, "espace_client.html"))
})

FrontendRouter.get("/", (req, res) => {
    res.sendFile(path.join(publicFolder, "kiosque.html"))
})

module.exports = FrontendRouter
