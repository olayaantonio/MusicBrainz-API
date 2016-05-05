'use strict';

//Requires/imports the HTTP module and request function
var http = require('http');
var request = require('request');
var Q = require('q')

//Defines a port we want to listen to
const PORT=3000;

//Function which handles requests and send response for MBID

function requestPropagator(req, res){
	request('http://musicbrainz.org/ws/2/artist'+ req.url+'?&fmt=json&inc=url-rels+release-groups', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			handleMBIDBody(body)
			.then(handleAlbums(body))
			.then(handleCoverArtArchive(body))
			.then(albumCoverURL(urls))
			.catch(function(error){
				console.log('error: '+response.statusCode)
			})
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
	var deferrer = Q.defer()
	asynchronousFunction(function(response_1){
		var url = 'https://en.wikipedia.org/w/api.php?format=json&indexpageids&action=query&prop=extracts&exintro=&explaintext=&titles=' + artist
		request(url,function (error,response, body){
			var page_ids = JSON.parse(body).query.pageids
			var pages = JSON.parse(body).query.pages
			page_ids.forEach(function(page_id){
				var extract = pages[page_id].extract
				return extract
			})
		})
		deferrer.resolve(response_1)
	})
	return deferrer.promise()
	console.log(extract);
}

var response_1 = wikipediaBody

function handleAlbums(body) {
	var deferrer = Q.defer()
	asynchronousFunction(function(response_2){
		var release_groups = JSON.parse(body)["release-groups"]
		release_groups.forEach(function(releaseGroups){
			var albumTitles = releaseGroups.title
			console.log(albumTitles)
		})
		deferrer.resolve(response_2)
	})
	return deferrer.promise()
}

var response_2 = handleAlbums()

function handleCoverArtArchive(body) {
	var deferrer = Q.defer()
	asynchronousFunction(function(response_3){
		var release_groups = JSON.parse(body)["release-groups"]
		release_groups.forEach(function(releaseGroups){
			var album_titles = [releaseGroups.title]
			return album_titles
		})
		deferrer.resolve(response_3)
	})
	return deferrer.promise()
}

var response_3 = handleCoverArtArchive()

function albumCoverURL(urls) {
	var deferrer = Q.defer()
	asynchronousFunction(function(response_3){
		var album_titles_array = handleCoverArtArchive(urls)
		album_titles_array.forEach(function(album_title){
			var url = 'http://coverartarchive.org/release-group/' + album_title
			request(url, function (error, response, body){
				var album_image_url = JSON.parse(body).images.image
				console.log(album_image_url);
			})
		})
		deferrer.resolve(response_4)
	})
	return deferrer.promise()
}

var response_4 = albumCoverURL()

//Create a server
var server = http.createServer(requestPropagator);

//Starts our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening.
    console.log("Server listening on: http://localhost:%s", PORT);
});
