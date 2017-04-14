const express = require('express');
const app = express();
const users = require('./data/users.js');
const projects = require('./data/projects.js');
//adding psql/////////////
var pg = require('pg');
var format = require ('pg-format');
var PGUSER = 'postgres';
var PGDATABASE = 'mydb';
var age = 25;
var config ={
  user: PGUSER,
  database: PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);
var client;

////////////////////////////

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  console.log('Request Type: ', req.method);
  next();
}).use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Il y a une erreur quelque part!')
})

// app.get('/coucou', (req, res) => {
//   res.send("Coucou !!!!");
//   }).
//   get('/coucou/:name/:lastname', (req, res) => {
//   res.send(`Hello ! Coucou !! Ton prénom est ${req.params.name} et ton nom est ${req.params.lastname} !`);
//   }).
//   get('/', (req, res) => {
//     res.send('Welcome to the family son!!!');
//   }).
//   get('/*', (req, res) => {
//     res.send(`Cette page n'existe pas!!`);
//   });


app.get('/', (req, res) => {
  res.render('pages/home');
  })
  .get('/users', (req, res) => {
    pool.connect(function (err, client, done){
      if (err) console.log(err);

      myClient = client;
      var ageQuery = format('SELECT * from funs.check1')
      myClient.query(ageQuery, function (err, result) {
        if (err) {
          console.log(err);
        };
        console.log(result.rows[0]);
        res.send(result.rows);
        // res.render('pages/usersList', {
        //   users: users,
        // });
      });
    });

  })
  .get('/users/:id', (req, res) => {

    const user = users.find( (user) => {
      return user.id === Number(req.params.id);
    })

    if(user) {
      res.render('pages/user', {
        users: users,
        id: req.params.id
      })
    } else {
      res.send(`Cet utilisateur n'existe pas!`);
    }
  })
  .get('/projects', (req, res) => {
    res.render('pages/projectsList', {
      projects: projects
    });
  })
  .get('/projects/:id', (req, res) => {

    const project = projects.find( (project) => {
      return project.id === Number(req.params.id);
    });

    if (project) {
      res.render('pages/project', {
        projects : projects,
        id: req.params.id
      });
    } else {
      res.send(`Ce projet n'existe pas!!`);
    }
  })
  .get('/users/:userId/projects', (req, res) => {

    const projectUser = projects.filter( (project) => {
      return project.userId === Number(req.params.userId);
    });

    if(projectUser) {
      res.render('pages/userProjects', {
        projects: projectUser,
        userId: req.params.userId
      });
    } else {
      res.send(`Ce projet n'existe pas!!`);
    }
  })
  .get('/*', (req, res) => {
    res.send(`Cette page n'existe pas!!! :(`);
  });
//////////////////////////

app.listen(5000, function () {
  console.log("PSQL app listening on port 5000!");
});
/////////////////
// app.listen(5000, () => {
//   console.log('Le serveur écoute sur le port 5000!');
// });
