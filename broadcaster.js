var request = require('request');
var twitter = require('ntwitter');

var mongojs = require("mongojs"); // Added mongojs 
var connection_string = '127.0.0.1:27017/myapp';
var db = mongojs(connection_string, ['myapp']);
var tw_sentitems = db.collection("tw_sentitems");
var tw_list = db.collection("tw_list");
var username = "che2on";
var fullname = "Chethan Thimmappa";

     // define("CONSUMER_KEY", "50yGByPjNIl2TiMt0bQbCur6q");
     // define("CONSUMER_SECRET", "LNGPPulXEeRqkzkM9PlE14Mj1RbWUg6jN3lQBBzEMxijbfhvm7");
     // define("OAUTH_TOKEN", "15975725-YM19niB4CqLzoJqwwq5Aw3c4rrtEdSj7egF5uVTDh");
     // define("OAUTH_SECRET", "14myWOpEzYCbckvGqwZT7hMyAIgrHEspNRfYNP0gxd92j");

var minutes = 7, the_interval = minutes * 60 * 1000;
setInterval(function() {

	    tw_list.find().limit(1).sort({postedOn : -1} , function(err , success){



	  
        if(success)
        {

        		username = success[0].username;
        		fullname = success[0].fullname;
        	     var myArray =  [

	   			"@"+username+" Hi "+fullname+", Would you be interested in trying @WorldCupSync app on your phone? Displays all Worldcup match schedules. ",
	   			"@"+username+" Hi... Do you have a windows phone?",
	   			"@"+username+" Hello "+fullname+"... I just wanted to check if you can try @WorldCupSync on your phone...",
	   			"@"+username+" "+fullname+", We have developed an app for windows called as @WorldCupSync . Can you give it a try? ",
	   			"@"+username+" "+fullname+", Hi... Who do you think would be the winner of ICC cricket world cup?",
	   			"@"+username+" Hi Would you mind trying our exlusive cricket app @WorldCupSync on your phone? ",
	   			"@"+username+" Hi :-) I am the developer of @WorldCupSync app... Would you like to try  the app on your phone please? ",
	            "@"+username+" Do you mind rating our app @WorldCupSync , a windows phone app for Worldcup cricket schedule? ",
	            "@"+username+" How are you "+fullname+ " !"	            

	   		 ];

	   		var newArray = shuffle(myArray);
	   		var status = newArray[0];
	   		var twsentobject = {};
			twsentobject.username = username;
			twsentobject.fullname = fullname;
			twsentobject.text =     status;
			twsentobject.postedOn = new Date();
 
			
        	var twit = new twitter({
            consumer_key: "50yGByPjNIl2TiMt0bQbCur6q",
            consumer_secret: "LNGPPulXEeRqkzkM9PlE14Mj1RbWUg6jN3lQBBzEMxijbfhvm7",
            access_token_key: "15975725-YM19niB4CqLzoJqwwq5Aw3c4rrtEdSj7egF5uVTDh",
            access_token_secret: "14myWOpEzYCbckvGqwZT7hMyAIgrHEspNRfYNP0gxd92j"
        	});

        	twit.updateStatus(status,
            function (err, data) {
            	if(data)
            	{
            		console.log(data);
            	
            		tw_list.remove( { username: success[0].username }, function(err, s) { if(s) console.log("Sent"); });
          			tw_sentitems.save(twsentobject, function(err , s3) { if(s3) console.log("added to sent items")});

                
                }
            }
    	    );



           
        }
        else
        {


           
        }
 
   	  });


	  

	  

// Run code

}, the_interval);


function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};