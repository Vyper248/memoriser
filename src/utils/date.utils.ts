export const timeSinceLastChecked = (time: number | undefined, lastChecked: string | undefined) => {
    if (time === undefined) return true;
    if (lastChecked === undefined) return true;

    let currentTime = new Date().getTime();
    let difference = currentTime - time;

    const hour = 3600000;

    switch(lastChecked) {
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

    return true;
}