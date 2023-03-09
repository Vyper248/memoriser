export const timeSinceLastChecked = (lastChecked: number | undefined, lastCheckingPeriod: string | undefined) => {
    if (lastChecked === undefined) return false;
    if (lastCheckingPeriod === undefined) return false;

    let currentTime = new Date().getTime();
    let difference = currentTime - lastChecked;

    const hour = 3600000;

    switch(lastCheckingPeriod) {
        case '10 Minutes': return difference >= 600000;
        case '1 Hour': return difference >= hour;
        case '2 Hours': return difference >= hour*2;
        case '4 Hours': return difference >= hour*4;
        case '8 Hours': return difference >= hour*8;
        case '1 Day': return difference >= hour*24;
        case '2 Days': return difference >= hour*48;
        case '4 Days': return difference >= hour*96;
        case '1 Week': return difference >= hour*168;
        case '2 Weeks': return difference >= hour*336;
        case '4 Weeks': return difference >= hour*672;
    }

    return false;
}

export const hourPassed = (lastChecked: number | undefined) => {
    if (lastChecked === undefined) return false;
    
    let currentTime = new Date().getTime();
    let difference = currentTime - lastChecked;

    const hour = 3600000;

    if (difference >= hour) return true;
    return false;
}

export const getCheckingPeriodAsTime = (lastCheckingPeriod: string | undefined) => {
    if (lastCheckingPeriod === undefined) return 0;

    const hour = 3600000;
    switch(lastCheckingPeriod) {
        case '10 Minutes': return 600000;
        case '1 Hour': return hour;
        case '2 Hours': return hour*2;
        case '4 Hours': return hour*4;
        case '8 Hours': return hour*8;
        case '1 Day': return hour*24;
        case '2 Days': return hour*48;
        case '4 Days': return hour*96;
        case '1 Week': return hour*168;
        case '2 Weeks': return hour*336;
        case '4 Weeks': return hour*672;
    }

    return 0;
}

export const getTimeString = (time: number) => {
    if (time < 0) return 'Ready';
    let minutes = Math.floor((time / 1000 / 60) % 60);
    let hours = Math.floor((time / 1000 / 60 / 60) % 24);
    let days = Math.floor((time / 1000 / 60 / 60 / 24) % 7);
    let weeks = Math.floor((time / 1000 / 60 / 60 / 24 / 7));
    let weekString = weeks > 0 ? weeks+'w:' : '';
    let dayString = weeks > 0 || days > 0 ? days+'d:' : '';
    let hourString = weeks > 0 || days > 0 || hours > 0 ? hours+'h:' : '';
    let minuteString = minutes > 9 ? minutes+'m' : '0'+minutes+'m';
    let formatted = `${weekString}${dayString}${hourString}${minuteString}`;
    return formatted;
}

export const getTimeTillNextPoint = (lastChecked: number | undefined, lastCheckingPeriod: string | undefined) => {
    if (lastChecked === undefined || lastCheckingPeriod === undefined) return -1;
    let currentDate = new Date().getTime();
    let timeToNext = getCheckingPeriodAsTime(lastCheckingPeriod);
    let nextCheckTime = lastChecked + timeToNext;
    let difference = nextCheckTime - currentDate;
    return difference;
}

export const getTimeStringTillNextPoint = (lastChecked: number | undefined, lastCheckingPeriod: string | undefined) => {
    let difference = getTimeTillNextPoint(lastChecked, lastCheckingPeriod);
    let timeString = getTimeString(difference);
    return timeString;
}