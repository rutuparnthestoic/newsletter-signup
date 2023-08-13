const express = require("express"); //Adding express
const bp = require("body-parser"); //Adding body parser
const request = require("request"); //Adding request module
const https = require("https"); //Adding https native module
require("dotenv").config();


const app = express(); 

app.use(bp.urlencoded({extended: true}));
app.use(express.static("public")); //Using static method to send all static files.


app.get("/", function(req,res){ //Initial homepage load up.
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    const fName = req.body.firstName; 
    const lName = req.body.lastName; 
    const mail = req.body.email; 
    const apiKey = process.env.API_KEY;
    const listKey = process.env.LIST_KEY;
    const X = process.env.X;
    const url = "https://us" + X +".api.mailchimp.com/3.0/lists/" + listKey; 
    const options = { 
        method: "POST",  
        auth: "rutu51:" + apiKey 
    }

    const data = { 
        members: [
            {
                email_address: mail,
                status: "subscribed", 
                merge_fields: { 
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); 

    const request = https.request(url, options, function(response){ 
        var resCode = response.statusCode; 
        if(resCode == 200){
                res.sendFile(__dirname + "/success.html");
            }
        else{
                    res.sendFile(__dirname + "/failure.html");
            }
    }
    ) 
    request.write(jsonData); //sending json data to api.
    request.end(); //ending the request.
});

app.post("/failure", function(req,res){ //if fails, user can click on try again which redirects them to homepage.
    res.sendFile(__dirname + "/signup.html");
});

   






app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on 3000");
});

