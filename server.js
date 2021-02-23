const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const router = express.Router();
const port = 8099;
const { WebhookClient } = require("dialogflow-fulfillment");
const diff = require("dialogflow-fulfillment");
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { name } = require('ejs');
const sessionId = uuid.v4();

app.use(express.static(__dirname + '/views'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// A unique identifier for the given session


app.use(bodyParser.urlencoded({
	extended:false
}));

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
});

app.get('/', (req,res) => {
	res.status(200).render('index');
});

app.post('/send-msg', (req, res) => {
	runSample(req.body.MSG).then(data=>{
		res.send({Reply:data});
	});
});



async function runSample(msg, projectId = 'careweare-rgmd') {
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
	  credentials: {
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGYpdy+FXU0EMM\nz5qGEpRUCMgUiZHXeyQ+Ew/CfAwaKNMia8rcPFZv0IeEMQBYwUu6HMb0XtFmEmid\nry3EZnaaVuZ0nlOMG+Qekp9FNdlPh0+c9tCIj1geGdpkb7JrVXUpUIkjfNIJxp/r\nDPizYHs7mY4D94jtW7qgzjOxvhxpth12e77+LYC+vuMyNpZQ5qBbf7zWYd3hebr0\nu9XxD5itx8H0Xk3/Rb3SeyfFptSIbbFZwIAhy1tZfvJ/1kYYMr4M8Fz/48tF1ZuB\nfjQy7Ybc3HQi7NQwzkMCf9J3PkboCmgUVWXZuQFfQLXvhxar63D8iRAUi+e4lWIm\nG8i+r9xPAgMBAAECggEACT39mpcUKepxPTm3aV3t4sOtTTui0Obv53kW3QjPaDE/\ns3+nFJSLswDZggs7CLzUl307Yutp66Hu6sMG/vqGYFFXwitqxAERTb/8mIpWLzzO\ntNwmFz6VAdioJ9FbqWFyqF6T96nF1TvCJn6qYBzzZhw/aqg6YlMe14VTu4jvpO2z\nOSCzh0x3GJ9oSwywXNZbXAH6Lza/HI4l33+Glv5kjCeRSrTYjOs+0tQUo/F61A1C\ncUpHZbPTXDONhKL0rn/L7xuLG0APyI8zulIGqnOL3ho10T/7GfooeVyq4tLraEV1\nUsaFXqHkYd5/PRhlFp9z7ephqwWlcGTDPN5qSShu0QKBgQDixmWG0ChbsfEuHy7o\nOA2v3LJwuqxoPipbdJ1b6HWbrScM8vFJgXwZkGSgdngK86MzK2HL7/AEl0zmimt1\n2Lhk6XYgC8GJ6OGrnSAOP8OBhTWThwBzeTZILgK3eZ/OKct9/P8YnWVRulkjrdT6\nBlL48WKZfeyD5zIFj3wmXYAFvwKBgQDf85OHvKiypZnh+mwbzyQiT+AFZRhUiOsV\naLhbcRAVd8sN8dUpklVaWr9GJNf/IQvaNqNmre6lgMKKDJptEwM/pJ5J2wHmwYBG\nA/FmPBfz9aRI6yXo2M2slbP9nexuKZFUFSRmfSIIg7J5ERS+MPlysDg7W7iv5/RA\nvXIwpgVtcQKBgBAyjYPgkFFkV06tCYOqpUefYttsae4UKqBXpvmuk9/nsTdajuNq\nLTwCNT3E2HQnzMtV2OlhHOqnB+Ybkuta7GjAyCAn1s4L5TqFwYljAorYwefkp6KX\n0Mm9B5KlTEXEdHVuQaY3b8oznjRPMTwegYSocRt3hBIzzD3bbsmquf8vAoGASZJh\nkyQdX6MbrKtyPKiOPF91PxB5L7xTTpM6jX/VQtg58vjRiHi0ZZyOXeLYus4GcMem\nYqMdVW25e1SsnsyyMoRIJAc41rAXDelZsrZnQBQgxnvJ1nbzCpGbsePhukcZoT/Y\n13qgZZ+uUCuWXu0D5fOSZZ26TL+s9F/IVccU3WECgYA+LjeQyGYC7LIh05QDYKGx\njucM+MOp90C9ZHhMe2U09rjWmuoSOb3kjSURMrmJSFxLfmQAy6jwzAHrB8S4vI+9\ny3JthKjCeo/xIXRXhFvKOD8Ak29FP5WOWhphzuojQPIT0zfNlTB9A57QVkfJPtvg\nr3DRK1NgUVpaiSNH/bRmbw==\n-----END PRIVATE KEY-----\n',
      client_email: 'administrator@careweare-rgmd.iam.gserviceaccount.com'
    }
  });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

 
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
     
        text: msg,
  
        languageCode: 'en-US',
      },
    },
  };

  
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText;
}


app.post("/", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", defaultFallback);
  intentMap.set("choice.findJob", findJob);
  intentMap.set("choice.cert",cert)
  agent.handleRequest(intentMap);
});

  
 function findJob(agent){
  agent.add("no job here");
}

 async function cert(agent) {
 
  const result = await callPython();
 
  agent.add(result["name"]+"<br>"+result["association"]+"<br>"+result["requiredExam"]+"<br>"+result["url"])
   
  
 }
 function welcome(agent) {
  var payloadData={
    "richContent": [
      [
        {
          "type": "chips",
          "options": [
            {
              "text": "Cert"
            },
            {
              "text": "Job"
            },
            {
              "text": "Position"
            },
            {
              "text": "Career Planning"
            }
          ]
        }
      ]
    ]
  }
  agent.add('What you are searching? (Certification, find jobs, position details)');
  //agent.add(new diff.Payload(platform.UNSPECIFIED,payloadData,{sendAsmessage:true,rawPayload:true}));
}


app.get('/runPython', (req, res) => {	
	const { spawn } = require("child_process");
	const pythonProcess = spawn('python', ['test.py']);
	pythonProcess.stdout.on('data', (data)=>{
  		mystr = data.toString();
    	myjson = JSON.parse(mystr);
    	console.log(`JSON is : ${mystr}`);
	});
});
function callPython() {
  return new Promise(function(success, reject) {
    const { spawn } = require("child_process");
    const pythonProcess = spawn('python', ['test.py']);
      let result = "";
      let resultError = "";
      pythonProcess.stdout.on('data', function(data) {
          result += data.toString();
        
      });

      pythonProcess.stdout.on("end", function(){
          if(resultError == "") {
              success(JSON.parse(result));
          }else{
              console.error(`Python error, you can reproduce the error with: \n`);
              const error = new Error(resultError);
              console.error(error);
              reject(resultError);
          }
      })
 });
}
module.exports.callPython = callPython;

function defaultFallback(agent) {
  agent.add('Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me.');
}
module.exports = { welcome: welcome, defaultFallback: defaultFallback, findJob: findJob,cert:cert};



app.listen(process.env.PORT || 8099, ()=>{
	console.log('Running on port '+port);
})


















