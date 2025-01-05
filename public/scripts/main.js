import GeneratePFD from "./pfd.js";
import GenerateMap from "./map.js";
import GenerateSys from "./sys.js";
import GenerateHUD from "./hud.js";

const container = document.querySelector(".canvas_container");

const buttonsLeft = [...document.querySelectorAll(".button_containers.left .btn-box button")];
const buttonsRight = [...document.querySelectorAll(".button_containers.right .btn-box button")];
const btnBox = [...document.querySelectorAll(".button_containers .btn-box")];


const initialState = {
    page: "pfd",
    zoomLevel: 1,
    data: [] 
    // [altimeter, radioAltimeter, latitude, longitude, airspeed, mach, groundspeed, verticalSpeed, pilot-g, pitch, roll, heading, alpha, temperature] [0-13]
    // [status, n1, n2, rpm, fuel-flow, oil-pressure, egt, aft burner] [14-21]
    // [bingo-fuel, gear] [22 - 23]
    // [amp, charge, volts, intF, leftF, rightF] [24-29]
    // [id, currDist, bearing, tBearing, dAlongRoute] [30-34]
    // [id, nextDist, bearing, tBearing, dAlongRoute] [35-39]
    // waypoint object [40]
}


const stateManager = {
    state: {...initialState},
    getState(){
        return this.state;
    },
    render(){
        switch(this.state.page){
            case "pfd":
                createPFDCanvas(this.state.data);
                break;
            case "map":
                createMapCanvas(this.state.data);
                break;
            case "sys":
                createSystemPage(this.state.data);
                break;
            case "hud":
                createHUDPage(this.state.data);
                break;
            default:
                break;
        }
    },
    setState(newState){
        this.state = {...this.state, ...newState};
        // this.render(); 
        
        /* 
            This used to cause some extra computation when zoom level 
            was changed. Since it is already being rendered on the onmessage
            function below
        */
                         
    }
}


function log(value="No Input"){
    console.log(value);
}

function clearContainer(){
    container.innerHTML = "";
}

function resetButtonBox(){
    btnBox.forEach((btn, idx) => {
        if(idx > 4){
            btn.children[0].innerText = `B${idx + 1}`;
        }
    });
}

// ********************** PAGE CREATIONS **********************

function createPFDCanvas(fgData=[]){
    clearContainer();
    resetButtonBox();
    
    if(!fgData.length){
        log("No data");
        return;
    }
    
    // Canvas Creation
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "main_screen");
    container.appendChild(newCanvas);
    const canvas = document.querySelector("#main_screen");
    const ctx = canvas.getContext("2d");

    
    // canvas.width = Math.min(container.clientWidth, container.clientHeight);
    // canvas.height = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const pfd = new GeneratePFD(canvas, ctx, {
        currentAltitude: Math.round(Number(fgData[0])), 
        currentRadioAltitude: Math.round(Number(fgData[1])), 
        latitude: Number(fgData[2]), 
        longitude: Number(fgData[3]),
        currentAirSpeed: Math.ceil(Number(fgData[4])), 
        mach: Number(fgData[5]).toFixed(2),
        currentGroundSpeed: Math.ceil(Number(fgData[6])),
        verticalSpeed: Math.ceil(Number(fgData[7])),
        pilotG: Number(fgData[8]),
        pitch: Number(fgData[9]), 
        roll: Number(fgData[10]),
        heading: Number(fgData[11]),
        alpha: Number(fgData[12]),
        currentAirTemperature: Number(fgData[13])
    });
    // requestAnimationFrame(pfd.drawPFD);
    pfd.drawPFD();
}

