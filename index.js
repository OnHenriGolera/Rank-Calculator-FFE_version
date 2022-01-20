/*


                            ,--.                       ,--.
                          _',|| )                     ( \\ |
            ,.,,.,-----""' "--v-.___                   `_\\.'--,..__
            |,"---.--''/       /,.__"")`-:|._________-"'     (--..__'/--.
                      /     ,."'    ""-'-"|'  _.,-"_.'-"\     \     ` '""
                   _ )____---------------(|--"_|--'      '__   \_
                _,' |  .''''""---.        '""'       ,---'''.   /".
            _,-'  ." \/,,..---/_ /                   | -|.._____|  \_
          ,-\,.'''            \ (                    |"")       "-,  \
      _ .".--"                ( :                    | (           '. "\_
    ,- ,."                    ; !                    ; |             \,_ `.
___(_(."       ctr -------....L_">        _________.-/_J                '\_')
                                                     """"            ----------



 ~ Programme proposé par VAN DE MERGHEL Robin 🤺

 ~ Libre de droit 😜

 ~ Codé en Node JS

 ~ Fait pour un usage à but non lucratif seulement

 ~ Bon usage 😜
                                                    
*/
// ===========================================================
// Paramètres à remplir

const competition_category = "FHM20"
const competition_data_links = {
    "saturday"  : "competition_data/samedi_henin_beaumont.csv", // Si c'est sur 1 jour, mettre "undefined" (sans guillemets)
    "sunday"    : "competition_data/dimanche_henin_beaumont.csv",
    "register"  : "competition_data/register_henin_beaumont.csv"
}
var competition_force = undefined // Si c'est pour les M15, remplir selon le niveau du circuit

// Fin paramètres à remplir
// ===========================================================



const { csv_to_json } = require("./utilities/csv-to-json")
const { force_coefficient } = require("./utilities/force-coefficient")
const { points } = require("./utilities/points")
const { log } = require("./utilities/logger")



// On récupère les données de la compétition (Jour 1, *Jour 2*, Inscriptions)
var competition_data = {
    "saturday"  : csv_to_json(competition_data_links.saturday), // S'il n'y a pas 2 jours, ce sera égal à []
    "sunday"    : csv_to_json(competition_data_links.sunday),
    "register"  : csv_to_json(competition_data_links.register)
}


// On récupère les classements nationaux et internationaux
var national_rank = csv_to_json(`ranks/national/${competition_category}`)
var international_rank = csv_to_json(`ranks/international/${competition_category}`)

// Si le coefficient de force n'est pas défini, on le calcul à partir des classements nationaux et internationaux
// Le seul cas où competition_force est déjà défini, c'est pour les M15, donc on ne calcul pas
if (competition_force === undefined){

    competition_force = force_coefficient(competition_data.register, national_rank, international_rank)

}

// On calcul le vrai classement final
var final_rank = competition_data.sunday

if (competition_data.saturday.length >= competition_data.sunday.length){

    /*
        Ici, si il y a plus de monde le samedi que le dimanche (on sait jamais, une erreur ou un hasard)
            -> On a saturday_unique_people le nombre de personne SEULEMENT le samedi (ex : 14)
            -> On récupère les saturday_unique_people dernières personnes des données du samedi (ex : les 14 dernières)
            -> On ajoute les saturday_unique_people dernières personnes dans le classement final (final_rank)
    */


    var saturday_unique_people = competition_data.sunday.length - competition_data.saturday.length
    var real_saturday_competition = competition_data.saturday.slice(-saturday_unique_people)

    final_rank.concat(real_saturday_competition)

}

final_rank = points(competition_force, final_rank)


for (var i=0;i<final_rank.length;i++){

    var player_data = final_rank[i]

    // On cherche si le tireur a déjà un classement national, si oui, on trouve son index
    var index = national_rank.findIndex(obj => obj.name==player_data.name && obj.surname==player_data.surname)

    if (index === undefined){

        // Il n'a pas encore de classement national, on ajoute ses données
        national_rank.push({

            "rank"          : 10000,
            "name"          : player_data.name,
            "surname"       : player_data.surname,
            "year"          : player_data.year,
            "competitions"   : [
                {
                    "category"  : competition_category,
                    "points"    : player_data.points
                }
            ],
            "points"        : round(player_data.points)

        })

    }else{

        // On ajoute la compétition
        national_rank[index].competitions.push({
            "category"  : competition_category,
            "points"    : player_data.points
        })

        // On calcul les points maximums
        var player_points = []

        // On récupère les compétitions
        var player_competitions = national_rank[index].competitions

        for (var i=0;i<player_competitions.length;i++){

            // On vérifie la catégorie
            if (player_competitions[i].category === competition_category){

                player_points.push(player_competitions[i].points)

            // Cas des M20 : séniors comptent
            // De plus, je fais gaffe si une personne a par exemple fait des compétitions en épée, et en fleuret
            }else if (competition_category.endsWith("20") && player_competitions[i].category.replace("20","SE") === competition_category.replace("20","SE")){

                player_points.push(player_competitions[i].points)

            }

        }

        // On tri les points dans l'ordre décroissant
        var sorted_points = player_points.sort((a,b)=>b-a)

        var sum_points = 0
        
        // Somme des 3 meilleurs scores (ou moins)
        for (var i=0;i<3 | i<sorted_points.length;i++){

            sum_points += sorted_points[i]

        }

        // On met à jour les points
        national_rank[index].points = round(sum_points, 2)

    }

}

// On refait le classement national à 0 (on tri en fonction des points)
national_rank = national_rank.sort(function(a, b) {
    return parseFloat(a.points) < parseFloat(b.points);
});

// On ajoute le classement final
for (var i=0;i<national_rank.length;i++){

    national_rank[i].rank = i+1

}


// Arrondi à n décimales
function round(x, n){
    return Math.parseInt( x * (10**n) ) / (10**n)
}