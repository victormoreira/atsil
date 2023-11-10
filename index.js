const { parseM3U, writeM3U }  = require("@iptv/playlist");
const fs = require('fs');

var contents = fs.readFileSync('listinha.m3u8').toString();

const m3u = contents;
const playlist = parseM3U(m3u);
const channels  = playlist.channels;

channels.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

const playlistObject = {
  channels: channels,
  headers: {},
};

const m3u2 = writeM3U(playlistObject);
console.log(m3u2); // #EXTM3U ...