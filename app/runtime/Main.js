// Main.js

preloadImage('assets/expand.png');
preloadImage('assets/collapse.png');

function villageShowDetails(e){
    var id = $(e).parent().attr('data-id');
    $('.village-entry[data-id=' + id + ']').toggleClass('entry-expanded');
    $('.village-details[data-id=' + id + ']').parent().slideToggle(200);
}

function villageRemove(e){
    var id = $(e).closest("table").attr('data-id');
    $('.village-entry[data-id=' + id + ']').slideUp();
    $('.village-details[data-id=' + id + ']').closest("div").slideUp();
    VillageInfoUpdater.disableVillage(id);
}

villageCorrectCurrentId = null;

function villageCorrect(e){
    var id = $(e).closest("table").attr('data-id');
    villageCorrectCurrentId = id;
    $('#correct_wall').val('');
    $('#correct_smithy').val('');
    $('#correct_farm').val('');
    $('#dialog_correct').dialog({
        autoOpen: true,
        height: 350,
        width: 400,
        modal: true,
        buttons: {},
        draggable: false,
        resizable: false
    });
}

function villageAcceptCorrection(){
    var village = VillageInfoModel.get(
        VillageInfoModel.villageFromId(villageCorrectCurrentId)
    );
    village['predicted_wall'] = parseInt($('#correct_wall').val());
    village['predicted_smithy'] = parseInt($('#correct_smithy').val());
    village['predicted_farm'] = parseInt($('#correct_farm').val());
    village['prediction_accurate'] = true;
    if (village['predicted_wall'] > 20 ||
        village['predicted_smithy'] > 20 ||
        village['predicted_farm'] > 30 ||
        village['predicted_wall'] < 0 ||
        village['predicted_smithy'] < 0 ||
        village['predicted_farm'] < 1 ||
        isNaN(village['predicted_wall']) ||
        isNaN(village['predicted_smithy']) ||
        isNaN(village['predicted_farm'])){
        return;
    }
    VillageInfoModel.set(village);
    VillageInfoView.updateUI();
    $('#dialog_correct').dialog('close');
}

function updateVersionString(){
    var str = "Strażnik Murków v" + Config.VERSION;
    str += " | Sprawdzane wioski: " + VillageInfoModel.villageData.length;
    $('#version-string').html(str);
}

function start(){
    $('#dialog_correct').keypress(function(e){
        if (e.keyCode == $.ui.keyCode.ENTER) {
            villageAcceptCorrection();
        }
    });
    VillageDatabase.asyncLoad(function(){
        try {
            $('body').css('overflow-y', 'scroll');
            SessionManager.apply();
            updateVersionString();
            VillageInfoView.createUI();
            VillageInfoView.updateUI();
            VillageInfoUpdater.start();
            transition("#slide_loader", "#slide_main");
        }catch(e){
            var errorText = "Wystąpił błąd przy przetwarzaniu danych: " + e.message;
            $('#error-message').html(errorText);
            transition("#slide_loader", "#slide_error");
            VillageInfoModel.clear();
            SessionManager.clear();
        }
    }, function(code, msg){
        var errorText = "Wystąpił błąd przy pobieraniu danych: " +
                        code.status + " [" + entities(code.statusText) + "]";
        if (typeof process == 'undefined' && typeof window.crossOriginRequest == 'undefined'){
            errorText += "<br><br>Wykryłem, że używasz Strażnika Murków w przeglądarce, ";
            errorText += "ale nie zainstalowałeś skryptu do małpy.";
            errorText += "<br>Zainstaluj skrypt i spróbuj ponownie.";
        }
        $('#error-message').html(errorText);
        transition("#slide_loader", "#slide_error");
    });
}