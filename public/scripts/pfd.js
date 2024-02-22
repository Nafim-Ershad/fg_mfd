import { toRadian, 
    toDecimalPlaces, 
    COLORS,
    toLatitude,
    toLongitude} from "./utilities.js";


class GeneratePFD{
    constructor(canvas, ctx, values){
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentValues = values;
        
        // General Tape measurements
        this.numberOfMarkings = 40;
        this.tapeWidth = 70;
        this.tapeHeight = 400;
        this.halfHeight = this.tapeHeight / 2;
        this.markerSpacing = this.tapeHeight/this.numberOfMarkings;
        
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;

        // Canvas Height = 734, width = 500
            // ASI Starting Co-ordinate
        this.asiX = 25;
        this.asiY = 167;
            // ALT Starting Co-ordinate
        this.altX = 405;
        this.altY = 167;
            // Attitude Starting Co-ordinate
        this.attX = 120;
        this.attY = 207;


        // Bindings
        this.drawPFD = this.drawPFD.bind(this);
    }

    drawPFD(){

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


        // Draw different parts of PFD
        this.drawArtificialHorizon(this.currentValues.pitch, this.currentValues.roll);
        this.drawAlitudeIndicator(this.currentValues.currentAltitude);
        this.drawAirspeedIndicator(this.currentValues.currentAirSpeed);
        this.drawHeadingIndicator(this.currentValues.heading);
        this.drawOtherParameters({
            temp: this.currentValues.currentAirTemperature,
            radAlt: this.currentValues.currentRadioAltitude,
            lat: this.currentValues.latitude,
            lon: this.currentValues.longitude,
            gs: this.currentValues.currentGroundSpeed,
            vsi: this.currentValues.verticalSpeed,
            mach: this.currentValues.mach,
            aoa: this.currentValues.alpha,
            g: this.currentValues.pilotG
        });

    }

    // drawAlitudeIndicator(currentAltitude)
    drawAirspeedIndicator(currentAirSpeed)
    {
        //  Draw the altimeter tape

        // starting co-ordinates;
        const x = this.asiX;
        const y = this.asiY;

        // Draw tape container
        this.ctx.fillStyle = "#FFF";
        this.ctx.strokeStyle = "#FFF";
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = "start";

        this.ctx.font = "18px Ariel";
        this.ctx.fillText("ASI (kts)", x, y-5, 70);
        this.ctx.fill();

        this.ctx.strokeRect(x, y, this.tapeWidth, this.tapeHeight);
        this.ctx.stroke();


        for(let i=0; i<this.numberOfMarkings; i++){
            const yPos = this.tapeHeight - (i * this.markerSpacing) + y; // Calculate Y position
            const value = Math.round(((currentAirSpeed - this.halfHeight) / this.markerSpacing) + i);
            
            // Draw the marker line
            if(value%10 === 0){   
                this.ctx.font = "14px Ariel";
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.fillText(value*10, x + 40, yPos+5, 30);
                this.ctx.beginPath();
                this.ctx.moveTo(x, yPos);
                this.ctx.lineTo(x + 35, yPos);
                this.ctx.stroke();
            }
            else if(value%5 === 0){
                this.ctx.beginPath();
                this.ctx.moveTo(x, yPos);
                this.ctx.lineTo(x + 20, yPos);
                this.ctx.stroke();
            }
            else{
                this.ctx.beginPath();
                this.ctx.moveTo(x, yPos);
                this.ctx.lineTo(x + 10, yPos);
                this.ctx.stroke();
            }
        }

        // Draw the current altitude indicator
        this.ctx.fillStyle = "#000000"; // Black the indicator
        this.ctx.fillRect(x+40, this.centerY - 15, 50, 30);
        this.ctx.strokeRect(x+40, this.centerY - 15, 50, 30);
        
        this.ctx.moveTo(x+40, this.centerY - 10);
        this.ctx.lineTo(x+30, this.centerY);
        this.ctx.lineTo(x+40, this.centerY + 10);

        this.ctx.font = "18px Ariel";
        this.ctx.fillStyle = "#FFFFFF";

        // Text indicating the current altitude
        this.ctx.fillText(currentAirSpeed, x + 45, this.centerY+5, 50);

        this.ctx.fill();
        this.ctx.stroke();
    }

