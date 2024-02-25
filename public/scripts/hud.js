import { COLORS, toDecimalPlaces, toRadian } from "./utilities.js";

class GenerateHUD{
    constructor(canvas, ctx, data){
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentValues = data;

        this.centerX = this.ctx.canvas.width / 2;
        this.centerY = this.ctx.canvas.height / 2;

        this.canvas.style.background = COLORS.DARKCYAN;

        this.drawPage = this.drawPage.bind(this);
    }

    drawPage(){

        this.drawAircraftSymbol();
        this.drawHeadingIndicator(this.currentValues.hdg);
        this.drawAltitudeLadder(this.currentValues.alt);
        this.drawAirspeedLadder(this.currentValues.asi);
        this.drawBankAngle(this.currentValues.roll);
        this.drawPitchLadder(
            {
                rollAngle: this.currentValues.roll,
                pitchAngle: this.currentValues.pitch
            }
        );
        this.drawUnderCarriage(this.currentValues.uc);
        this.drawOtherParams(this.currentValues);
        // this.drawRadAltBox();
    }

    drawAircraftSymbol(){
        const radius = 15;

        this.ctx.strokeStyle = "yellowgreen";
        
        // Aircraft body
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, radius, 0, 2 * Math.PI);
        this.ctx.stroke(); 

