/*
 * GET home page.
 */
var twitter = require('ntwitter');
var io = require('socket.io').listen(3001, {log: false});
var mongojs = require("mongojs"); // Added mongojs 
var connection_string = '127.0.0.1:27017/myapp';
var db = mongojs(connection_string, ['myapp']);
var tw_sentitems = db.collection("tw_sentitems");
var tw_list = db.collection("tw_list");


exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
    if (req.session.oauth) {
        var twit = new twitter({
            consumer_key: "HSh7v8VgkeJsZjktrbDtXYi1h",
            consumer_secret: "pIVim2fLU6C9RSTKRXdQMTAo3REBgTLJGO8z1Wh8hKOJDVVFCq",
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
        });


        twit
            .verifyCredentials(function (err, data) {
                console.log(err, data);
            })
            .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
            function (err, data) {
                console.log(data);
            }
        );


        twit.stream(
            'statuses/filter',
            {track: ['MS Dhoni', 'Shikhar Dhawan',  'Rohit Sharma', 'Ajinkya Rahane',  'Robin Uthappa', 'Suresh Raina', 'Ambati Rayudu', 'Kedar Jadhav', 'Manoj Tiwary', 'Manish Pandey' ,
             'Virat Kohli', 'Wriddhiman Saha', 'Sanju Samson','R Ashwin', 'Parveez Rasool', 'Karn Sharma', 'Ravindra Jadeja','Axar Patel', 'Ishant Sharma', 'Bhuvneshwar Kumar', 'Mohammed Shami',
              'Umesh Yadav', 'Varun Aaron', 'Dhawal Kulkarni', 'Stuart Binny', 'Mohit Sharma', 'Ashok Dinda', 'Kuldeep Yadav', 'M Vijay', 'Cricket World Cup, cricket worldcup',
               'Sachin Tendulkar,sachin,tendulkar', 'yuvraj singh' , 'harbhajan singh', 'rahul dravid', 'australia cricket', 'india cricket','srilanka cricket', 'pakistan cricket',

                'Michael Clarke', 'George Bailey', 'Pat Cummins', 'Xavier Doherty',
                'James Faulkner', 'Aaron Finch', 'Brad Haddin', 'Josh Hazlewood', 'Mitchell Johnson', 'Mitchell Marsh', 'Glenn Maxwell', 'Steve smith', 'Mitchell Starc', 'David Warner', 'Shane Watson',


                'Eoin Morgan', 'Moeen Ali', 'James Anderson', 'Gary Ballance', 'Ian Bell', 'Ravi Bopara', 'Stuart Broad', 'Jos Buttler', 'Steven Finn', 'Alex Hales', 
                'Chris Jordan', 'Joe Root', 'James Taylor', 'James Tredwell', 'Chris Woakes',

                 'AB de Villiers', 'Hashim Amla', 'Kyle Abbott', 'Farhaan Behardien', 'Quinton de Kock', 'JP Duminy', 'Faf du Plessis', 'Imran Tahir', 
                 'David Miller', 'Morne Morkel', 'Wayne Parnell', 'Aaron Phangiso', 'Vernon Philander', 'Rilee Rossouw', 'Dale Steyn',

                 'Angelo Mathews', 'Tillakaratne Dilshan', 'Kumar Sangakkara', 'Mahela Jayawardene', 'Lahiru Thirimanne', 'Dinesh Chandimal', 'Dimuth Karunaratne', 
                 'Jeevan Mendis', 'Thisara Perera', 'Suranga Lakmal', 'Lasith Malinga', 'Dhammika Prasad', 'Nuwan Kulasekara', 'Rangana Herath','Sachithra Senanayak',

                 'india' , 'cricket', 'batting', 'wicket keeping', 'highest score, batsman', 'toss, cricket', 'world record, cricket', 'bowling, cricket'. 't20 cricket'

               ] },
          // {track: ['gaadikey']},
            function (stream) {
                stream.on('data', function (data) {
                    //console.log(data);
                    console.log(data.user.screen_name );
                    console.log(data.source);
                    if(data.source.indexOf("Twitter for Windows Phone") > -1 )
					{
							 io.sockets.emit('newTwitt', data);							 
							// Write the logic to store these tweets here
							 tw_sentitems.findOne({username:data.user.screen_name} , function ( err, s1 )
							 {
								if(s1)
								{
								
									// If the screen_name is already found in  the sentitems. stop doing anything 
								
								}
								
								else
								{
								
									tw_list.findOne({username:data.user.screen_name} , function ( err, s2 )
									{							
										if(s2)
										{
										
											//if the screen_name is already found in the current list. stop doing anything 
										
										}
										else
										{
										
											// Insert the username, full name details here!
											
												var twobject = {};
												twobject.username = data.user.screen_name;
												twobject.fullname = data.user.name;
											    twobject.postedOn = new Date();
 
  
												tw_list.save(twobject, function(err , s3)
												{
     
														if(s3)
														{
															console.log("Success adding entry to tw_list");
														
														}																																																				
												});																		
										}							
								    });														
							   }					                   
                  
						  });
                     }
               });
		}
		
		);
		
		}
						
};


