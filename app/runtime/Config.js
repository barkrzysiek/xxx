// Config.js

Config = {};

Config.VILLAGES_PER_CYCLE = 1733;

Config.GAME_WORLD = "pl188";

Config.VILLAGE_DATABASE_URL = "https://" + Config.GAME_WORLD + ".plemiona.pl/map/village.txt";

Config.FIRST_REQUEST_URL = "http://pl.twstats.com/" + Config.GAME_WORLD + 
                           "/index.php?page=village&id=@&utm_source=pl&utm_medium=village&utm_campaign=dsref";
Config.GENERAL_REQUEST_URL = "https://" + Config.GAME_WORLD + ".plemiona.pl/guest.php?screen=info_village&id=@";

// Config.FIRST_REQUEST_URL = "http://127.0.0.1:8000/cgi-bin/tws.py";
// Config.GENERAL_REQUEST_URL = "http://127.0.0.1:8000/cgi-bin/guest.py";

Config.VERSION = "1.0.1";
