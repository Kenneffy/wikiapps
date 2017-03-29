var express        = require('express');
var path           = require('path');
var exphbs         = require('express-handlebars');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var pg             = require('pg');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main', extname: 'handlebars'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.use(methodOverride(function (req, res) {
	if(req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

// app.listen(3000);
app.listen(process.env.PORT || 5000)

// var connectionString = "pg://localhost/wikiapps_db";

var connectionString = "postgres://qcpgcwgfapwfto:70b83e5880cdaab9d1b0356d57f92616051817b714d0fe518ac2b5aa12b24ee3@ec2-54-225-107-107.compute-1.amazonaws.com:5432/d487l3tvf6fd9d";

//route for home page
app.get('/', function (req, res){
	res.render('home');
});

//route for rendering new article handlebar
app.get('/newarticle', function (req, res){
	res.render('newarticle');
});

//route for sending a newly created article to a specific category
app.post('/newarticle', function (req, res){
		if (req.body.tablename == 'meeting_peoples') {
			var name = req.body.name;
			var description = req.body.description;
			var features = req.body.features;
			var author = req.body.author;
			pg.connect(connectionString, function (err, client, done){
				client.query('INSERT INTO meeting_peoples (name, description, features, author) VALUES ($1,$2,$3,$4)', [name, description, features, author], function (err, result){
					done();
					res.redirect('/meeting_peoples')
				});
			});
		} else if (req.body.tablename == 'food_drinks') {
			var name = req.body.name;
			var description = req.body.description;
			var features = req.body.features;
			var author = req.body.author;
			pg.connect(connectionString, function (err, client, done){
				client.query('INSERT INTO food_drinks (name, description, features, author) VALUES ($1,$2,$3,$4)', [name, description, features, author], function (err, result){
					done();
					res.redirect('/food_drinks')
				});
			});
		} else if (req.body.tablename == 'getting_arounds') {
			var name = req.body.name;
			var description = req.body.description;
			var features = req.body.features;
			var author = req.body.author;
			pg.connect(connectionString, function (err, client, done){
				client.query('INSERT INTO getting_arounds (name, description, features, author) VALUES ($1,$2,$3,$4)', [name, description, features, author], function (err, result){
					done();
					res.redirect('/getting_arounds')
				});
			});
		} else {
			alert('nothing happened');
		}
});

//route for displaying all articles on food drinks
app.get('/food_drinks', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM food_drinks', function (err, result){
			done();
			var data = {
				food_drinks : result.rows
			};
			res.render('food_drinks', data);
		});
	});
});

//route for displaying all information on a particular article
app.get('/food_drinks/mainpage/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		// var apple = parseInt(req.params.id) + 1
		client.query('SELECT * FROM food_drinks WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('food_drinks_mainpage', data);
			console.log(data);
		});
	});
});

//route for displaying all article information ready to be edited 
app.get('/food_drinks/edit/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){

		client.query('SELECT * FROM food_drinks WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('food_drinks_edit', data);
		});
	});
});

//route for updating information about an article 
app.put('/food_drinks/:id', function (req, res){
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var features = req.body.features;
	var author = req.body.author;
	pg.connect(connectionString, function (err, client, done) {
		client.query('UPDATE food_drinks SET name=$1, description=$2, features=$3, author=$4 WHERE id=$5', [name, description, features, author, id], function (err, result){
			done();
			res.redirect('/food_drinks')
		});
	});
});

//route for displaying all articles on getting around
app.get('/getting_arounds', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM getting_arounds', function (err, result){
			done();
			var data = {
				getting_arounds : result.rows
			};
			res.render('getting_arounds', data);
		});
	});
});

//route for displaying all information on a particular article
app.get('/getting_arounds/mainpage/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM getting_arounds WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('getting_arounds_mainpage', data);
		});
	});
});

//route for displaying all article information ready to be edited 
app.get('/getting_arounds/edit/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM getting_arounds WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('getting_arounds_edit', data);
		});
	});
});

//route for updating information about an article 
app.put('/getting_arounds/:id', function (req, res){
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var features = req.body.features;
	var author = req.body.author;	
	pg.connect(connectionString, function (err, client, done){
		client.query('UPDATE getting_arounds SET name=$1, description=$2, features=$3, author=$4 WHERE id=$5', [name, description, features, author, id], function (err, result){
			done();
			res.redirect('/getting_arounds');
		});
	});
});

//route for displaying all articles on meeting people
app.get('/meeting_peoples', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM meeting_peoples', function (err, result){
			done();
			var data = {
				meeting_peoples : result.rows
			};
			res.render('meeting_peoples', data);
		});
	});
});

//route for displaying all information on a particular article
app.get('/meeting_peoples/mainpage/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM meeting_peoples WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('meeting_peoples_mainpage', data);
		});
	});
});

//route for displaying all article information ready to be edited 
app.get('/meeting_peoples/edit/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM meeting_peoples WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('meeting_peoples_edit', data);
		});
	});
});

//route for updating information about an article 
app.put('/meeting_peoples/:id', function (req, res){
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var features = req.body.features;
	var author = req.body.author;
	pg.connect(connectionString, function (err, client, done) {
		client.query(
			'UPDATE meeting_peoples SET name=$1, description=$2, features=$3, author=$4 WHERE id=$5', 
			[name, description, features, author, id], 
			function (err, result){
				done();	
			res.redirect('/meeting_peoples');
			}
		);
	});
});





