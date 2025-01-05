// Built-in Libraries
const path = require("path");
const dgram = require("dgram");
const fs = require("fs");

// External Libraries
const express = require("express");
const cors = require("cors");
const {xml2json} = require('xml-js');
const WebSocket = require('ws'); // TCP connection 

// For auto open of websites
const {exec} = require("child_process");


require("dotenv").config();

const WAYPOINTFILEPATH = process.env.FILEPATH || "C://Users//User//AppData//Roaming//flightgear.org//Export//"
const PORT = process.env.PORT || 3300;
const url = `http://localhost:${PORT}`;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


const server = dgram.createSocket("udp4"); // UDP server setup
const wss = new WebSocket.Server({port: 6502}); //  WebSocket Server --> Follows TCP

let appIsOpen = false // To know whether the app is open or not

// Read File
function readFile(){
    var xml = fs.readFileSync(path.join(WAYPOINTFILEPATH, "waypoints.xml"), {encoding: 'utf-8'});

    const jsonData = xml2json(xml);

    return JSON.parse(jsonData);
}

// ******************** Websocket Function ***********************
// Broadcast the message to the clients
function broadcastToClients(message){
    wss.clients.forEach(function(client) {
        if(client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(message));
        }
    })
}
// Connection to the websocket of FRONTEND
wss.on("connection", function(ws){
    ws.on("error", function(err){
        console.error("Websocket Error:", err);
    });
    // Check whether the app is open or closed
    ws.on('message', function(message){
        // console.log("Message from Client:", message.toString());
        if(message.toString() === "appIsOpen"){
            appIsOpen = true;
        }
    })
});

// ****************** UDP Connection ******************
// This portion is the node server connecting with the FlightGear
server.on("listening", function(){
    const address = server.address;
    

});

server.on("message", function(message, remote){
    // Process the incoming data (message) from FlightGear here
    const data = message.toString().split(",");
    
    const json = readFile(); // Way Point reading
    const dataToApeend = json.elements[0].elements[6].elements.map(element => {
        
            if(element){
            return {
                id: element.elements[1].elements[0].text,
                lon: parseFloat(element.elements[2].elements[0].text), 
                lat: parseFloat(element.elements[3].elements[0].text)
            };
        }
    });

    data.push(dataToApeend);
    broadcastToClients(data);
});

server.bind(5500);

// ***** WebSocket *****
// getting data from the frontend websocket....

/*

wss.on("connection", function(ws){
    console.log("A new client is connected");
    ws.on("message", function(message){
        //  Used only when client wants to send anything
        console.log("Message from Client:", message); 
    });
});

*/

app.get("/", function(req, res){
    res.sendFile('index.html');
});

app.listen(PORT, function(){
    // console.log(`Listening to: http://localhost:${PORT}`);
    console.log(appIsOpen);
    if(appIsOpen){
        console.log(`Listening to: ${url}`);
        console.log(`App already open...`);
    }

    else{
        console.log(`Listening to: ${url}`);
        console.log(`Opening the app...`);
        openApp();
    }
});

// Opens a new tab with the app
function openApp(){
    const start = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    exec(`${start} ${url}`);
}