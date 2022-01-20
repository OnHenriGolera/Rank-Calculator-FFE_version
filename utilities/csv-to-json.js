const fs = require("fs")

function csv_to_json(filePath){


    /*
        Fichiers de classements nationaux :
        Classement, Nom, Prénom, Année de naissance, [Points de Competition_1, Catégorie de Compétition_1, ..., Points de Competition_n, Catégorie de Compétition_n]

        Fichiers de compétitions :
        Classement, Nom, Prénom, *Année de naissance*

        Register files : 
        Classement, Nom, Prénom, *Année de naissance*
    */


    if (filePath === undefined){ return [] }

    const file_content = fs.readFileSync(`./data/${filePath}`)

    const splitted_content = file_content.split("\n")

    const keys = splitted_content[0]
    
    var file_JSON = []

    for (var i=1;i<splitted_content.length;i++){

        

        var data = splitted_content[i].split(",")

        var player_JSON = {}

        for (var a=0;a<keys.length;a++){

            player_JSON[key[a]] = data[a]

        }

        file_JSON.push(player_JSON)

    }

    console.log(`${filePath} successfully imported`)

    return file_JSON

}

exports.csv_to_json = csv_to_json