        // Rifhr Wing
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + radius, this.centerY);
        this.ctx.lineTo(this.centerX + radius + 25, this.centerY);
        this.ctx.stroke();

        // Left Wing
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - radius, this.centerY);
        this.ctx.lineTo(this.centerX - radius - 25, this.centerY);
        this.ctx.stroke();

        // Tail Rudder
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - radius);
        this.ctx.lineTo(this.centerX, this.centerY - radius - 20);
        this.ctx.stroke();
    }

    drawHeadingIndicator(heading = 0){

        const tapeW = 250; 
    
        this.ctx.fillStyle = COLORS.YELLOWGREEN;
        this.ctx.font = "18px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        
        // Draw the heading box
        this.ctx.beginPath();
        this.ctx.strokeRect(this.centerX - 30, this.centerY + 310, 60, 30);        
        this.ctx.closePath();
        
        // Write the heading angle in text
        this.ctx.fillText(Math.round(heading).toString().padStart(3, '0'), this.centerX, this.centerY + 325);
    
        // Draw the arrow
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY + 300);
        this.ctx.lineTo(this.centerX + 10, this.centerY + 310);
        this.ctx.lineTo(this.centerX - 10, this.centerY + 310);
        this.ctx.closePath();
        
        this.ctx.fill();
        
        // Draw the horizontal tape line
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - (tapeW / 2), this.centerY + 280);
        this.ctx.lineTo(this.centerX + (tapeW / 2), this.centerY + 280);
        this.ctx.closePath();
        
        this.ctx.stroke();

        for (let i = 0; i <= tapeW; i++){   
            // Since there will be 5 marks, each marking will be 40pixels
            // apart. That's why the loop increases by 40;
            
            const xPos = (this.centerX + (tapeW / 2)) - i;
            let value = toDecimalPlaces((heading + 10) - (i/10), 1);
            
            if(value < 0){
                value = 360 + value; // makes negative angles into positive
            }
            else{
                value %= 360;
            }

            if(value % 5 === 0)
            {
                this.ctx.beginPath();
                this.ctx.moveTo(xPos, this.centerY + 280);
                this.ctx.lineTo(xPos, this.centerY + 280 - 35);
                this.ctx.closePath();
    
                this.ctx.stroke();
    
                this.ctx.font = "10px Arial";
                this.ctx.textBaseline = "top";   
                this.ctx.textAlign = "center";
                this.ctx.fillText(`${Math.round(value).toString().padStart(3, '0')}`, xPos, this.centerY + 285);
    
            }
    
            this.ctx.textAlign = "start";
            this.ctx.textBaseline = "middle";
        }
    
    }

    drawAltitudeLadder(altitude = 0){

        const tapeH = 300;
        
        this.ctx.strokeStyle = COLORS.YELLOWGREEN; 
        this.ctx.fillStyle = COLORS.YELLOWGREEN;
        
        // Box Indicator
        this.ctx.beginPath();
        this.ctx.strokeRect(430, this.centerY - 10, 60, 20);
        this.ctx.closePath();

        // The arrow of the box
        this.ctx.beginPath();
        this.ctx.moveTo(420, this.centerY);
        this.ctx.lineTo(430, this.centerY - 10);
        this.ctx.lineTo(430, this.centerY + 10);
        this.ctx.closePath();

        this.ctx.stroke();

        // Draw the vertical line for the ladder
        this.ctx.beginPath();
        this.ctx.moveTo(420, this.centerY - (tapeH / 2));
        this.ctx.lineTo(420, this.centerY + (tapeH / 2));
        this.ctx.closePath();

        this.ctx.stroke();
    
       //for loop to draw ticks to the ladder
       for (let i=0; i <= tapeH; i++){ 
            
            const yPos = ((this.centerY + (tapeH/2)) - i);
            const value = (altitude - (tapeH/2) + i) / 10;
            
            this.ctx.font = "15px Arial";
            this.ctx.textBaseline = "middle";
            
            if(value % 5 === 0){
                this.ctx.fillText(value * 10, 440, yPos);
                
                // Markings
                this.ctx.beginPath();
                this.ctx.moveTo(420, yPos);
                this.ctx.lineTo(435, yPos);
                this.ctx.closePath();
                
                this.ctx.stroke();
            }
    
            else if(value % 2.5 === 0){
                
                this.ctx.beginPath();
                this.ctx.moveTo(420, yPos);
                this.ctx.lineTo(425, yPos);
                this.ctx.closePath();
    
                this.ctx.stroke();
            } 
       }
    
    }

    drawAirspeedLadder(airspeed = 250){
 
        const tapeH = 300;

        this.ctx.strokeStyle = COLORS.YELLOWGREEN;
        this.ctx.fillStyle = COLORS.YELLOWGREEN;
        
        // Box Indicator
        this.ctx.beginPath();
        this.ctx.strokeRect(10, this.centerY - 10, 60, 20);
        this.ctx.closePath();

        // The arrow of the box
        this.ctx.beginPath();
        this.ctx.moveTo(80, this.centerY);
        this.ctx.lineTo(80 - 10, this.centerY - 10);
        this.ctx.lineTo(80 - 10, this.centerY + 10);
        this.ctx.closePath();

        this.ctx.stroke();
        
        // Draw the vertical line for ladder
        this.ctx.beginPath();
        this.ctx.moveTo(80, this.centerY - (tapeH / 2));
        this.ctx.lineTo(80, this.centerY + (tapeH / 2));
        this.ctx.stroke();
        
        for (let i=0; i <= tapeH; i++){ 
            
            const yPos = (this.centerY + (tapeH / 2)) - i;
            const value = (airspeed - (tapeH / 2) + i) / 10;
    
            this.ctx.font = "15px Arial";
            this.ctx.textBaseline = "middle";
           
            if(value % 5 === 0){
                this.ctx.beginPath();
                this.ctx.moveTo(80, yPos);
                this.ctx.fillText(value * 10, 80 - 42, yPos);
                this.ctx.lineTo(80 - 15, yPos);
                this.ctx.closePath();
    
                this.ctx.stroke();
            }
            else if(value % 2.5 === 0){
                this.ctx.beginPath();
                this.ctx.moveTo(80, yPos);
                this.ctx.lineTo(80 - 5, yPos);
                this.ctx.closePath();
    
                this.ctx.stroke();  
            }
       }
    }

    drawBankAngle(rollAngle = 0){
        const roll = toRadian(rollAngle);

        this.ctx.strokeStyle = COLORS.YELLOWGREEN;

        // The Arc for bank angle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY - 120, 200, toRadian(225), toRadian(315));
        this.ctx.stroke();
        
        // Draw the markings and Text
        for(let i=225; i<=315; i+=15){
            // Converting the angles from degrees to radian for convenience
            const j = toRadian(i);

            const x1 = this.centerX + (190 * Math.cos(j));
            const y1 = this.centerY - 120 + (190 * Math.sin(j));
            
            const x2 = this.centerX + (200 * Math.cos(j));
            const y2 = this.centerY - 120 + (200 * Math.sin(j));

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.closePath();

            this.ctx.stroke();

            // Texts
            this.ctx.textAlign = "center";

            this.ctx.fillText(Math.abs(270 - i), x1, y1+10);
        }

        // Triangle indication for the roll angle
        this.ctx.save();

        this.ctx.translate(this.centerX, this.centerY - 120);

        if(rollAngle >= -45 && rollAngle <= 45){
            this.ctx.rotate(roll);
        }

        else if(rollAngle < -45){
            this.ctx.rotate(toRadian(-45)); 
        }

        else{
            this.ctx.rotate(toRadian(45)); 
        }


        this.ctx.beginPath();
        this.ctx.moveTo(0, -200);
        this.ctx.lineTo(-10, -220);
        this.ctx.lineTo(10, -220);
        this.ctx.closePath();

        this.ctx.fill();

        this.ctx.restore();

        // Showing the extra angle of roll
        if(rollAngle > 45){
            this.ctx.fillText(Math.round(rollAngle), 420, 130);
        }
        else if(rollAngle < -45){
            this.ctx.fillText(Math.round(-rollAngle), 80, 130);
        }
    }

    drawPitchLadder({pitchAngle, rollAngle}){
        const roll = toRadian(rollAngle);
        const pitch = toDecimalPlaces(pitchAngle, 1);

        const tapeH = 300;
        // Number of Markings are 5

        this.ctx.save();

        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(-roll);

        for (let i=0; i<=tapeH; i++){
            // 300/20 == 15
            // Every degree of change is 15px
            // taking a range of from -10 to +10 makes 21 points of degrees

            const yPos = (tapeH / 2) - i;
            const value = toDecimalPlaces((pitch - 10) + (i / 15), 1);

            if(value % 5 === 0){

                if(value >= 0 && value <= 90){

                    this.ctx.setLineDash([]); // No dashed lines
                    // Left Lines
                    this.ctx.beginPath();
                    this.ctx.moveTo(-30, yPos);
                    this.ctx.lineTo(-85, yPos);
                    this.ctx.closePath();

                    this.ctx.stroke();
                    
                    // Value on the left
                    this.ctx.textAlign = "right";
                    this.ctx.fillText(value, -90, yPos);
                    
                    // Right Lines
                    this.ctx.beginPath();
                    this.ctx.moveTo(30, yPos);
                    this.ctx.lineTo(85, yPos);
                    this.ctx.closePath();
                    
                    this.ctx.stroke();
                    
                    // Value on the right
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(value, 90, yPos);
                }
                else if(value < 0 && value >= -90){

                    this.ctx.setLineDash([2, 4]); // 2units line, 4 units of space
                    // Left Lines
                    this.ctx.beginPath();
                    this.ctx.moveTo(-30, yPos);
                    this.ctx.lineTo(-85, yPos);
                    this.ctx.closePath();

                    this.ctx.stroke();
                    
                    // Value on the left
                    this.ctx.textAlign = "right";
                    this.ctx.fillText(value, -90, yPos);
                    
                    // Right Lines
                    this.ctx.beginPath();
                    this.ctx.moveTo(30, yPos);
                    this.ctx.lineTo(85, yPos);
                    this.ctx.closePath();
                    
                    this.ctx.stroke();
                    
                    // Value on the right
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(value, 90, yPos);
                }
    
            }
        }

        this.ctx.restore();
    }

    drawUnderCarriage(active=true){
        if(active){
            /* 
                Draw the undercarriage on the aircraft if
                flight gear shows tha undercarriage is down;
            */ 
            
            // Draw the nose gear  
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY + 15);
            this.ctx.lineTo(this.centerX, this.centerY + 20);
            this.ctx.closePath();

            this.ctx.stroke();

            // Draw both the main gears
                // Left gear
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - 20, this.centerY);
            this.ctx.lineTo(this.centerX - 20, this.centerY + 5);
            this.ctx.closePath();

            this.ctx.stroke();

                // Right Gear
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX + 20, this.centerY);
            this.ctx.lineTo(this.centerX + 20, this.centerY + 5);
            this.ctx.closePath();

            this.ctx.stroke();
        }
    }

    drawOtherParams(data){
        const {mach, g, rAlt} = {...data};

        // Draw the top left box
        this.ctx.beginPath();
        this.ctx.strokeRect(20, 150, 80, 50);
        this.ctx.closePath();

        this.ctx.textAlign = "start";
        this.ctx.textBaseline = "top";

        // Mach Number
        this.ctx.fillText(`M: ${mach}`, 25, 155);

        // Pilot-G
        this.ctx.fillText(`g: ${g}`, 25, 175);

        // Rad Alt
        this.ctx.fillText(`R${rAlt.toString().padStart(5, '0')}`, 420, 527);

    }
}

export default GenerateHUD;