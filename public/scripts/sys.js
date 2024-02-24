import { COLORS, convertFromPercentage, toRadian } from "./utilities.js";

class GenerateSysPage{
    constructor(canvas, ctx, data){
        this.data = data;
        this.ctx = ctx;
        this.canvas = canvas;
        this.currentValues = {...data};
        
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;

        // Binding function in the class
        this.drawPage = this.drawPage.bind(this);
    }

    drawPage(){
       
        this.drawEngineRPM(this.currentValues);
        this.drawEGTCircle(this.currentValues.egt);
        this.drawOilPressure(this.currentValues.op);
        this.drawFuelPortion(this.currentValues);

        this.renderText(this.currentValues);
        this.drawSeperationLine();
    }

    drawEngineRPM(engineData){

        // Heading for engine portion
        this.ctx.font = "22px Ariel";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.fillText("ENGINE PARAMETERS", this.centerX, 10);

        // Resetting the font position
        this.ctx.font = "12px Ariel";
        this.ctx.textBaseline = "middle";

        // n1 and n2 can go beyond 100;
        const n1 = convertFromPercentage(engineData.n1);
        const n2 = convertFromPercentage(engineData.n2);

        this.ctx.strokeStyle = COLORS.HUD;
        this.ctx.lineWidth = 3;
        // Left Big Circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX - 100, 120, 70, toRadian(90), 0);

        this.ctx.stroke();

        // Right Big Circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + 100, 120, 70, toRadian(90), 0);

        this.ctx.stroke();

        // Draw the lines
        this.ctx.strokeStyle = "red";
        
        // for left circle (n1)
        const x1 = this.centerX - 100 + (70 * Math.cos((n1 * toRadian(270)) + toRadian(90)));
        const y1 = 120 + (70 * Math.sin((n1 * toRadian(270)) + toRadian(90)));

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 100, 120);
        this.ctx.lineTo(x1, y1);
        this.ctx.closePath();

        this.ctx.stroke();

        // Draw the markings
        this.ctx.strokeStyle = COLORS.HUD;

        let value = 0; // Starting value of the marks
        let angle = 90; // Starting angle

        for(let i=0; i <= 100; i+=10){

            if(value % 10 === 0){

                const x1 = 150 + (70 * Math.cos(toRadian(angle)));
                const y1 = 120 + (70 * Math.sin(toRadian(angle)));
                const x2 = 150 + (60 * Math.cos(toRadian(angle)));
                const y2 = 120 + (60 * Math.sin(toRadian(angle)));

                // For the marking texts
                const x3 = 150 + (50 * Math.cos(toRadian(angle)));
                const y3 = 120 + (50 * Math.sin(toRadian(angle)));

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();

                this.ctx.stroke();
                
                // Show the value of the markings
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.textAlign = "center";
                this.ctx.fillText(`${value}`, x3, y3);
            }

            value+=10;
            angle+=27;
        }

        this.ctx.strokeStyle = "red";

