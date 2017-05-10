// Utils.js

function transition(a, b, complete){
    $('.slide').css('display', 'none');
    $(a).css('display', 'block');
    $(b).css('display', 'block');
    $(b).insertAfter($(a));
    $(a).slideUp(400);
    if (complete) $(b).slideDown(400, complete);
    else $(b).slideDown(400);
}

function entities(s){
    return $('<div>').text(s).html();
}

function preloadImage(url){
    var e = $('<img>');
    e.css("position", "absolute");
    e.css("left", "-10000px");
    e.css("top", "-10000px");
    e.attr("src", url);
    $('body').append(e);
}

function continent(x, y){
    x = Math.floor(x / 100).toString();
    y = Math.floor(y / 100).toString();
    return 'K' + x + y;
}

function extern(e){
    var url = e.href;
    if (typeof require == 'undefined'){
        return true;
    }
    var gui = require('nw.gui');
    gui.Shell.openExternal(url);
    return false;
}

function unixtime(){
    return Math.floor((+new Date()) / 1000);
}

function curdate(){
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) day = "0" + day.toString();
    if (month < 10) month = "0" + month.toString();
    return year + "-" + month + "-" + day;
}

function coordsFromBlock(id){
    return (id % 1000) + "|" + Math.floor(id / 1000);
}