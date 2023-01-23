export const timeSinceLastChecked = (lastChecked: number | undefined, lastCheckingPeriod: string | undefined) => {
    if (lastChecked === undefined) return false;
    if (lastCheckingPeriod === undefined) return false;

    let currentTime = new Date().getTime();
    let difference = currentTime - lastChecked;

    const hour = 3600000;

    switch(lastCheckingPeriod) {
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