function createMapCanvas(fgData=[]){
    clearContainer(); 
    resetButtonBox();

    if(!fgData.length){
        log("No data");
        return;
    }
    
    // Canvas Creation
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "main_screen");
    container.appendChild(newCanvas);
    const canvas = document.querySelector("#main_screen");
    const ctx = canvas.getContext("2d");

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    btnBox[5].children[0].innerText = "Z+";
    btnBox[6].children[0].innerText = "Z-";

    const z =  stateManager.getState().zoomLevel;

    // Zoom In button
    buttonsRight[0].addEventListener('click', function(e){
        e.preventDefault();
        if(z < 4){
            stateManager.setState({zoomLevel: z * 2});
        }
    });

    // Zoom Out Button
    buttonsRight[1].addEventListener('click', function(e){
        e.preventDefault();
        if(z > 1){
            stateManager.setState({zoomLevel: z / 2});
        }
    });

    const map = new GenerateMap(canvas, ctx, {
        currentAltitude: Number(fgData[0]),
        latitude: Number(fgData[2]),
        longitude: Number(fgData[3]),
        currentAirSpeed: Number(fgData[4]),
        currentGroundSpeed : Number(fgData[6]),
        heading: Number(fgData[11]),
        currentWP: fgData.slice(30, 35),
        nextWP: fgData.slice(35, 40),
        waypoints: fgData[40]
    }, stateManager.getState().zoomLevel);

    map.drawMap();
}

function createSystemPage(fgData=[]){
    clearContainer();
    resetButtonBox();

    if(!fgData.length){
        return;
    }
    
    // Canvas Creation
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "main_screen");
    container.appendChild(newCanvas);
    const canvas = document.querySelector("#main_screen");
    const ctx = canvas.getContext("2d");

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const sys = new GenerateSys(canvas, ctx, {
        stat: Math.round(Number(fgData[14])),
        n1: Math.round(Number(fgData[15])),
        n2: Math.round(Number(fgData[16])),
        rpm: Math.round(Number(fgData[17])),
        ff: Math.round(Number(fgData[18])),
        op: Math.round(Number(fgData[19])),
        egt: Math.round(Number(fgData[20])),
        ab: Math.round(Number(fgData[21])),
        bf: Math.round(Number(fgData[22])),
        amp: Math.round(Number(fgData[24])),
        chg: Math.round(Number(fgData[25])),
        volts: Math.round(Number(fgData[26])),
        inf: Math.round(Number(fgData[27])),
        lf: Math.round(Number(fgData[28])),
        rf: Math.round(Number(fgData[29])),
    });
    sys.drawPage();
}

function createHUDPage(fgData=[]){
    clearContainer();
    resetButtonBox();

    if(!fgData.length){
        return;
    }
    
    // Canvas Creation
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute("id", "main_screen");
    container.appendChild(newCanvas);
    const canvas = document.querySelector("#main_screen");
    const ctx = canvas.getContext("2d");

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const hud = new GenerateHUD(canvas, ctx, {
        alt: Math.round(Number(fgData[0])),
        rAlt: Math.round(Number(fgData[1])),
        lat: Math.round(Number(fgData[2])),
        lon: Math.round(Number(fgData[3])),
        asi: Math.round(Number(fgData[4])),
        mach: Number(fgData[5]).toFixed(2),
        gs: Math.round(Number(fgData[6])),
        vsi: Math.round(Number(fgData[7])),
        g: Number(fgData[8]).toFixed(2),
        pitch: Number(fgData[9]),
        roll: Number(fgData[10]),
        hdg: Number(fgData[11]),
        alpha: Math.round(Number(fgData[12])),
        temp: Math.round(Number(fgData[13])),
        uc: Math.round(Number(fgData[23]))
    });
    hud.drawPage();
}

function removeActive(){
    btnBox.forEach(box => {
        box.classList.remove("active");
    });
}

const ws = new WebSocket("ws://localhost:6502"); // Connect to the backend socket port

ws.onopen = () => {
    console.log("WebSocket connection established");
    ws.send('appIsOpen'); 
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    stateManager.setState({data: data});
    stateManager.render();
}

socket.onclose = () => { 
    console.log('WebSocket connection closed.'); 
    location.reload(); // Reload the page when the connection is closed 
};

buttonsLeft.forEach((button, idx) => {
    button.addEventListener("click", event => {
        removeActive();

        button.parentNode.classList.add("active");
        switch(button.parentNode.classList[1]){
            case "pfd":
                stateManager.setState({page: 'pfd'});
                break;
            case "map":
                stateManager.setState({page: 'map'});
                break;
            case "sys":
                stateManager.setState({page: 'sys'});
                break;
            case "hud":
                stateManager.setState({page: 'hud'});
                break;
            default:
                break;
        }
    });
});


//  When the tab closes, send a message to the server
window.onbeforeunload = () => { 
    ws.send('appIsClosed'); 
};