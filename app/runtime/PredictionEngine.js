// PredictionEngine.js

PredictionEngine = {};

PredictionEngine.firstPass = function(village){
    var wall = [256,213,177,148,123,103,86,71,59,50,41,34,29,24,20,17,14,12,10,8,0];
    var farm = [989,824,687,572,477,397,331,276,230,193,160,133,111,92,77,64,53,45,37,31,26,21,18,15,12,10,9,7,6,5,0];
    var smithy = [607,506,422,351,293,244,203,169,141,118,98,82,68,57,47,39,33,27,23,19,0];
    var wall_backward = [0,8,10,12,14,17,20,24,29,34,41,50,59,71,86,103,123,148,177,213,256];
    
    if (village['history'].length < 2) return [0, 0, 0];
    
    wall = wall.slice(20 - village['predicted_wall']);
    smithy = smithy.slice(20 - village['predicted_smithy']);
    farm = farm.slice(30 - village['predicted_farm']);
    wall_backward = wall_backward.slice(village['predicted_wall']);
    
    var wall_max = wall[0];
    var farm_max = farm[0];
    var smithy_max = smithy[0];
    var wall_min = wall_backward[0];
    
    for (i in wall) wall[i] = wall_max - wall[i];
    for (i in farm) farm[i] = farm_max - farm[i];
    for (i in smithy) smithy[i] = smithy_max - smithy[i];
    for (i in wall_backward) wall_backward[i] = Math.abs(wall_min - wall_backward[i]);
    
    var ultimate = village['history'][village['history'].length - 1];
    var penultimate = village['history'][village['history'].length - 2];
    var diff = ultimate - penultimate;
    
    possibilities = [];
    if (diff <= 0){
        // Drop in points
        // Check for possible building downgrades
        diff = Math.abs(diff);
        for (f in farm){
            for (s in smithy){
                for (w in wall){
                    if (farm[f] + smithy[s] + wall[w] == diff){
                        possibilities.push([-f, -s, -w]);
                    }
                }
            }
        }
    }else{
        // Increase in points
        // Check if the wall has been rebuilt
        for (w in wall_backward){
            if (wall_backward[w] == diff){
                possibilities.push([0, 0, w]);
            }
        }
    }
    if (possibilities.length == 1){
        return possibilities[0];
    }else{
        var total = 0;
        var best = null;
        for (i in possibilities){
            if (possibilities[i][0] == 0 && possibilities[i][1] == 0 && possibilities[i][2] < 0){
                total++;
                best = possibilities[i];
            }
        }
        if (total == 1) return best;
        else return null;
    }
}

PredictionEngine.predict = function(village){
    village['predicted_farm'] = parseInt(village['predicted_farm']);
    village['predicted_smithy'] = parseInt(village['predicted_smithy']);
    village['predicted_wall'] = parseInt(village['predicted_wall']);
    var prediction = PredictionEngine.firstPass(village);
    if (prediction != null){
        village['predicted_farm'] += parseInt(prediction[0]);
        village['predicted_smithy'] += parseInt(prediction[1]);
        village['predicted_wall'] += parseInt(prediction[2]);
    }else{
        village['prediction_accurate'] = false;
    }
    return village;
}