var db = require('./models');
var express = require('express');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var app = express();

app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(express.static(path.join(__dirname, 'public')));

//add a fav pokemon by clicking on the 'add to fav' button
app.post('/pokemon', function(req, res) {
	db.pokemon.create({
		name: req.body.name
	}).then(function(data) {
		res.redirect('/pokemon');
	})
})

app.delete('/pokemon/:name/destroy', function(req, res) {
	console.log('in delete route');
	db.pokemon.destroy({
		where: {name: req.params.name}
	}).then(function(data) {
		res.send('success');
	})
})

app.get('/pokemon/:id', function(req,res) { // to your results
   var pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/' + req.params.id;
   console.log(pokemonUrl);
   request(pokemonUrl, function(error, response, body) {
     if (!error && response.statusCode === 200) {
       var dataObj = JSON.parse(body);
       res.render('details', {pokemon: dataObj}); // change index to whatever your ejs file is called
     }
   })
 });

app.get('/pokemon', function(req, res) {
		db.pokemon.findAll().then(function(data) {
			res.render('pokemon', {pokemon: data});
	});
})

app.get('/', function(req, res) {
    var pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';

    request(pokemonUrl, function(error, response, body) {
        var pokemon = JSON.parse(body).results;
        res.render('index', { pokemon: pokemon });
    });
});

app.use('/pokemon', require('./routes/pokemon'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
