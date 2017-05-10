// db.js

DB_VILLAGE_ID = 0;
DB_VILLAGE_NAME = 1;
DB_VILLAGE_X = 2;
DB_VILLAGE_Y = 3;
DB_VILLAGE_PLAYER = 4;

VillageDatabase = {};

VillageDatabase.asyncLoadCallback = null;
VillageDatabase.appendOffset = 0;
VillageDatabase.loaderThread = null;
VillageDatabase.data = {};

VillageDatabase.asyncLoad = function(callback, error){
    VillageDatabase.asyncLoadCallback = callback;
    AJAX.get(Config.VILLAGE_DATABASE_URL, function(data){
        data = data.split("\n");
        VillageDatabase.loaderThread = setInterval(function(){
            $('#loader-text').text("Ładowanie danych o wioskach: " + VillageDatabase.appendOffset + "/" + data.length);
            VillageDatabase.append(data, VillageDatabase.appendOffset);
            VillageDatabase.appendOffset += Config.VILLAGES_PER_CYCLE;
        }, 20);
    }, error);
}

VillageDatabase.append = function(data, offset){
    for (var i=0; i<Config.VILLAGES_PER_CYCLE; i++){
        if (i + offset >= data.length){
            $('#loader-text').text("Poczekaj chwilkę...");
            clearInterval(VillageDatabase.loaderThread);
            VillageDatabase.asyncLoadCallback();
            break;
        }
        var row = data[i + offset].split(',');
        var blockId = parseInt(row[DB_VILLAGE_X]) + parseInt(row[DB_VILLAGE_Y]) * 1000;
        VillageDatabase.data[blockId] = row;
    }
}

VillageDatabase.get = function(x){
    return VillageDatabase.data[x];
}