    // drawAirspeedIndicator(currentAirSpeed)
    drawAlitudeIndicator(currentAltitude)
    {
        // Starting Co-ordinates
        const x = this.altX;
        const y = this.altY; 

        // Draw tape container
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = "#FFFFFF"; // White
        this.ctx.strokeStyle = "#FFF";
        this.ctx.textAlign = "start";

        this.ctx.font = "18px Ariel";
        this.ctx.fillText("ALT (ft)", x, y-5, 70);
        this.ctx.fill();

        this.ctx.strokeRect(x, y, this.tapeWidth, this.tapeHeight);
        this.ctx.stroke();

        for(let i=0; i<this.numberOfMarkings; i++){

            const yPos = this.tapeHeight - (i * this.markerSpacing) + y; // Calculate Y position 
            const value = Math.round(((currentAltitude - this.halfHeight) / this.markerSpacing) + i);

            // Draw the marker line
            this.ctx.strokeStyle = "#FFFFFF";
            if(value%10 === 0){    
                this.ctx.font = "14px Ariel";
                this.ctx.fillText(value*10, x + 5, yPos+5, 30);
                this.ctx.beginPath();
                this.ctx.beginPath();
                this.ctx.moveTo(x + 70, yPos);
                this.ctx.lineTo(x + 35, yPos);
                this.ctx.stroke();
           }
           else if(value%5 === 0){
               this.ctx.beginPath();
               this.ctx.moveTo(x + 70, yPos);
               this.ctx.lineTo(x + 50, yPos);
               this.ctx.stroke();
           }
        //    else{
        //        this.ctx.beginPath();
        //        this.ctx.moveTo(x + 70, yPos);
        //        this.ctx.lineTo(x + 60, yPos);
        //        this.ctx.stroke();
        //    }
        }

        // Draw the current altitude indicator
        this.ctx.fillStyle = "#000000"; // Green for the indicator
        this.ctx.strokeStyle = "#FFFFFF"; // Green for the indicator

        this.ctx.fillRect(x - 20, this.centerY - 15, 50, 30);
        this.ctx.strokeRect(x - 20, this.centerY - 15, 50, 30);

        this.ctx.moveTo(x + 30, this.centerY - 10);
        this.ctx.lineTo(x + 40, this.centerY);
        this.ctx.lineTo(x + 30, this.centerY + 10);
        
        this.ctx.font = "18px Ariel";
        this.ctx.fillStyle = "#FFFFFF";
        // Text indicating the current airspeed
        this.ctx.fillText(currentAltitude, x - 10, this.centerY+5, 50);
        
        this.ctx.fill();
        this.ctx.stroke();
   }

//    ********************Artificial Horizon********************
    drawRotatingBox(x, y, xPos = 0, yPos = 0, width, height, angle, xOffset = 0, yOffset = 0, flip = false) {
        this.ctx.save();
        
        this.ctx.translate(x, y);
        this.ctx.scale(flip ? -1 : 1, 1); // Flips the ctx horizontally
        this.ctx.rotate(toRadian(flip ? -angle : angle));

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(xPos+xOffset, yPos+yOffset, width, height); // Starts from the width of the translated ctx
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawArtificialHorizon(pitch, roll){
        const x = this.attX;
        const y = this.attY; 

        const pAngle = toRadian(pitch); // Convert pitch to rardians
        const rAngle = toRadian(roll); // Convert roll to radians
        const radius = 100; // Radius of curved edges

        this.ctx.save();
        this.ctx.strokeStyle =  "white";
        
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, 260, 320, radius);
        this.ctx.closePath();

        this.ctx.clip(); 
        // Clips the shape. Its a permanent state change, so ctx.save() and ctx.restore() is used
        // Clipping reference link: https://www.w3schools.com/jsref/canvas_clip.asp

        const yPos = this.centerY + (160 * Math.sin(pAngle));

        const yPosR = yPos - (160 * Math.sin(rAngle));
        const yPosL = yPos + (160 * Math.sin(rAngle));

        this.ctx.fillStyle = "#0a74da"; // Light blue
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 260, y);
        this.ctx.lineTo(x + 260, yPosR);
        this.ctx.lineTo(x, yPosL);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draws the ground reference background
        this.ctx.fillStyle = "#5b3d15"; // Brown
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + 320);
        this.ctx.lineTo(x + 260, y + 320);
        this.ctx.lineTo(x + 260, yPosR);
        this.ctx.lineTo(x, yPosL);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
        
        // Draw the dynamic horizon lines
        this.ctx.save();

        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(-rAngle);

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#FFFFFF";

        const height = 200;
        const p = toDecimalPlaces(pitch, 1);

        for(let i = 0; i < height; i++){
            const yPos = height - i - (height / 2);
            const value = toDecimalPlaces(p + (i * 0.1) - 10, 1);

            this.ctx.font = "14px Ariel"; 
            /* 
                ctx.setLineDash() is also another permanent state changer. 
                To revert back to solid lines, the parameter is set to empty array 
            */
            if(value >= 0 && value < 90)
            {   
                this.ctx.setLineDash([]);
                if(value % 10 === 0){
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(-70, yPos);
                    this.ctx.lineTo(70, yPos);
                    this.ctx.closePath();

                    this.ctx.fillText(value, 75, yPos + 7);
                    this.ctx.fillText(value, -90, yPos + 7);

                    this.ctx.stroke();
                }
                else if(value % 5 === 0){
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(-45, yPos);
                    this.ctx.lineTo(45, yPos);
                    this.ctx.closePath();

                    this.ctx.fillText(value, 50, yPos + 7);
                    this.ctx.fillText(value, -65, yPos + 7);

                    this.ctx.stroke(); 
                }
            }
            else if(value < 0 && value > -90)
            {   
                
                this.ctx.setLineDash([2, 7]);
                if(value % 10 === 0)
                {
                    this.ctx.beginPath();
                    this.ctx.moveTo(-70, yPos);
                    this.ctx.lineTo(70, yPos);
                    this.ctx.closePath();
                    
                    this.ctx.fillText(Math.abs(value), 75, yPos + 7);
                    this.ctx.fillText(Math.abs(value), -90, yPos + 7);

                    this.ctx.stroke();
                }
                else if(value % 5 === 0)
                {
                    this.ctx.beginPath();
                    // this.ctx.setLineDash([2, 7]);
                    this.ctx.moveTo(-45, yPos);
                    this.ctx.lineTo(45, yPos);
                    this.ctx.closePath();
                    this.ctx.fillText(Math.abs(value), 50, yPos + 7);
                    this.ctx.fillText(Math.abs(value), -65, yPos + 7);

                    this.ctx.stroke(); 
                }
            }
        }

        this.ctx.restore();

        // Static Horizontal Lines --> Aircraft
        this.ctx.fillStyle = "#000000";
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 3;
            // Center Dot 
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 5, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
            // Center body
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 15, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.stroke();
            // Left Line
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 15, this.centerY);
        this.ctx.lineTo(this.centerX - 45, this.centerY);
        this.ctx.closePath();

        this.ctx.stroke();
            // Right Line
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 15, this.centerY);
        this.ctx.lineTo(this.centerX + 45, this.centerY);
        this.ctx.closePath();

        this.ctx.stroke();

            // Tail Line
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - 15);
        this.ctx.lineTo(this.centerX, this.centerY - 30);
        this.ctx.closePath();

        this.ctx.stroke();

        // because of a bug, I moved the point to (0, 0) position
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.closePath();

        
        this.drawRotateAngle(roll);

   }

    drawRotateAngle(rollAngle){

        const roll = toRadian(rollAngle);
        
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "white";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";

        // Draw the fixed angles
        for(let i = 0; i <= 18; i++){

            const theta = (i/18) * Math.PI;

            switch(i){
                case 0:
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + (120 * Math.cos(theta)), this.centerY);
                    this.ctx.lineTo(this.centerX + (140 * Math.cos(theta)), this.centerY);
                    this.ctx.closePath();
                    
                    this.ctx.stroke();
                    break;
                
                case 3:
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + (145 * Math.cos(theta)), this.centerY - (130 * Math.sin(theta)));
                    this.ctx.lineTo(this.centerX + (155 * Math.cos(theta)), this.centerY - (140 * Math.sin(theta)));
                    this.ctx.closePath();

                    this.ctx.fillText("60\u00b0", this.centerX + (165 * Math.cos(theta)), this.centerY - (140 * Math.sin(theta)));
                    this.ctx.fill();

                    this.ctx.stroke();
                    break;

                case 6:
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + (165 * Math.cos(theta)), this.centerY - (155 * Math.sin(theta)));
                    this.ctx.lineTo(this.centerX + (175 * Math.cos(theta)), this.centerY - (165 * Math.sin(theta)));
                    this.ctx.closePath();

                    this.ctx.fillText("30\u00b0", this.centerX + (180 * Math.cos(theta)), this.centerY - (170 * Math.sin(theta)));
                    this.ctx.fill();

                    this.ctx.stroke();
                    break;

                case 9: // The verticle line at the top
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + (130 * Math.cos(theta)), this.centerY - (150 * Math.sin(theta)));
                    this.ctx.lineTo(this.centerX + (140 * Math.cos(theta)), this.centerY - (160 * Math.sin(theta)));
                    this.ctx.closePath();

                    this.ctx.fillText("0\u00b0", this.centerX + (140 * Math.cos(theta)), this.centerY - (165 * Math.sin(theta)));
                    this.ctx.fill();

                    this.ctx.stroke();
                    break;
                
                case 12:
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + (165 * Math.cos(theta)), this.centerY - (155 * Math.sin(theta)));
                    this.ctx.lineTo(this.centerX + (175 * Math.cos(theta)), this.centerY - (165 * Math.sin(theta)));
                    this.ctx.closePath();
                    
                    this.ctx.fillText("30\u00b0", this.centerX + (180 * Math.cos(theta)), this.centerY - (170 * Math.sin(theta)));
                    this.ctx.fill();

                    this.ctx.stroke();
                    break;

                case 15:
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + (145 * Math.cos(theta)), this.centerY - (130 * Math.sin(theta)));
                    this.ctx.lineTo(this.centerX + (155 * Math.cos(theta)), this.centerY - (140 * Math.sin(theta)));
                    this.ctx.closePath();
                    
                    this.ctx.fillText("60\u00b0", this.centerX + (160 * Math.cos(theta)), this.centerY - (145 * Math.sin(theta)));
                    this.ctx.fill();

                    this.ctx.stroke();
                    break;

                case 18: 
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + (120 * Math.cos(theta)), this.centerY);
                    this.ctx.lineTo(this.centerX + (140 * Math.cos(theta)), this.centerY);
                    this.ctx.closePath();

                    this.ctx.stroke();
                    break;
                
                default:
                    break;
            }
        }

        this.ctx.fillStyle = "#FF0000";

        this.ctx.save();

        this.ctx.translate(this.centerX, this.centerY);
        if(roll )
        this.ctx.rotate(roll);

        this.ctx.beginPath();
        this.ctx.moveTo(0, -130);
        this.ctx.lineTo(-10, -110);
        this.ctx.lineTo(10, -110);
        this.ctx.closePath();

        this.ctx.fill();

        this.ctx.restore();

    }

    drawHeadingIndicator(heading = 0){
        let directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

        this.ctx.save(); // Saves the current state of the context

        this.ctx.translate(0, this.canvas.height - 100); // Translates the context 100px above from bottom

        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.centerY, 0, 2*Math.PI);
        this.ctx.closePath();

        // Heading Box
        this.ctx.moveTo(this.centerX + 35, -35);
        this.ctx.lineTo(this.centerX + 35, -10);
        this.ctx.lineTo(this.centerX + 15, -10);
        this.ctx.lineTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX - 15, -10);
        this.ctx.lineTo(this.centerX - 35, -10);
        this.ctx.lineTo(this.centerX - 35, -35);
        this.ctx.closePath();

        this.ctx.font = "18px Ariel";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${Math.round(heading)}\u00b0`, this.centerX, -15);

        this.ctx.stroke();

        this.ctx.lineWidth = 5;
        // Generate the point for compass heading
        for(let i = 0; i < 360; i += 10){
            // Dont know why works. Brute forced
            const angle = toRadian( i - heading - 90);
            
            // Since X and Y are different, Y is used
            const x1 = this.centerX + this.centerY * Math.cos(angle);
            const y1 = this.centerY + this.centerY * Math.sin(angle);
            
            const x2 = this.centerX + (this.centerY - 15) * Math.cos(angle);
            const y2 = this.centerY + (this.centerY - 15) * Math.sin(angle);

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.closePath();  
            
            if(i%45 === 0){
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.font = "32px white serif";
                this.ctx.fillText(`${directions[i/45]}`, x2 , y2 + 32);
            }
            else{
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.font = "16px white serif";
                this.ctx.fillText(`${i}`, x2, y2 + 16);
            }
            this.ctx.stroke();

        }

        this.ctx.restore(); // Restores the ctx as before
    }

    drawOtherParameters(value){

        const {temp, radAlt, lat, lon, gs, vsi, mach, aoa, g} = {...value};

        // Air Temperature
        switch(true){
            case temp < 20:
                this.ctx.fillStyle = COLORS.AZURE; 
                break;
            case temp > 25:
                this.ctx.fillStyle = COLORS.ARSENALRED;
                break;
            case temp > 35:
                this.ctx.fillStyle = COLORS.CANDYAPPLERED;
                break;
            default:
                this.ctx.fillStyle = COLORS.primary;
                break;
        }

        this.ctx.font = "25px Ariel bold";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${Math.round(temp)}\u00b0C`, 160, 177);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "start";

        // Latitude and Longitude
        this.ctx.font = "16px Ariel";
        this.ctx.fillText(`Lat: ${toLatitude(lat)}`, 0, 25);
        this.ctx.fillText(`Lon: ${toLongitude(lon)}`, 350, 25);

        // Parameters box
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.strokeRect(25, 70, 120, 70);
        this.ctx.closePath();

        this.ctx.stroke();

            // Values 
        this.ctx.textAlign = "start";

        this.ctx.fillText(`MACH: ${mach}`, 30, 90);
        this.ctx.fillText(`ALPHA: ${aoa}`, 30, 110);
        this.ctx.fillText(`G: ${g.toFixed(2)}g`, 30, 130);
        
        this.ctx.font = "18px Ariel";

        // Ground Speed and VSI
        this.ctx.fillText(`GS: ${gs} kts`, 25, 590);
        this.ctx.fillText(`VSI: ${vsi} fps`, 25, 615);

        // Radio Altitude - AGL
        this.ctx.fillText(`R${String(Math.round(radAlt)).padStart(5, '0')}`, 405, 590);

    }
}

export default GeneratePFD;