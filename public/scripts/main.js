import GeneratePFD from "./pfd.js";
import GenerateSys from "./sys.js";
import GenerateMap from "./map.js";

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
    // [bingo-fuel] [22]
    // [amp, charge, volts, intF, leftF, rightF] [23-28]
    // [id, currDist, bearing, tBearing, dAlongRoute] [29-33]
    // [id, nextDist, bearing, tBearing, dAlongRoute] [34-38]
    // waypoint object [39]
}


const stateManager = {
    state: {...initialState},
    getState(){
        return {...this.state};
    },
    render(data=this.state.data){
        switch(this.state.page){
            case "pfd":
                createPFDCanvas(data);
                break;
            case "map":
                createMapCanvas(data);
                break;
            case "sys":
                createSystemPage(data);
                break;
            case "hud":
                createSystemPage(data);
                break;
            default:
                break;
        }
    },
    setState(newState){
        this.state = {...this.state, ...newState};
        this.render(this.state.data);
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
        currentAltitude: Math.ceil(Number(fgData[0])), 
        currentRadioAltitude: Math.round(Number(fgData[1])), 
        latitude: Number(fgData[2]), 
        longitude: Number(fgData[3]),
        currentAirSpeed: Math.ceil(Number(fgData[4])), 
        mach: Math.ceil(Number(fgData[5])),
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
        currentWP: fgData.slice(29, 34),
        nextWP: fgData.slice(34, 39),
        waypoints: fgData[39]
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
        amp: Math.round(Number(fgData[23])),
        chg: Math.round(Number(fgData[24])),
        volts: Math.round(Number(fgData[25])),
        inf: Math.round(Number(fgData[26])),
        lf: Math.round(Number(fgData[27])),
        rf: Math.round(Number(fgData[28])),
    });
    sys.drawPage();
}

function removeActive(){
    btnBox.forEach(box => {
        box.classList.remove("active");
    });
}

const ws = new WebSocket("ws://localhost:6502"); // Connect to the backend socket port

ws.onopen = () => {
    console.log("WebSocket connection established");
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    stateManager.setState({data: data});
}

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