// TWStatsUpdateStrategy.js

TWStatsUpdateStrategy = {};

TWStatsUpdateStrategy.execute = function(village, data){
    village['updated'] = true;
    var firstSet = data.match(/\<td\>[0-9]+\<\/td\>\r?\n/g);
    var secondSet = data.match(/\<td\>....-..-.. ..\:..\<\/td\>/g);
    if (!firstSet || !secondSet){
        throw new Error("Dane TWStats mają nieprawidłowy format (brak rekordów)");
    }
    if (firstSet.length != secondSet.length){
        throw new Error("Dane TWStats mają nieprawidłowy format (różne ilości rekordów)");
    }
    var today = curdate();
    for (var i=firstSet.length-1; i>=0; i--){
        if (secondSet[i].indexOf(today) == -1){
            var newPoints = parseInt(firstSet[i].replace("<td>",""));
            if (!isNaN(newPoints)){
                var lastPoints = village['history'].slice(-1)[0];
                if (newPoints != lastPoints) village['history'].push(newPoints);
                break;
            }else{
                throw new Error("Dane TWStats mają nieprawidłowy format (brak ilości punktów w rzędzie)");
            }
        }
        if (i == 0){
            throw new Error("Nie znaleziono ilości punktów w danych TWStats");
        }
    }
    return village;
}