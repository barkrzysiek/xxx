// VillageInfoView.js

VillageInfoView = {};

VillageInfoView.updateUI = function(){
    for (i in VillageInfoModel.villageData){
        var village = VillageInfoModel.villageData[i];
        var element = $('.village-entry[data-id=' + village['id'] + ']');
        if (!village['error']){
            element.find('span').html(VillageInfoView.generateDescription(village));
        }else{
            var html = "<b class='error-hint' title='" + entities(village['error']) + "'>";
            html += "Błąd</b> (ostatnie dane: <i>";
            html += VillageInfoView.generateDescription(village, true);
            html += "</i>)";
            element.find('span').html(html);
        }
        element.removeClass('entry-ok entry-damaged entry-clear entry-unknown');
        element.addClass(VillageInfoView.generateClassNames(village));
        var rows = $('.village-details[data-id=' + village['id'] + ']').find('.data-row');
        var last = village['history'][village['history'].length - 1];
        var prelast = village['history'][village['history'].length - 2];
        var first = village['history'][0];
        $(rows[0]).html(VillageInfoView.generateTimeLeftString(village['last_update']));
        $(rows[1]).html(village['history'][0]);
        $(rows[2]).html(last + " (" + VillageInfoView.generatePointDiff(first, last) + ")");
        $(rows[3]).html(village['history'].length + " (ostatnia zmiana: " + 
                        VillageInfoView.generatePointDiff(prelast, last) + ")");
    }
}

VillageInfoView.createUI = function(){
    for (i in VillageInfoModel.villageData){
        var village = VillageInfoModel.villageData[i];
        var entry;
        var html = '';
        html =  "<div class='village-entry entry-unknown' data-id='" + village['id'] + "'";
        if (VillageInfoUpdater.isVillageDisabled(village['id'])){
            html += " style='display:none'";
        }
        html += "><div class='details-icon' onclick='villageShowDetails(this)'></div> ";
        html += "<a href='https://" + Config.GAME_WORLD + ".plemiona.pl/game.php?";
        html += "screen=info_village&id=" + village['id'] + "' target='_blank' onclick='return extern(this)'>";
        html += entities(village['name'] + " (" + village['x'] + "|" + village['y'] + ") ");
        html += continent(village['x'], village['y']) + "</a>";
        html += "<span>Oczekiwanie</span>";
        html += "</div>";
        html += "<div style='display:none'><table class='village-details' data-id='" + village['id'] + "'";
        if (VillageInfoUpdater.isVillageDisabled(village['id'])){
            html += " style='display:none'";
        }
        html += "><tr><td>Ostatnia aktualizacja danych:</td><td class='data-row'>(?)</td></tr>";
        html += "<tr><td>Początkowa ilość punktów:</td><td class='data-row'>(?)</td></tr>";
        html += "<tr><td>Obecna ilość punktów:</td><td class='data-row'>(?)</td></tr>";
        html += "<tr><td>Ilość zmian w punktach:</td><td class='data-row'>(?)</td></tr>";
        html += "<tr><td>Akcje:</td><td>(<a href='#' onclick='villageRemove(this)'><b>usuń</b></a>) (<a href='#' onclick='villageCorrect(this)'><b>popraw</b></a>)</td></tr>";
        html += "</table></div>";
        $('#slide_main').append(html);
    }
}

VillageInfoView.generateTimeLeftString = function(timestamp){
    if (timestamp == -1) return "(nigdy)";
    timestamp = unixtime() - timestamp;
    var seconds = timestamp % 60;
    timestamp = Math.floor(timestamp / 60);
    var minutes = timestamp % 60;
    var hours = Math.floor(timestamp / 60);
    if (seconds < 10) seconds = '0' + seconds.toString();
    if (minutes < 10) minutes = '0' + minutes.toString();
    if (hours < 10) hours = '0' + hours.toString();
    return hours + ":" + minutes + ":" + seconds;
}

VillageInfoView.generateDescription = function(data, ignore_errors){
    if (!ignore_errors){
        if (data['id'] == VillageInfoUpdater.currentlyUpdatedId) return "Sprawdzanie...";
        if (data['last_update'] == -1) return "Oczekiwanie";
    }
    var info = 'Mur poziom ' + data['predicted_wall'];
    if (data['predicted_wall'] < 20){
        info = '<b>' + info + '</b>';
    }
    if (data['predicted_smithy'] < 20){
        info += ', Kuźnia poziom ' + data['predicted_smithy'];
    }
    if (data['predicted_farm'] < 30){
        info += ', Zagroda poziom ' + data['predicted_farm'];
    }
    if (!data['prediction_accurate']){
        var last = data['history'][data['history'].length - 1];
        var first = data['history'][0];
        if (last - first < 0){
            info = '<b>?</b> (<i>' + (last - first) + ' punktów</i>)';
        }else{
            info = '<b>?</b> (<i>+' + (last - first) + ' punktów</i>)';
        }
    }
    return info;
}

VillageInfoView.generateClassNames = function(data){
    if (data['id'] == VillageInfoUpdater.currentlyUpdatedId) return "entry-unknown";
    if (data['last_update'] == -1) return "entry-unknown";
    if (data['error']) return "entry-unknown";
    if (!data['prediction_accurate']) return "entry-inaccurate";
    if (data['predicted_wall'] == 0) return "entry-clear";
    if (data['predicted_wall'] < 20) return "entry-damaged";
    return "entry-ok";
}

VillageInfoView.generatePointDiff = function(penultimate, ultimate){
    if (typeof ultimate == 'undefined') return "?";
    if (typeof penultimate == 'undefined') return "<span style='color:green'>+0</span>";
    var diff = ultimate - penultimate;
    if (diff < 0){
        return "<span style='color:red'>" + diff + "</span>";
    }else{
        return "<span style='color:green'>+" + diff + "</span>";
    }
}
