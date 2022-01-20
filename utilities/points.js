function formulae(F, rank, player_number){

    return F * (1.01 - Math.log(rank) / Math.log(player_number))

}

function points(coefficient, competition_data){

    for (var i=0;i<competition_data.length;i++){

        var player_data = competition_data[i]

        competition_data[i]["points"] = formulae(coefficient, player_data.rank, competition_data.length)

    }

    return competition_data

}

exports.points = points