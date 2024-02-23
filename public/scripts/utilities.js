const COLORS = {
    YELLOWGREEN: "yellowgreen",
    YELLOW: "#FFFF00",
    AIRFORCEBLUE: "#00308F",
    AZURE: "#007FFF",
    ARSENALRED: "#EF0107",
    CANDYAPPLERED: "#FF0800",
    HUD: "#CEAD0D",
    BRIGHTPINK: "#FF007F",
    DEEPPINK: "#FF1493",
    PERSIANPINK: "#F77FBE",
    JUNGLEGREEN: "#29AB87",
    DARKCYAN: "#133141"
};


function toRadian(angle){
    return (angle * Math.PI) / 180;
}

function toDecimalPlaces(number, place){
    return Math.round(number * Math.pow(10, place)) / Math.pow(10, place);
}

function toLatitude(latitude){

    let dir;

    if(latitude < 0){
        dir = 'S';
    }else{
        dir = 'N';
    }

    const value = Math.abs(latitude);

    const deg = Math.trunc(value);
    const min = Math.trunc((value - deg) * 60);
    const sec = ((((value - deg) * 60) - min ) * 60).toFixed(1);

    return `${deg}\u00b0${min}'${sec.padStart(4, '0')}" ${dir}`;
}

function toLongitude(longitude){

    let dir;

    if(longitude < 0){
        dir = 'W';
    }else{
        dir = 'E';
    }

    const value = Math.abs(longitude);
 
    const deg = Math.trunc(value);
    const min = Math.trunc((value - deg) * 60);
    const sec = ((((value - deg) * 60) - min ) * 60).toFixed(1);

    // console.log(`${deg}\u00b0 ${min}' ${sec}" ${dir}`);
    return `${deg}\u00b0${min}'${sec.padStart(4, '0')}" ${dir}`;
}

function distanceConversion(lat1, lon1, lat2, lon2){
    const earthRadiusKm = 6371;
    const dLat = toRadian(lat2 - lat1);
    const dLon = toRadian(lon2 - lon1);
    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    // Using Great Circle distance formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (earthRadiusKm * c) * 0.53996; // Convert into Nautical Mile
}

function convertFromPercentage(number, mode="rpm"){
    if(mode=== "rpm"){
    // used to convert percent to decimal for n1 and n2 of engine
        return number < 100 ? number/100 : 1;
    }else{
        return number/100;
    }
}


// Exporting all functions
export {
    COLORS,
    toRadian,
    toDecimalPlaces,
    toLatitude,
    toLongitude,
    distanceConversion,
    convertFromPercentage
}