const ws = new WebSocket("ws://localhost:6502"); // added

const el=document.getElementById("hudCanvas");
const ctx = el.getContext('2d');

ctx.canvas.height = 600;
ctx.canvas.width = 400;

ws.onopen = () => {
    console.log("Websocket is established"); // added
}

//added
ws.onmessage = (event) => {

    const data = JSON.parse(event.data);
    // [altimeter, radioAltimeter, airspeed, groundspeed, pitch, roll, heading, latitude, longitude, temperature] [0-9]
    // [status-1, rpm-1, fuel-flow-1, egt-1, aft burner-1, status-2, rpm-2, fuel flow-2, egt-2, aft burner-2] 10-18
    // [currDist, bearing, tBearing, dAlongRoute] [20-24]
    // [nextDist, bearing, tBearing, dAlongRoute] [25-29]
    // waypoint object [30]
    drawHud(data);
}

// drawHud([]);

function drawHud(data=[]){
    ctx.clearRect(0, 0, 400, 500); // Clears the screen

    // console.log(data);

    if(data.length){
        drawAircraftSymbol();
        drawRadAltBox(Number(data[1]));
        drawHdgBox(Number(data[6]));
        drawAltBox(Number(data[0]));
        drawIasBox(Number(data[2]));
        // drawAltitudeLadder(Number(data[0]));
        drawAltitudeLadder();
        drawAirspeedLadder(Number(data[2]));
        drawPitchLadder(Number(data[4]));
        drawBankAngle(Number(data[5]));
        drawNavInfoBox();
        drawWpnInfoBox();
        drawMNoInfoBox();
        drawOatInfoBox();
    }
}


function drawAircraftSymbol(){
    w = 400, h = 500, r = 10;

    ctx.beginPath();
    ctx.arc(w/2,h/2,r,0,Math.PI*2);
    ctx.strokeStyle="yellowgreen";
    ctx.stroke(); 

    ctx.beginPath();
    ctx.moveTo(w/2+r,h/2);
    ctx.lineTo(w/2+r+15,h/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w/2-r,h/2);
    ctx.lineTo(w/2-r-15,h/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w/2,h/2-r);
    ctx.lineTo(w/2,h/2-r-10);
    ctx.stroke();

    drawUC();   

}


function drawRadAltBox(){

    w = 400+40, h = 500;
    ctx.beginPath();
    ctx.rect(w-100,h/2+80,50,20);
    ctx.fillStyle = 'yellowgreen'        
    //ctx.stroke();

    ctx.beginPath();
    ctx.font = "15px Arial";
    ctx.fillText("R", w-100-15, h/2+100);

    ctx.beginPath();
    ctx.font = "13px Arial";
    ctx.fillText("8888", w-100+5, h/2+100);

}

function drawHdgBox(heading = 0){

    const tapeW = 400; 
    const tapeH = 500;
    const numberOfMarkings = 100;

    ctx.fillStyle = 'yellowgreen';
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    
    ctx.beginPath();
    ctx.rect(tapeW/2-30, tapeH/2+207, 60, 25);        
    ctx.closePath();

    ctx.stroke();

    ctx.fillText(Math.round(heading), tapeW/2, tapeH/2+220);

    ctx.beginPath();
    ctx.moveTo(tapeW/2-100, tapeH/2+220-25);
    ctx.lineTo(tapeW/2+100, tapeH/2+220-25);
    ctx.closePath();
    
    ctx.stroke();

    for (let i=0; i<=numberOfMarkings; i++){

        const xPos = ((tapeW / 2) + numberOfMarkings) - (i * 2);
        const value = ((heading + 50 - i) % 360) / 10;
        
        if(value < 0){
            value = 36 + value; // makes negative angles into positive
        }

        if(value % 3 === 0)
        {
            ctx.beginPath();
            ctx.moveTo(xPos, tapeH/2+220-25);
            ctx.lineTo(xPos, tapeH/2+220-35);
            ctx.closePath();

            ctx.stroke();

            ctx.font = "10px Arial";
            ctx.textBaseline = "top";   
            ctx.fillText(Math.round(value * 10), xPos - 10, tapeH/2+220-25);

        }

        ctx.textAlign = "start";
    }

}


function drawAltBox(){

    w = 400+40, h = 500;
    ctx.beginPath();
    ctx.rect(w/2+110+5,h/2-40,50,20);
    ctx.fillStyle = 'yellowgreen'        
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w/2+110+5,h/2-40);
    ctx.lineTo(w/2+110-10,h/2-30);
    ctx.lineTo(w/2+110+5,h/2-20);
    ctx.stroke();

    ctx.beginPath();
    ctx.font = "15px Arial";
    ctx.fillText("B", w/2+110+60,h/2-20);

}

function drawIasBox(){

    w = 400-40, h = 500;
    ctx.beginPath();
    ctx.rect(w/2-110,h/2-40,-40,20);
    ctx.fillStyle = 'yellowgreen'        
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w/2-110,h/2-40);
    ctx.lineTo(w/2-110+10,h/2-40+10);
    ctx.lineTo(w/2-110,h/2-40+20);
    ctx.stroke();

    /*ctx.beginPath();
    ctx.font = "15px Arial";
    ctx.fillText("650", w/2-140, h/2-25);*/

}