        // for right circle (n2)
        const x2 = this.centerX + 100 + (70 * Math.cos((n2 * toRadian(270)) + toRadian(90)));
        const y2 = 120 + (70 * Math.sin((n2 * toRadian(270)) + toRadian(90)));

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 100, 120);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();

        this.ctx.stroke();

        // Draw the markings
        this.ctx.strokeStyle = COLORS.HUD;

        value = 0; // Starting value of the marks
        angle = 90; // Starting angle

        for(let i=0; i <= 100; i+=10){

            if(value % 10 === 0){

                const x1 = 350 + (70 * Math.cos(toRadian(angle)));
                const y1 = 120 + (70 * Math.sin(toRadian(angle)));
                const x2 = 350 + (60 * Math.cos(toRadian(angle)));
                const y2 = 120 + (60 * Math.sin(toRadian(angle)));

                // For the marking texts
                const x3 = 350 + (50 * Math.cos(toRadian(angle)));
                const y3 = 120 + (50 * Math.sin(toRadian(angle)));

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();

                this.ctx.stroke();
                
                // Show the value of the markings
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.textAlign = "center";
                this.ctx.fillText(`${value}`, x3, y3);
            }

            value+=10;
            angle+=27;
        }

    }

    drawEGTCircle(egt){

        const maxTemp = 1200; // In Celcius [1300 will not be counted]

        this.ctx.strokeStyle = COLORS.HUD;

        // Left Small Circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, 300, 70, toRadian(100), toRadian(300));
        

        this.ctx.stroke();
        

        this.ctx.stroke();

        // Draw EGT lines

        this.ctx.strokeStyle = "red";

        const egtX = this.centerX + (70 * Math.cos((egt/maxTemp) * toRadian(200) + toRadian(100)));
        const egtY = 300 + (70 * Math.sin((egt/maxTemp) * toRadian(200) + toRadian(100)));

        // for circle (egt)
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 300);
        this.ctx.lineTo(egtX, egtY);
        this.ctx.closePath();

        this.ctx.stroke();

        // Draw the markings
        this.ctx.strokeStyle = COLORS.HUD;

        let value = 0; // Starting value of the marks
        let angle = 100; // Starting angle

        for(let i=0; i <= 120; i+=10){

            if(value % 10 === 0){
                const x1 = this.centerX + (70 * Math.cos(toRadian(angle)));
                const y1 = 300 + (70 * Math.sin(toRadian(angle)));
                const x2 = this.centerX + (60 * Math.cos(toRadian(angle)));
                const y2 = 300 + (60 * Math.sin(toRadian(angle)));

                // For the marking texts
                // Higher radius makes the marks go outside
                const x3 = this.centerX + (85 * Math.cos(toRadian(angle)));
                const y3 = 300 + (85 * Math.sin(toRadian(angle)));

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();

                this.ctx.stroke();
                
                // Show the value of the markings
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.textAlign = "center";
                this.ctx.fillText(`${value}`, x3, y3);
            }

            value+=100;
            angle+=16.67;
        }

    }

    drawOilPressure(oilPressure){
        // Heading for oil portion
        this.ctx.font = "16px Ariel";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.fillText("OIL PARAMETERS", 375, 405);

        this.ctx.strokeStyle = COLORS.HUD;

        // Resetting the font position
        this.ctx.font = "12px Ariel";
        this.ctx.textBaseline = "middle";

        // Predefine center for the dial
        const arcX = 375;
        const arcY = 500;

        // Draw the arc
        this.ctx.beginPath();
        this.ctx.arc(arcX, arcY, 70, toRadian(135), toRadian(45));

        this.ctx.stroke();

        // Draw the pointer
        const maxPSI = 90;

        const xPos = arcX + (70 * Math.cos(((oilPressure/maxPSI) * toRadian(270)) + toRadian(135)));
        const yPos = arcY + (70 * Math.sin(((oilPressure/maxPSI) * toRadian(270)) + toRadian(135)));
        
        this.ctx.strokeStyle = "red";

        this.ctx.beginPath();
        this.ctx.moveTo(arcX, arcY);
        this.ctx.lineTo(xPos, yPos);
        this.ctx.closePath();

        this.ctx.stroke();

        // Draw the markings
        this.ctx.strokeStyle = COLORS.HUD;

        let value = 0; // Starting value of the marks
        let angle = 135; // Starting angle

        for(let i=0; i <= maxPSI; i+=10){
            if(angle % 15 === 0){
                const x1 = arcX + (70 * Math.cos(toRadian(angle)));
                const y1 = arcY + (70 * Math.sin(toRadian(angle)));
                const x2 = arcX + (60 * Math.cos(toRadian(angle)));
                const y2 = arcY + (60 * Math.sin(toRadian(angle)));

                // For the marking texts
                const x3 = arcX + (50 * Math.cos(toRadian(angle)));
                const y3 = arcY + (50 * Math.sin(toRadian(angle)));

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();

                this.ctx.stroke();
                
                // Show the value of the markings
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.textAlign = "center";
                this.ctx.fillText(`${value}`, x3, y3);
            }

            value+=10;
            angle+=30;
        }
    }

    drawFuelPortion(data){
        const { ff, bf, inf, lf, rf } = {...data};
        
        // Heading for engine portion
        this.ctx.font = "16px Ariel";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.fillText("FUEL PARAMETERS", 125, 405);

        // Resetting the font position
        this.ctx.font = "12px Ariel";
        this.ctx.textBaseline = "middle";

        // Draw the vertical scale for Fuel Flow (ff)
        // The limit is from 0 - 500kg/min
        // Set box parameters
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 2;

        // Draw the box
        this.ctx.beginPath();
        this.ctx.strokeRect(10, 470, 50, 250);
        this.ctx.closePath();

        this.ctx.stroke();

        // Draw marks on the boxes
        let value = 0;
        for(let i=0; i<=250; i+=50)
        {   
            const yPos = 720 - i;

            // draw marks
            this.ctx.beginPath();
            this.ctx.moveTo(10, yPos);
            this.ctx.lineTo(60, yPos);
            this.ctx.closePath();

            this.ctx.stroke();

            // Text
            this.ctx.textAlign = "end";
            this.ctx.font = "16px Ariel";
            this.ctx.fillText(`${value}`, 55, yPos - 7);

            value += 100; // Increasing the value by 100 everytime
        }

        // Draw an arrow
        this.ctx.fillStyle = "red";

        const yPos = 720 - (ff / 2);
        const xPos = 60;
        
        this.ctx.beginPath();
        this.ctx.moveTo(xPos, yPos);
        this.ctx.lineTo(xPos + 15, yPos - 10);
        this.ctx.lineTo(xPos + 15, yPos + 10);
        this.ctx.closePath();

        this.ctx.fill();

        this.ctx.save();
        this.ctx.translate(xPos + 25, yPos);
        this.ctx.rotate(toRadian(90));

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "20px Ariel";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${ff}`, 0, 0);
        
        this.ctx.restore();

    }

    renderText(data){
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.textAlign = "start";
        this.ctx.font = "16px ariel";
        this.ctx.lineWidth = 2;
        this.ctx.textBaseline = "middle";

        // For N1
        this.ctx.fillText("N1 (%)", 160, 150);
        this.ctx.beginPath();
        this.ctx.strokeRect(160, 165, 70, 25);
        this.ctx.closePath();
        this.ctx.fillText(data.n1, 180, 180);

        this.ctx.stroke();

        // For N2
        this.ctx.fillText("N2 (%)", 360, 150);
        this.ctx.beginPath();
        this.ctx.strokeRect(360, 165, 70, 25);
        this.ctx.closePath();
        this.ctx.fillText(data.n2, 380, 180);

        this.ctx.stroke();

        // EGT
        this.ctx.fillText("EGT (\u00b0C)", 260, 340);
        this.ctx.beginPath();
        this.ctx.strokeRect(260, 350, 70, 25);
        this.ctx.closePath();
        this.ctx.fillText(data.egt, 280, 365);

        this.ctx.stroke();

        // Oil Pressure
        this.ctx.textAlign = "center";

        this.ctx.fillText("Oil Pressure (PSI)", 375, 570);
        
        this.ctx.beginPath();
        this.ctx.strokeRect(340, 580, 70, 25);
        this.ctx.closePath();

        this.ctx.fillText(data.op, 375, 593);

        this.ctx.stroke();

        // FUEL

        // Fuel Flow Heading
        this.ctx.textAlign = "start";
        this.ctx.fillText("Fuel Flow (kg/min)", 10, 440);

        // Bingo Fuel
        this.ctx.fillText(`Bingo Fuel: ${data.bf}kg`, 100, 480);

        // Remaining Fuel
        this.ctx.textAlign = "start";
        this.ctx.font = "16px Ariel";
        this.ctx.fillStyle = COLORS.HUD;
        this.ctx.fillText(`REMAINING FUEL`, 100, 520);
            // Internal Fuel
        this.ctx.font = "16px Ariel";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(`Internal: ${data.inf}kg`, 100, 550);
        this.ctx.fillText(`Left Wing: ${data.lf}kg`, 100, 575);
        this.ctx.fillText(`Right Wing: ${data.rf}kg`, 100, 600);

        // Electrical Parameters
        // Heading for electric portion
        this.ctx.font = "18px Ariel";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.fillText("BATTERY PARAMETERS", 375, 635);

        this.ctx.font = "14px Ariel";

        this.ctx.textAlign = "start";
        this.ctx.fillText(`Amps: ${data.amp} A`, 260, 670);
        
        this.ctx.textAlign = "end";
        this.ctx.fillText(`Volts: ${data.volts} V`, 500, 670);

    }

    drawSeperationLine(){
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 2;

        // Horizontal Line
        this.ctx.beginPath();
        this.ctx.moveTo(0, 395);
        this.ctx.lineTo(500, 395);
        this.ctx.closePath();

        this.ctx.stroke();

        // Vertical Line
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 395);
        this.ctx.lineTo(this.centerX, 734);
        this.ctx.closePath();

        this.ctx.stroke();
    }
}

export default GenerateSysPage;