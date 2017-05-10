// SessionManager.js

SessionManager = {};

SessionManager.analysisGracePeriod = 0;
SessionManager.villages = [];
SessionManager.villageDataClone = null;

SessionManager.createNew = function(){
    SessionManager.analysisGracePeriod = parseInt($('#init-start-date').val());
    var data = $('#init-village-list').val().split("\n");
    for (i in data){
        var coords = data[i].match(/\d\d\d\|\d\d\d/g);
        if (!coords) continue;
        coords = coords.slice(-1)[0];
        SessionManager.villages.push(parseInt(coords.substring(4, 7) + coords.substring(0, 3)));
    }
    SessionManager.villageDataClone = null;
}

SessionManager.clear = function(){
    SessionManager.analysisGracePeriod = 0;
    SessionManager.villages = [];
    SessionManager.villageDataClone = null;
}

SessionManager.load = function(){
    SessionManager.villages = JSON.parse(localStorage._villages);
    SessionManager.analysisGracePeriod = parseInt(localStorage._analysisGracePeriod);
    SessionManager.villageDataClone = JSON.parse(localStorage._villageData);
    SessionManager.disabledVillagesClone = JSON.parse(localStorage._disabledVillages);
}

SessionManager.save = function(){
    localStorage._analysisGracePeriod = SessionManager.analysisGracePeriod;
    localStorage._villages = JSON.stringify(SessionManager.villages);
    localStorage._villageData = JSON.stringify(VillageInfoModel.villageData);
    localStorage._disabledVillages = JSON.stringify(VillageInfoUpdater.disabledVillages);
}

SessionManager.apply = function(){
    if (SessionManager.villageDataClone){
        VillageInfoModel.villageData = SessionManager.villageDataClone;
        // Actually disable the villages on the list
        for (i in SessionManager.disabledVillagesClone){
            VillageInfoUpdater.disableVillage(SessionManager.disabledVillagesClone[i]);
        }
    }else{
        for (i in SessionManager.villages){
            if (!VillageInfoModel.addVillage(SessionManager.villages[i])){
                throw new Error("Wioska o podanych koordynatach nie istnieje: " +
                                coordsFromBlock(SessionManager.villages[i]));
            }
        }
    }
}