// VillageInfoModel.js

VillageInfoModel = {};

VillageInfoModel.villageData = [];

VillageInfoModel.addVillage = function(coordBlock){
    var village = VillageDatabase.get(coordBlock);
    if (!village || !village[DB_VILLAGE_ID]){
        return null;
    }
    var obj = {
        id: village[DB_VILLAGE_ID],
        x: parseInt(village[DB_VILLAGE_X]),
        y: parseInt(village[DB_VILLAGE_Y]),
        name: decodeURIComponent(village[DB_VILLAGE_NAME]).replace(/\+/g, ' '),
        history: [],
        predicted_wall: 20,
        predicted_smithy: 20,
        predicted_farm: 30,
        prediction_accurate: true,
        last_update: -1,
        error: null
    };
    VillageInfoModel.villageData.push(obj);
    return obj['id'];
}

VillageInfoModel.villageFromId = function(id){
    for (i in VillageInfoModel.villageData){
        if (VillageInfoModel.villageData[i]['id'] == id) return i;
    }
    return -1;
}

VillageInfoModel.get = function(index){
    var obj = VillageInfoModel.villageData[index];
    obj['index'] = index;
    obj['updated'] = false;
    return obj;
}

VillageInfoModel.set = function(obj){
    VillageInfoModel.villageData[obj['index']] = obj;
    if (obj['updated']) VillageInfoUpdater.currentlyUpdatedId = null;
}

VillageInfoModel.clear = function(){
    VillageInfoModel.villageData = [];
}