export const getGridValues = () => {
    let screenWidth = window.innerWidth - 100;
    if (screenWidth > 1400) screenWidth = 1400;
    const gridSize = 100;
    const maxGrid = Math.floor(screenWidth / gridSize);
    const actualWidth = window.innerWidth - 100;
    const leftover = (actualWidth - (maxGrid*gridSize)) / 2;

    return { gridSize, maxGrid, leftover };
}

export const getNextLocation = (size: 'small' | 'medium' | 'large', takenLocations: {[key: string] : boolean}) => {
    const { maxGrid } = getGridValues();
    let checks = 1;
    if (size === 'medium') checks = 2;
    if (size === 'large') checks = 3;

    let x = 0;
    let y = 0;
    let foreverStopper = 0;

    while(true) {
        foreverStopper++;
        if (foreverStopper > 1000) break;

        //if going off edge of grid, move to next level
        if (x + checks-1 > maxGrid) {
            x = 0;
            y += 1;
        }

        //check all coordinates for size of card
        let found = true;
        let adjust = 0;
        for (let i = 0; i < checks; i++) {
            for (let j = 0; j < checks; j++) {
                let coord = `${x+j}-${y+i}`;
                if (takenLocations[coord] !== undefined) {
                    found = false;
                    adjust = j;
                    break;
                };
            }
            if (found === false) break;
        }

        //if not found, continue to next position and skip if needed
        if (found === false) {
            x += 1 + adjust;
            continue;
        }

        //if found, then fill in takenLocations
        for (let i = 0; i < checks; i++) {
            for (let j = 0; j < checks; j++) {
                let coord = `${x+j}-${y+i}`;
                takenLocations[coord] = true;
            }
        }
        break;
    }

    return { x, y };
}