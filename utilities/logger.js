const fs = require("fs")

function log(data, verbose=true, initialisation=false){

    var d = new Date
    dformat = [d.getMonth()+1,
               d.getDate(),
               d.getFullYear()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':')


    var text = undefined

    if (initialisation === true){

        text = `
         ---------------------------
          ______ ______ ______ 
         |  ____|  ____|  ____|
         | |__  | |__  | |__   
         |  __| |  __| |  __|  
         | |    | |    | |____ 
         |_|    |_|    |______|
         ---------------------------
         ~ Début du traitement
            - Catégorie   : ${data.category}
            - Samedi      : ${data.links.saturday}
            - Dimanche    : ${data.links.sunday}
            - Inscription : ${data.links.register}
            - Coefficient : ${data.force_coefficient}
    
        `

    }else{

        text = `${dformat}\t~\t${data}\n`

    }

    if (verbose === true){

        console.log(text)

    }

    fs.appendFileSync("./data/log.txt", text)

}

exports.log = log