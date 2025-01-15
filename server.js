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

const WAYPOINTFILEPATH = process.env.FILEPATH || "C://Users//inann//AppData//Roaming//flightgear.org//Export//"
const { 
    WS_PORT, 
    UDP_PORT, 
    PORT 
} = process.env || { WS_PORT: 6502, UDP_PORT: 5500, PORT: 3300 };

const url = `http://localhost:${PORT}`;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


const server = dgram.createSocket("udp4"); // UDP server setup
const wss = new WebSocket.Server({port: WS_PORT}); //  WebSocket Server --> Follows TCP

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
    ws.on('message', message => { 
        var filePath = JSON.parse(message.toString()).path; 

        const drive = filePath.charAt(0);
        const relativePath = filePath.substring(3);

        console.log(`Received message: ${drive} ${relativePath}`);

        const commands = [
            "--generic=socket,out,10,localhost,5500,udp,my_out",
            "--aircraft=mirage2000"
        ]

        const batchContent = `${drive}: && cd ${relativePath} && fgfs.exe ${commands.join(" ")}`;

        // Define the path for the batch file 
        const batchFilePath = path.join(__dirname, '/bat/open_flightgear.bat');

        // Write the batch file 
        fs.writeFile(batchFilePath, batchContent, err => { 
            if (err) 
            { 
                console.error(`Error writing batch file: ${err}`); 
                return; 
            } 
            console.log(`Batch file created at: ${batchFilePath}`); 

            // Execute the batch file 
            exec(`start ${batchFilePath}`, (err, stdout, stderr) => { 
                if (err) { console.error(`Error executing batch file: ${err}`); 
                    return; 
                } 
                console.log(`stdout: ${stdout}`); 
                console.error(`stderr: ${stderr}`); 
            }); 
        });
    });
});

// ****************** UDP Connection ******************
// This portion is the node server connecting with the FlightGear
server.on("listening", function(){
    const { address, port } = server.address();
    console.log(`Server is listening at: ${address}:${port}`);
});

server.on("message", function(message, remote){
    // Process the incoming data (message) from FlightGear here
    const data = message.toString().split(",");    
    if(!data){
        console.log("No message received");
        return;
    }

    
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

server.bind(UDP_PORT, "localhost");

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
    openApp();
});

// Opens a new tab with the app
function openApp(){
    const start = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    exec(`${start} ${url}`);
}