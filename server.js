var express        = require('express');
var path           = require('path');
var exphbs         = require('express-handlebars');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var pg             = require('pg');
var sendgrid 	= require("sendgrid")("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", {localhost:3000});

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

app.listen(3000);

var connectionString = "pg://localhost/wikiapps_db";

app.get('/', function (req, res){
	res.render('home');
})
app.get('/newarticle', function (req, res){
		res.render('newarticle')
})
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
		} if (req.body.tablename == 'food_drinks') {
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
		} if (req.body.tablename == 'getting_arounds') {
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
		}
});
//search bar
//below is the search bar for attempt#1
app.put('/searchbar', function (req, res){
	var search = req.body.search 
	//pg.connect(connectionString, function (err, client, done) {
		//client.query('SELECT * FROM food_drinks, getting_arounds, meeting_peoples', function (err, result){
	  // 		 done();
			// var data = {
			// allTables : result.rows
			// }
			// res.render('result', data)
	 	// 	}
	// res.render('results', data)
	// console.log(data)
	// );
	// });	
	// if (search == 'apples'){
	// 		res.redirect('searchresults', search)
	// 	};
	// Poo is the test value that works
	// var poo = {
	// 	doo : search
	// }
	// console.log(poo)
	// console.log(search)

	res.redirect('/searchresults')
});	
// this is the all.get to render the results trigger by the search word
app.get('/searchresults', function (req, res){
	pg.connect(connectionString, function (err, client, done){
 		client.query('SELECT name FROM food_drinks UNION SELECT name FROM getting_arounds UNION SELECT name FROM meeting_peoples', function (err, result){
 			done();
 			for (var i = 0; i < result.rows.length; i++){
			if (result.rows[i].name == 'akejrg') {
 				//console.log('YES');
 				console.log(result.rows[i].name)
 			} else {
 				console.log('no app found');
 			}
 			}
 			var data = {
 				allTables : result.rows
 			}
 			res.render('results', data);
 		});
 	});
});
//above is the search bar for attempt #1
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
app.get('/food_drinks/mainpage/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		// var apple = parseInt(req.params.id) + 1
		client.query('SELECT * FROM food_drinks WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('food_drinks_mainpage', data);
			console.log(req.query)
		});
	});
});
app.get('/food_drinks/edit/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){

		client.query('SELECT * FROM food_drinks WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('food_drinks_edit', data);
		});
	});
});
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
app.get('/getting_arounds/mainpage/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM getting_arounds WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('getting_arounds_mainpage', data);
		});
	});
});
app.get('/getting_arounds/edit/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM getting_arounds WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('getting_arounds_edit', data);
		});
	});
});
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
app.get('/meeting_peoples/mainpage/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM meeting_peoples WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('meeting_peoples_mainpage', data);
		});
	});
});
app.get('/meeting_peoples/edit/:id', function (req, res){
	pg.connect(connectionString, function (err, client, done){
		client.query('SELECT * FROM meeting_peoples WHERE id=$1', [req.params.id], function (err, result){
			done();
			var data = result.rows[0];
			res.render('meeting_peoples_edit', data);
		});
	});
});
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
			var payload  = new sendgrid.Email({
			  to      : 'kenneth_yee2@yahoo.com',
			  from    : 'kenneth_yee2@yahoo.com',
			  subject : 'Saying Hi',
			  text    : 'This is my first email through SendGrid'
			});
			sendgrid.send(payload, function(err, json) {
			  if (err) { console.error(err); }
			  console.log(json);
			});	
			res.redirect('/meeting_peoples');
			}
		);
	});
});




