var express = require('express');
var app = express();
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var bodyParser = require('body-parser');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//create mail
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'sebastian.a.frost@gmail.com', // my mail
        pass: 'basti1234'
    }
}));

//dbs create
var mongo = require('mongoose');


mongo.connect('mongodb://localhost/todo');
var Schema = new mongo.Schema({
    title :  {
                type: String,
                required : true
            },
    date : {
                type: String,
                required : true
            },
    progress : {
                type: String,
                required : true
            },
    content : {
    	type: String,
    	required: true
    		},
    milestone : [{
    	title: String,
    	value :Number,
    	checked : String	

    }],
    maxValue: {
                type: Number,
                required : true
            }

});



var Todo = mongo.model('todo', Schema);
var todo, id;


//gets all todos
app.get('/', function(req,res){
	Todo.find({}, function(err,docs){
        if(err) {
        	
     		res.json(err);

        } else {
          	res.json(docs);

        }


    })
	
});


//gets all todos
app.get('/index', function(req,res){
	Todo.find({}, function(err,docs){
        if(err) {
        	
     		res.json(err);

        } else {
          	res.json(docs);

        }


    })
	
});

//deletes one todo
app.delete('/todo/:id', function(req,res){
    Todo.remove({_id : req.params.id}, function(err,data){
        if(err) {
        	
            res.json(err);
        } else {
            res.json(data);
            
        }


    })
});

//creates one todo
app.post('/create', function(req,res){

    todo = new Todo({
        title : req.body.title,
        date: req.body.date,
        content: req.body.content,
        progress: 0,
        milestone: req.body.milestone,
        maxValue: req.body.maxValue

    });        

    todo.save( function(err, data){
        if(err){
        	
            res.json(err);

        } else {
            res.json(data);
           	console.log(todo.milestone);

           }
        })
        

});


//get one special todo
app.get('/edit/:id', function(req,res){
    
    id = req.params.id;
    Todo.findOne({_id : id}, function(err, data){
        if (err){
            res.json(err);
        } else {
            res.json(data);
        }


    })


});


//update an todo
app.put('/edit/:id', function(req,res){
   	
    id = req.body.id;

    todo = ({
        title : req.body.title,
        date: req.body.date,
        content: req.body.content,
        milestone: req.body.milestone,
        progress: req.body.progress

    });

    Todo.findOneAndUpdate({_id : id},todo,{upsert : true}, function(err, data){
        if(err){
            res.json(err);
            
        } else {
            res.json(data);
       
        }

    })

})


//send Mail
app.post('/impressum', function(req, res){


var mailOptions = {
    from: '"Anforderungswünsche" <frosty4321@gmx.de>', // sender address
    to: req.body.email, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.text	, // plaintext body
    
};

	console.log(mailOptions);
	transporter.sendMail(mailOptions, function(err, res){
		if(err) {
			console.log(err);
				
		} else {
			
			console.log(res);

		}

	});

});



app.listen(8080);
console.log('Server started');