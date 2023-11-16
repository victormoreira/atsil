const { parseM3U, writeM3U }  = require("@iptv/playlist");
const fs = require('fs'); 
const https = require('https');

let channels = [];

const playlistsDir = "playlists/";

const filters = [
	"AXN", 
	"Jovem Pan", 
	"VIVA", 
	"LIFETIME",
	"UNIVERSAL",
	"Investigação Discovery",
	"DISCOVERY ID"
];

const groups = [
	"TV",
	"NOTICIAS",
	"CANAIS"
];

const formatString = (string) => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const filterByP = (arr, property, strings) => {
	return arr.filter((el) =>  !!el[property] && strings.some(v => formatString(el[property]).includes(formatString(v))))
}

const found = (arr, strings, groups) => { 
	return arr.filter((el) => 
		!!el.name &&
		!!el.groupTitle &&
		(groups.some(
			v => formatString(el.groupTitle).includes(formatString(v))
		) &&
 		strings.some(
			v => formatString(el.name).includes(formatString(v))
		))
	)
 };

const ignoreFilterLists = ["listinha.m3u8", "a"];

fs.readdirSync(playlistsDir).forEach(file => {
	var x = playlistsDir + file;
 	var contents = fs.readFileSync(x).toString();
	var playlist = parseM3U(contents);
	var t = playlist.channels;
	
	t = filterByP(t, "groupTitle", groups);	

	if (!ignoreFilterLists.includes(file)) {
		t = filterByP(t, "name", filters);
	}

	channels.push(t);
});

const all = channels.reduce(function(result, current) {
  return Object.assign(result, current);
}, []);

all.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

const playlistObject = {
  channels: all,
  headers: {},
};

const m3u2 = writeM3U(playlistObject);
console.log(m3u2); // #EXTM3U ...