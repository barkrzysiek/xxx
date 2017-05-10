// GuestAccessUpdateStrategy.js

GuestAccessUpdateStrategy = {};

GuestAccessUpdateStrategy.execute = function(village, data){
    village['updated'] = true;
    var jsonStartMarker = '"points":"';
    if (data.indexOf(jsonStartMarker) == -1){
        throw new Error("Dane z serwera Plemion mają nieprawidłowy format (brak danych o punktach)");
    }
    data = data.substring(data.indexOf(jsonStartMarker) + jsonStartMarker.length);
    var points = parseInt(data);
    if (isNaN(points)){
        throw new Error("Dane z serwera Plemion mają nieprawidłowy format (dane o punktach nieprawidłowe)");
    }
    var p1 = village['history'][village['history'].length - 1];
    var p2 = village['history'][village['history'].length - 2];
    if (points != p1 || p1 != p2) village['history'].push(points);
    return village;
}