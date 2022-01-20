function force_coefficient(register, national_rank, international_rank){

    /*
        Principe :
            Pour chaque tireur, on regarde le nombre maximal de point qu'il peut ajouter au coefficient de force.
            Puis on trie la liste des coefficients, pour avoir les 32 plus grands (Cf règlement)

        1000 points pour le top 32 international ou top 8 france
        500  points pour le top 64 international ou top 16 france
        100  points pour les autres

    */

    var force_coefficient = []

    for (var i=0;i<register.length;i++){

        var player_national_rank = national_rank.find(el => el.name === register[i].name & el.surname === register[i].surname)

        var player_international_rank = international_rank.find(el => el.name === register[i].name & el.surname === register[i].surname)


        // Top 32 FIE/CEE ou Top 8 FRA
        if ( (player_international_rank != undefined && parseInt( player_international_rank ) <= 32) || (player_national_rank != undefined && parseInt( player_national_rank ) <= 8) ){

            force_coefficient.push(1000)

        // Top 64 FIE/CEE ou Top 16 FRA
        }else if ( (player_international_rank != undefined && parseInt( player_international_rank ) <= 64) || (player_national_rank != undefined && parseInt( player_national_rank ) <= 16) ){

            force_coefficient.push(500)

        // Autre
        }else{

            force_coefficient.push(100)

        }

    }

    // On trie les différents coefficients dans l'ordre décroissant
    var sorted_coefficient = force_coefficient.sort((a,b)=>b-a)

    var total_force_coefficient = 0

    // On ajouter les 32 premiers coefficients (les 32 plus grands donc)
    for (var i=0;i < 32 | i!=register.length ;i++){

        total_force_coefficient += sorted_coefficient[i]

    }

    return total_force_coefficient

}

exports.force_coefficient = force_coefficient