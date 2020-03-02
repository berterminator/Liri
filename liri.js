require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

var obtainArtistname = function(artist) {
  return artist.name;
};


var getSpotify = function(nameOfSong) {
  if (nameOfSong === undefined) {
    nameOfSong = "What's my age again";
  }

  spotify.search(
    {
      type: "track",
      query: nameOfSong
    },
    function(err, data) {
      if (err) {
        console.log("The following error occured " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("Artist: " + songs[i].artists.map(obtainArtistname));
        console.log("Name of song: " + songs[i].name);
        console.log("Preview of song: " + songs[i].preview_url);
        console.log("Album release: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

var getMyBands = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(queryURL).then(
    function(response) {
      var jsonData = response.data;

      if (!jsonData.length) {
        console.log("I found no results for " + artist);
        return;
      }

      console.log("These are the upcoming concerts for " + artist + ":");

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];


        console.log(
          show.venue.city +
            "," +
            (show.venue.region || show.venue.country) +
            " at " +
            show.venue.name +
            " " +
            moment(show.datetime).format("MM/DD/YYYY")
        );
      }
    }
  );
};


var getMeMovie = function(movieName) {
  if (nameOfMovie === undefined) {
    nameOfMovie = "The Lion King";
  }

  var urlHit =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  axios.get(urlHit).then(
    function(response) {
      var jsonData = response.data;

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
    }
  );
};


var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

var pick = function(dataOfCase, dataFunction) {
  switch (dataOfCase) {
  case "concert-this":
    getMyBands(dataFunction);
    break;
  case "spotify-this-song":
    getSpotify(dataFunction);
    break;
  case "movie-this":
    getMeMovie(dataFunction);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

var runThis = function(firstArgvOne, secondArgv) {
  pick(firstArgvOne, secondArgv);
};


runThis(process.argv[2], process.argv.slice(3).join(" "));
