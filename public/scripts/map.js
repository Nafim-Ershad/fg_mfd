import { COLORS, toRadian, toLatitude, toLongitude } from "./utilities.js";

class GenerateMap
{
    constructor(canvas, ctx, data, zoom = 10)
    {
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentValues = {...data};
        this.zoomLevel = zoom;
        this.zoom = 5 * zoom;

        // console.log(this.currentValues);

        // this.canvas.height = 734; // Set explicitely to make the canvas taller

        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radialRad = 400; // Radius of the radial

        this.drawMap = this.drawMap.bind(this);
    }

    drawMap()
    {
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawCenterAircraft();

        this.drawHeadingRadial(this.currentValues.heading);
        
        this.drawWayPoints(this.currentValues.latitude, this.currentValues.longitude, this.currentValues.waypoints, this.currentValues.heading);

        this.drawZoomArcs(this.zoom);

        
        // this.displayOtherParams(lat=this.currentValues.latitude, lon=this.currentValues.longitude);
        this.displayOtherParams({...this.currentValues});
        
        // Show Heading
        this.ctx.font = "18px Ariel";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${Math.trunc(this.currentValues.heading)}\u00b0`, this.centerX, 130);

        // Top Red Triangle
        this.ctx.fillStyle = "#FF0000";
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 160);
        this.ctx.lineTo(this.centerX + 10, 140);
        this.ctx.lineTo(this.centerX - 10, 140);
        this.ctx.closePath();

        this.ctx.fill();

    }

    drawCenterAircraft(){
        
        // changing coolor too look transparent
        this.ctx.strokeStyle = "grey";
        this.ctx.lineWidth = 3;

        // vertical dotted line
        this.ctx.beginPath();
        this.ctx.setLineDash([7, 14]);
        this.ctx.moveTo(this.centerX, this.ctx.canvas.height - 134);
        this.ctx.lineTo(this.centerX, 160);
        this.ctx.closePath();

        this.ctx.stroke();

        // horizontal dotted line
        this.ctx.beginPath();
        this.ctx.setLineDash([7, 14]);
        this.ctx.moveTo(0, this.ctx.canvas.height - 174);
        this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.height - 174);
        this.ctx.closePath();
        
        this.ctx.stroke();

        // upper horizontal dotted line
        this.ctx.beginPath();
        this.ctx.setLineDash([7, 14]);
        this.ctx.moveTo(0, 100);
        this.ctx.lineTo(this.ctx.canvas.width, 100);
        this.ctx.closePath();
        
        this.ctx.stroke();

        this.ctx.setLineDash([]);

        // Aircraft Center Position
        this.ctx.strokeStyle = "#FFFFFF";

        // Vertical Line (body) of aircraft
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.ctx.canvas.height - 174);
        this.ctx.lineTo(this.centerX, this.ctx.canvas.height - 134);
        this.ctx.closePath();

        this.ctx.stroke();

        //  horizontal (wing) line of aircraft
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 15, this.ctx.canvas.height - 134 - 20);
        this.ctx.lineTo(this.centerX - 15, this.ctx.canvas.height - 134 - 20);
        this.ctx.closePath();

        this.ctx.stroke();

        // horizontal (tail) line of aircraft
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 5, this.ctx.canvas.height - 134 - 5);
        this.ctx.lineTo(this.centerX - 5, this.ctx.canvas.height - 134 -5);
        this.ctx.closePath();

        this.ctx.stroke();
        
    }

    drawZoomArcs(zoom){

        this.ctx.strokeStyle = COLORS.secondary;
        this.ctx.fillStyle = COLORS.secondary;
        this.ctx.font = "16px Ariel";
        this.ctx.textAlign = "start";

        this.ctx.save();

        // Translate the context to (500, 560)
        this.ctx.translate(this.centerX, 560);

        // make lines dotted
        this.ctx.setLineDash([7, 2]);
        this.ctx.strokeStyle = COLORS.primary;

        // Draw semi-circles
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 100, Math.PI, 0); // Smaller first semi-circle

        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 200, Math.PI, 0); // second semi-circle
        
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, 300, Math.PI, 0); // Third semi-circle
        
        this.ctx.stroke();

        switch(zoom){

            case 20:
                this.ctx.fillText(`5NM`, 5, -110, 100);
                this.ctx.fillText(`10NM`, 5, -210, 100);
                this.ctx.fillText(`20NM`, 5, -310, 100);
                break;

            case 10:
                this.ctx.fillText(`10NM`, 5, -110, 100);
                this.ctx.fillText(`20NM`, 5, -210, 100);
                this.ctx.fillText(`40NM`, 5, -310, 100);
                break;

            case 5:
                this.ctx.fillText(`20NM`, 5, -110, 100);
                this.ctx.fillText(`40NM`, 5, -210, 100);
                this.ctx.fillText(`80NM`, 5, -310, 100);
                break;

            default:
                break;
        }
        this.ctx.restore();

    }

    drawHeadingRadial(heading = 0){
    
        // Radial
        this.ctx.save();

        // this.ctx.translate(0, this.canvas.height);
        this.ctx.translate(0, 560);

        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, 0, this.radialRad, 0, 2*Math.PI);
        this.ctx.closePath();

        this.ctx.stroke();


        for(let i = 0; i < 360; i++){
            const head = toRadian(i - heading  - 90); // Just Works!!!
            
            const x1 = this.centerX + (this.radialRad * Math.cos(head));
            const y1 = 0 + (this.radialRad * Math.sin(head));

            if(i % 30 === 0){
                const x2 = this.centerX + ((this.radialRad - 20) * Math.cos(head));
                const y2 = 0 + ((this.radialRad - 20) * Math.sin(head));

                this.ctx.font = "18px ariel";
                this.ctx.textAlign = "center";
                this.ctx.fillText(i, x2, y2 + 20);

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();

                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    drawWayPoints(latitude, longitude, waypoints, heading){
        /* console.log(waypoints, latitude, longitude); */

        this.ctx.save(); // Save the context

        // Create a clip rectangle
        this.ctx.beginPath();
        this.ctx.rect(0, 160, 500, 440);
        this.ctx.closePath();

        this.ctx.clip();

        // Move the Context 
        this.ctx.translate(this.centerX, this.ctx.canvas.height - 174);
        this.ctx.rotate(toRadian(-heading)); // Rotate the context

        // Set colors for the waypoints
        this.ctx.fillStyle = COLORS.PERSIANPINK;
        this.ctx.strokeStyle = COLORS.BRIGHTPINK;
        this.ctx.lineWidth = 3;
        
        var started = false; // A pointer to save the coordinate of the point in array
        var [fromX, fromY] = [];

        // draw the waypoints
        waypoints.forEach(waypoint => {
            // Calculating the position of waypoints      
            const xPos = ((waypoint.lon - longitude) * 60 * this.zoom);
            const yPos = ((latitude - waypoint.lat) * 60 * this.zoom);

            if(!started){
                fromX = xPos;
                fromY = yPos;

                started = true;
            }
            else{
                this.ctx.beginPath();
                this.ctx.moveTo(fromX, fromY);
                this.ctx.lineTo(xPos, yPos);
                this.ctx.closePath();

                this.ctx.stroke();

                fromX = xPos;
                fromY = yPos;
            }

            this.ctx.beginPath();
            this.ctx.arc(xPos, yPos, 10, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
               
            this.ctx.font = `16px ariel`;
            this.ctx.fillText(`${waypoint.id}`, xPos+10, yPos);
        
        });

        this.ctx.restore();
    }

    displayOtherParams(params){
        
        /* This displays other types of data such as airspeed, altitudes etc */
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 3;

        this.ctx.fillStyle = COLORS.secondary;
        this.ctx.font = "14px Ariel";
        this.ctx.textAlign = "start";
    
        // Show lat long
        this.ctx.fillText(`GS: ${params.currentGroundSpeed} kts`, this.canvas.width - 100, 25);
        this.ctx.fillText(`ALT: ${params.currentAltitude} ft`, this.canvas.width - 100, 45);
        this.ctx.fillText(`AS: ${params.currentAirSpeed} kts`, this.canvas.width - 100, 70);


        this.ctx.fillStyle = COLORS.primary;
        this.ctx.font = "14px Ariel";
    
        // Show lat long
        this.ctx.fillText(`Lat: ${toLatitude(params.latitude)}`, 10, 25);
        this.ctx.fillText(`Lon: ${toLongitude(params.longitude)}`, 10, 45);

        // Current Waypoint Info
        this.ctx.fillStyle = COLORS.secondary;
        this.ctx.font = "14px Ariel";

        this.ctx.fillText(`Waypoint ID: ${this.currentValues.currentWP[0]}`, 10, this.canvas.height - 80);
        this.ctx.fillText(`Distance: ${this.currentValues.currentWP[1]} NM`, 10, this.canvas.height - 64);
        this.ctx.fillText(`Bearing: ${this.currentValues.currentWP[2]}\u00b0`, 10, this.canvas.height - 48);
        this.ctx.fillText(`True Bearing: ${this.currentValues.currentWP[3]}\u00b0`, 10, this.canvas.height - 32);
        this.ctx.fillText(`Distance Along Rt: ${this.currentValues.currentWP[4]} NM`, 10, this.canvas.height - 16);

        // Next Waypoint
        this.ctx.fillStyle = "grey";
        this.ctx.font = "14px Ariel";

        this.ctx.fillText(`Waypoint ID: ${this.currentValues.nextWP[0]}`, this.canvas.width - 175, this.canvas.height - 80);
        this.ctx.fillText(`Distance: ${this.currentValues.nextWP[1]} NM`, this.canvas.width - 175, this.canvas.height - 64);
        this.ctx.fillText(`Bearing: ${this.currentValues.nextWP[2]}\u00b0`, this.canvas.width - 175, this.canvas.height - 48);
        this.ctx.fillText(`True Bearing: ${this.currentValues.nextWP[3]}\u00b0`, this.canvas.width - 175, this.canvas.height - 32);
        this.ctx.fillText(`Distance Along Rt: ${this.currentValues.nextWP[4]} NM`, this.canvas.width - 175, this.canvas.height - 16);

        // Show Zoom Level
        this.ctx.fillStyle = COLORS.JUNGLEGREEN;
        this.ctx.font = "22px Ariel";

        this.ctx.fillText(`${this.zoomLevel}x`, 450, 150);
    }

}

export default GenerateMap;