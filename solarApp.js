//~~~~~~~~~~~~~~~
//Terezie Schaller
//CS340 - Intro to databases
//Spring 2017
//Node application for final project
//~~~~~~~~~~~~~~~~~

//express and mysql
var express = require('express');
var mysql = require('./tschal.js');
//set up app and handlebars
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 12529);
//add the other stuff
//bodyparser - parses incoming http request bodyparser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//request
var request = require('request');
//that public/static thingy
app.use(express.static('public'));

//**************
//~~~~~~~~~~~~~~
//ROUTE HANDLERS
//~~~~~~~~~~~~~~
//**************

//home page
app.get('/',function(req,res,next){
  res.render('home');
});

//~~~~~~~~~~~~~~
//show data
//~~~~~~~~~~~~~~

//show data helper function
var showData = function(res, table) {
  var context = {};
  mysql.pool.query('SELECT * from ' + table, function(err, rows, fields){

    if (err) {
      console.log(err);
      return;
    }

    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
};

//showOwner
app.get('/ownerData', function(req,res){
  showData(res, 'owner')
});

//show parts
app.get('/partData', function(req,res){
  showData(res, 'part')
});

//show test
app.get('/testData', function(req,res){
  showData(res, 'test')
});

//show issue
app.get('/issueData', function(req,res){
  showData(res, 'issue')
});

//show part-owner
app.get('/poData', function(req,res){
  showData(res, 'part_owner')
});

//show part-issue
app.get('/piData', function(req,res){
  showData(res, 'part_issue')
});

//~~~~~~~~~~~
//ADD
//~~~~~~~~~~~~

//owner
app.post('/addOwner',function(req,res){
  console.log("Data recieved: " + req.body.fname + ", " + req.body.lname);
  mysql.pool.query
  ("INSERT INTO owner (`first_name`, `last_name`) VALUES (?, ?)",
  [req.body.fname, req.body.lname]);
  var context = {};
  context.owner = "Owner added: " + req.body.lname + ", " + req.body.fname;
  res.render('home', context)
});

//part
//must also add to owner_part
app.post('/addPart',function(req,res){
  console.log("Data recieved: "+ req.body.owner_id + ", " + req.body.desc + ", " + req.body.ddate + ", " + req.body.cpath);
  mysql.pool.query
  ("INSERT INTO part (`desc`, `due_date`, `critical_path`) VALUES (?, ?, ?)",
  [req.body.desc, req.body.ddate, req.body.cpath]);

  //Insert into part_owner!!
  //SELECT last part_id --> MAX(id)
  mysql.pool.query
  ("INSERT INTO part_owner (`part_id`, `owner_id`) VALUES ((SELECT MAX(id) AS p_id FROM part), ?)",
  [req.body.owner_id]);

  var context = {};
  context.part = "Part added: " + req.body.desc + ", " + req.body.ddate + ", " + req.body.cpath;
  res.render('home', context)
});

//test
app.post('/addTest', function(req,res){
  console.log("Data recieved: " + req.body.part_id + ", " + req.body.desc + ", " + req.body.ddate + ", " + req.body.note);
  mysql.pool.query
  ("INSERT INTO test (`part_id`,`desc`,`due_date`,`note`) VALUES (?, ?, ?, ?)",
  [req.body.part_id, req.body.desc, req.body.ddate, req.body.note]);

  var context = {};
  context.test = "Test added: " + req.body.desc + ", " + req.body.part_id + ", " + req.body.ddate, ", " + req.body.note;
  res.render('home', context)

});

//issue
//must also add to part-issue
app.post('/addIssue',function(req,res){
  console.log("Data recieved: "+ req.body.part_id + ", " + req.body.desc + ", " + req.body.prty + ", " + req.body.status);
  mysql.pool.query
  ("INSERT INTO issue (`desc`, `priority`, `status`) VALUES (?, ?, ?)",
  [req.body.desc, req.body.prty, req.body.status]);

  //Insert into part_issue!!
  //SELECT last issue_id --> MAX(id)
  mysql.pool.query
  ("INSERT INTO part_issue (`issue_id`, `part_id`) VALUES ((SELECT MAX(id) FROM issue), ?)",
  [req.body.part_id]);

  var context = {};
  context.issue = "Issue added: " + req.body.desc + ", " + req.body.prty + ", " + req.body.status;
  res.render('home', context)
});

//~~~~~~~~~~~
//delete
//~~~~~~~~~~~

//owner
app.post('/deleteOwner', function(req,res,next){
  var context = {};
  mysql.pool.query('DELETE FROM owner WHERE id=?', [req.body.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.owner = "Owner deleted - ID: " + req.body.id;
    res.render('home', context);
  });
});

//part
app.post('/deletePart', function(req,res,next){
  var context = {};
  mysql.pool.query('DELETE FROM part WHERE id=?', [req.body.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.part = "Part deleted - ID: " + req.body.id;
    res.render('home', context);
  });
});

//test
app.post('/deleteTest', function(req,res,next){
  var context = {};
  mysql.pool.query('DELETE FROM test WHERE id=?', [req.body.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.test = "Test deleted - ID: " + req.body.id;
    res.render('home', context);
  });
});

//issue
app.post('/deleteIssue', function(req,res,next){
  var context = {};
  mysql.pool.query('DELETE FROM issue WHERE id=?', [req.body.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.issue = "Issue deleted - ID: " + req.body.id;
    res.render('home', context);
  });
});

//~~~~~~~~~~~~~
//edit
//~~~~~~~~~~~~~

//owner
//change first and last name


app.post('/editOwner', function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT last_name, first_name FROM owner WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE owner SET last_name=?, first_name=? WHERE id=?",
      [req.body.lname || curVals.last_name, req.body.fname || curVals.first_name, req.body.id],
      function(err, result){
      if(err){
        next(err);
        return;
      }
      context.owner = "Updated " + result.changedRows + " rows.";
      res.render('home', context);
      });
    }
  });
});

