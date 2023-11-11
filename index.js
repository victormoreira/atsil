const { parseM3U, writeM3U }  = require("@iptv/playlist");
const fs = require('fs');

let channels = [];

const playlistsDir = "playlists/";

const formatString = (string) => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

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

const ignoreFilterLists = ["listinha.m3u8"];

fs.readdirSync(playlistsDir).forEach(file => {
	var x = playlistsDir + file;
 	var contents = fs.readFileSync(x).toString();
	var playlist = parseM3U(contents);
	var t = playlist.channels;
	
	if (!ignoreFilterLists.includes(file)) {
		t = found(t, filters, groups);
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