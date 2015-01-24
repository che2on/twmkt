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
            {track: ['india', 'cricket', 'worldcup', 'World cup', 'sachin' , 'kohli', 'dhoni', 'australia'] },
          //  {track: ['gaadikey']},
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