function drawAltitudeLadder(altitude = 0){

    // console.log(altitude);
    const tapeW = 400+20; 
    const tapeH = 500;
    const numberOfMarkings = 200;
    
    ctx.beginPath();
    ctx.moveTo(tapeW-100, tapeH/2 - 130);
    ctx.lineTo(tapeW-100, tapeH/2 + 70);
    ctx.closePath();
    ctx.stroke();

   //for loop to draw ticks to the ladder
   for (let i=0; i<=numberOfMarkings; i++){ 
        
        const yPos = ((tapeH/2 + 70) - i);
        const value = (altitude - 100 + i) / 10;
        
        ctx.font = "15px Arial";
        ctx.textBaseline = "middle";
        
        if(value % 5 === 0){
            ctx.fillText(value * 10, tapeW-80, yPos);

            ctx.beginPath();
            ctx.moveTo(tapeW-100, yPos);
            ctx.lineTo(tapeW-100+15, yPos);
            ctx.closePath();
            
            ctx.stroke();
        }

        else if(value % 2.5 === 0){
            
            ctx.beginPath();
            ctx.moveTo(tapeW-100, yPos);
            ctx.lineTo(tapeW-100+5, yPos);
            ctx.closePath();

            ctx.stroke();
        } 
   }

}

function drawAirspeedLadder(airspeed = 250){

    const tapeW = 400-20; 
    const tapeH = 500;
    const numberOfMarkings = 200;

    ctx.beginPath();
    ctx.moveTo(tapeW-300, tapeH/2-130);
    ctx.lineTo(tapeW-300, tapeH/2+70);
    ctx.stroke();
    
    for (let i=0; i<=numberOfMarkings; i++){ 
        
        const yPos = (tapeH/2 + 70) - i;
        const value = (airspeed - 100 + i) / 10;

        ctx.font = "15px Arial";
        ctx.textBaseline = "middle";
       
        if(value % 5 === 0){
            ctx.beginPath();
            ctx.moveTo(tapeW-300, yPos);
            ctx.fillText(value * 10, tapeW-300-42, yPos);
            ctx.lineTo(tapeW-300-15, yPos);
            ctx.closePath();

            ctx.stroke();
        }
        else if(value % 2.5 === 0){
            ctx.beginPath();
            ctx.moveTo(tapeW-300, yPos);
            ctx.lineTo(tapeW-300-5, yPos);
            ctx.closePath();

            ctx.stroke();  
        }
   }
}

function drawPitchLadder(pitch = 5){

    const tapeW = 400;
    const tapeH = 500;
    const numberOfMarkings = 20;
    
    for (let i=0; i<=numberOfMarkings; i++){
        
        const yPos = (tapeH / 2 + 150) - (i * 15);
        const value = pitch - 10 + i;

        if(value % 5 === 0){
            ctx.beginPath();
            ctx.moveTo(tapeW/2-30, yPos);
            ctx.lineTo(tapeW/2-30-55, yPos);
            ctx.stroke();

            ctx.textAlign = "right";
            ctx.fillText(value, tapeW/2-90, yPos);
            

            ctx.beginPath();
            ctx.moveTo(tapeW/2+30, yPos);
            ctx.lineTo(tapeW/2+30+55, yPos);
            ctx.stroke();

            ctx.textAlign = "left";
            ctx.fillText(value, tapeW/2+90, yPos);

            ctx.textAlign = "start"; // Changes the ctx font alignment to default
            
        }
    }
}

function drawBankAngle(){
    let w=400, h=500;

    ctx.beginPath();
    ctx.arc(w/2,h/2-50,175,Math.PI*1.25,Math.PI*1.75);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w/2, h/2-225);
    ctx.lineTo(w/2-10, h/2-225+20);
    ctx.lineTo(w/2+10, h/2-225+20);
    ctx.lineTo(w/2, h/2-225);
    ctx.stroke();
}

function drawNavInfoBox(){
    w = 400, h = 500;
    ctx.beginPath();
    ctx.rect(w/2+125, h/2+125,60,100);
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillText("Nav Info",w/2+130, h/2+135);
}

function drawWpnInfoBox(){
    w = 400, h = 500;
    ctx.beginPath();
    ctx.rect(w/2-125, h/2+125,-60,100);
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillText("Wpn Info",w/2-180, h/2+135);
}

function drawMNoInfoBox(){
    w = 400, h = 500;
    ctx.beginPath();
    ctx.rect(w/2-135, h/2-175,-50,30);
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillText("M No:",w/2-180, h/2-165);
    ctx.font = "10px Arial";
    ctx.fillText("g:",w/2-180, h/2-155);
}

function drawOatInfoBox(){
    w = 400, h = 500;
    ctx.beginPath();
    ctx.rect(w/2+135, h/2-175,50,30);
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillText("OAT:",w/2+180-40, h/2-165);
    ctx.font = "10px Arial";
    ctx.fillText("nx:",w/2+180-40, h/2-155);
}

function drawUC(){
    ctx.beginPath();
    ctx.moveTo(w/2-20,h/2);
    ctx.lineTo(w/2-20,h/2+5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w/2+20,h/2);
    ctx.lineTo(w/2+20,h/2+5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w/2,h/2+10);
    ctx.lineTo(w/2,h/2+15);
    ctx.stroke();

}

