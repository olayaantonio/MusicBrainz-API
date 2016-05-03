'use strict';

//Requires/imports the HTTP module and request function
var http = require('http');
var request = require('request');

//Defines a port we want to listen to
const PORT=3000;

//Function which handles requests and send response for MBID

function handleMBID(req, res){
	request('http://musicbrainz.org/ws/2/artist'+ req.url+'?&fmt=json&inc=url-rels+release-groups', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	handleMBIDBody(body)
	  	handleAlbums(body)
			handleCoverArtArchive(body)
			albumCoverURL(urls)
	  }else{
	  	console.log('error: '+response.statusCode)
	  }
	})
}

function handleMBIDBody(body) {
	var relations = JSON.parse(body).relations;
  	relations.forEach(function (relation) {
  		if (relation.type == "wikipedia") {
  			var url = relation.url.resource
  			var lastPathComponent = lastPathComponentFromURL(url)
  			wikipediaBody(lastPathComponent)
  		}
  	})
}

function lastPathComponentFromURL(url) {
	var urlComponents = url.split("/")
  	return urlComponents[urlComponents.length - 1]
}

function wikipediaBody(artist) {
	var url = 'https://en.wikipedia.org/w/api.php?format=json&indexpageids&action=query&prop=extracts&exintro=&explaintext=&titles=' + artist
	request(url,function (error,response, body){
		var page_ids = JSON.parse(body).query.pageids
		var pages = JSON.parse(body).query.pages
		page_ids.forEach(function(page_id){
			var extract = pages[page_id].extract
		})
	})
}

function handleAlbums(body) {
	var release_groups = JSON.parse(body)["release-groups"]
	release_groups.forEach(function(releaseGroups){
		var albumTitles = releaseGroups.title
	})
}

function handleCoverArtArchive(body) {
	var release_groups = JSON.parse(body)["release-groups"]
	release_groups.forEach(function(releaseGroups){
		var album_titles = [releaseGroups.title]
		return album_titles
	})
}

function albumCoverURL(urls) {
	var album_titles_array = handleCoverArtArchive(body)
	album_titles_array.forEach(function(album_title){
		var url = 'http://coverartarchive.org/release-group/' + album_title
		request(url, function (error, response, body){
			var album_image_url = JSON.parse(body).images.image
			console.log(album_image_url);
		})
	})
}

//Create a server
var server = http.createServer(handleMBID);

//Starts our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening.
    console.log("Server listening on: http://localhost:%s", PORT);
});