//part
//need to change part_owner to edit owner
//make sure part only has 1 owner!!
app.post('/editPartOwner', function(req,res,next){
  var context = {};

  mysql.pool.query('DELETE FROM part_owner WHERE part_id=?',
    [req.body.pid]);

  mysql.pool.query('INSERT INTO part_owner (part_id, owner_id) VALUES (?, ?)',
    [req.body.pid, req.body.oid]);

    context.part = "Updated " + req.body.pid + " : " + req.body.oid;
    res.render('home', context);

});

app.post('/editPart', function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT `desc`, `due_date`, `critical_path` FROM part WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE part SET `desc`=?, `due_date`=?, `critical_path`=? WHERE id=?",
      [req.body.desc || curVals.desc, req.body.ddate || curVals.due_date, req.body.cpath || curVals.critical_path, req.body.id],
      function(err, result){
      if(err){
        next(err);
        return;
      }
      context.part = "Updated " + result.changedRows + " rows.";
      res.render('home', context);
      });
    }
  });
});

//test
app.post('/editTest', function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT `part_id`,`desc`, `due_date`, `note` FROM test WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE test SET `part_id`=?, `desc`=?, `due_date`=?, `note`=? WHERE id=?",
      [req.body.pid || curVals.part_id, req.body.desc || curVals.desc, req.body.ddate || curVals.due_date, req.body.note || curVals.note, req.body.id],
      function(err, result){
      if(err){
        next(err);
        return;
      }
      context.test = "Updated " + result.changedRows + " rows.";
      res.render('home', context);
      });
    }
  });
});

//issue
//part_issue = many to many
app.post('/editPartIssue', function(req,res,next){
  var context = {};

  mysql.pool.query('INSERT INTO part_issue (part_id, issue_id) VALUES (?, ?)',
    [req.body.p_id, req.body.i_id]);

    context.part = "Updated " + req.body.p_id + " : " + req.body.i_id;
    res.render('home', context);

});

app.post('/editIssue', function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT `desc`, `priority`, `status` FROM issue WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE issue SET `desc`=?, `priority`=?, `status`=? WHERE id=?",
      [req.body.desc || curVals.desc, req.body.prty|| curVals.priority, req.body.status || curVals.status, req.body.id],
      function(err, result){
      if(err){
        next(err);
        return;
      }
      context.issue = "Updated " + result.changedRows + " rows.";
      res.render('home', context);
      });
    }
  });
});


//~~~~~~~~~~~~~
//complex queries
//~~~~~~~~~~~~~
//cq1: find Owners and part info with critical path parts sorted by due date
app.post('/cq1',function(req,res){
  var context = {};

  console.log("cq1");
  mysql.pool.query
  ("SELECT o.last_name, o.first_name, p.desc, p.due_date FROM owner o INNER JOIN part_owner po ON o.id = po.owner_id INNER JOIN part p ON po.part_id = p.id WHERE p.critical_path = 'y' ORDER BY p.due_date",
  function(err, rows, fields){

    if (err) {
      console.log(err);
      return;
    }
  context.cq1 = "Results: " + JSON.stringify(rows) ;
  res.render('home', context)
  });
});

//cq2: find owners with no parts
app.post('/cq2',function(req,res){
  var context = {};
  var queryString = "SELECT id, last_name, first_name FROM owner WHERE id NOT IN((SELECT id FROM owner o INNER JOIN part_owner po ON o.id = po.owner_id))"
  console.log("cq2");
  mysql.pool.query
  (queryString, function(err, rows, fields){

    if (err) {
      console.log(err);
      return;
    }
  context.cq2 = "Results: " + JSON.stringify(rows) ;
  res.render('home', context)
  });
});

//cq3: find parts and issues, sort by due date then priority
app.post('/cq3',function(req,res){
  var context = {};
  var queryString = "SELECT p.id, p.desc, p.due_date, i.desc, i.priority FROM part p INNER JOIN part_issue p_i ON p.id = p_i.part_id INNER JOIN issue i ON p_i.issue_id = i.id ORDER BY p.due_date, i.priority "
  console.log("cq3");
  mysql.pool.query
  (queryString, function(err, rows, fields){

    if (err) {
      console.log(err);
      return;
    }
  context.cq3 = "Results: " + JSON.stringify(rows) ;
  res.render('home', context)
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
