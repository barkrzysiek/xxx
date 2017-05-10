// VillageInfoUpdater.js

VillageInfoUpdater = {};

VillageInfoUpdater.uiTimer = null;
VillageInfoUpdater.updateTimer = null;
VillageInfoUpdater.updateQueue = [];
VillageInfoUpdater.updateQueuePosition = 0;
VillageInfoUpdater.updateFirstCycle = true;
VillageInfoUpdater.currentlyUpdatedId = null;
VillageInfoUpdater.disabledVillages = [];

VillageInfoUpdater.buildUpdateQueue = function(){
    VillageInfoUpdater.updateQueue = [];
    for (i in VillageInfoModel.villageData){
        VillageInfoUpdater.updateQueue.push(i);
    }
    var count = VillageInfoUpdater.updateQueue.length;
    while (count){
        var i = Math.floor(Math.random() * count);
        var temp = VillageInfoUpdater.updateQueue[count-1];
        VillageInfoUpdater.updateQueue[count-1] = VillageInfoUpdater.updateQueue[i];
        VillageInfoUpdater.updateQueue[i] = temp;
        count--;
    }
}

VillageInfoUpdater.disableVillage = function(id){
    VillageInfoUpdater.disabledVillages.push(id);
    var newQueue = [];
    var removedIndex = null;
    for (i in VillageInfoUpdater.updateQueue){
        if (VillageInfoModel.villageData[VillageInfoUpdater.updateQueue[i]]['id'] == id){
            removedIndex = i;
        }else{
            newQueue.push(VillageInfoUpdater.updateQueue[i]);
        }
    }
    if (VillageInfoUpdater.updateQueuePosition > removedIndex){
        VillageInfoUpdater.updateQueuePosition -= 1;
    }
    VillageInfoUpdater.updateQueue = newQueue;
}

VillageInfoUpdater.isVillageDisabled = function(id){
    for (i in VillageInfoUpdater.disabledVillages){
        if (VillageInfoUpdater.disabledVillages[i] == id) return true;
    }
    return false;
}

VillageInfoUpdater.tick = function(){
    SessionManager.save();
    VillageInfoView.updateUI();
}

VillageInfoUpdater.singleUpdate = function(i){
    var village = VillageInfoModel.get(i);
    VillageInfoUpdater.currentlyUpdatedId = village['id'];
    village['last_update'] = unixtime();
    VillageInfoModel.set(village);
    if (village['history'].length == 0 && SessionManager.analysisGracePeriod > 0){
        AJAX.get(Config.FIRST_REQUEST_URL.replace('@', village['id']), function(data){
            try {
                village = TWStatsUpdateStrategy.execute(village, data);
            }catch(e){
                village['error'] = e.message;
                VillageInfoModel.set(village);
                return;
            }
            village = PredictionEngine.predict(village);
            village['error'] = null;
            VillageInfoModel.set(village);
            // Re-update the village data to get the current point count
            // (this procedure only retrieves the previous point count)
            VillageInfoUpdater.singleUpdate(village['index']);
        }, function(err){
            village['error'] = "Nie udało się połączyć z serwerem TWStats";
            VillageInfoModel.set(village);
        });
    }else{
        AJAX.get(Config.GENERAL_REQUEST_URL.replace('@', village['id']), function(data){
            try {
                village = GuestAccessUpdateStrategy.execute(village, data);
            }catch(e){
                village['error'] = e.message;
                VillageInfoModel.set(village);
                return;
            }
            village = PredictionEngine.predict(village);
            village['error'] = null;
            VillageInfoModel.set(village);
        }, function(err){
            village['error'] = "Nie udało się połączyć z serwerem Plemion";
            VillageInfoModel.set(village);
        });
    }
    VillageInfoView.updateUI();
}

VillageInfoUpdater.update = function(){
    if (!VillageInfoUpdater.currentlyUpdatedId){
        var i = VillageInfoUpdater.updateQueue[VillageInfoUpdater.updateQueuePosition];
        VillageInfoUpdater.updateQueuePosition++;
        if (VillageInfoUpdater.updateQueuePosition >= VillageInfoUpdater.updateQueue.length){
            VillageInfoUpdater.updateQueuePosition = 0;
            VillageInfoUpdater.updateFirstCycle = false;
        }
        VillageInfoUpdater.singleUpdate(i);
    }
    var randomDelay = 13000 + Math.floor(4000 * Math.random());
    if (VillageInfoUpdater.updateFirstCycle) randomDelay = 1000 + Math.floor(1000 * Math.random());
    VillageInfoUpdater.updateTimer = setTimeout(VillageInfoUpdater.update, randomDelay);
}

VillageInfoUpdater.start = function(){
    VillageInfoUpdater.buildUpdateQueue();
    VillageInfoUpdater.uiTimer = setInterval(VillageInfoUpdater.tick, 1000);
    VillageInfoUpdater.updateTimer = setTimeout(VillageInfoUpdater.update, 1000);
}

VillageInfoUpdater.stop = function(){
    clearInterval(VillageInfoUpdater.uiTimer);
    clearTimeout(VillageInfoUpdater.updateTimer);
}