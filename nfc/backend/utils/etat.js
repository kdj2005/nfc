

let payement={
    Montant:0,
    etat:"initial"
}

function getEtat(){
    return payement.etat;
}

function setEtat(nouveauEtat){
    payement.etat=nouveauEtat;
}

module.exports={
    getEtat,
    setEtat,
    payement
}