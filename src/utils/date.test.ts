import { timeSinceLastChecked, hourPassed } from "./date.utils";

it('Checks if enough time has passed since last checking time', () => {
    const currentTime = new Date().getTime();
    const hour = 3600000;
    expect(timeSinceLastChecked(currentTime - hour + 1000, '1 Hour')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - hour, '1 Hour')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*2) + 1000, '2 Hours')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*2), '2 Hours')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*4) + 1000, '4 Hours')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*4), '4 Hours')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*8) + 1000, '8 Hours')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*8), '8 Hours')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*24) + 1000, '1 Day')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*24), '1 Day')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*48) + 1000, '2 Days')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*48), '2 Days')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*96) + 1000, '4 Days')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*96), '4 Days')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*168) + 1000, '1 Week')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*168), '1 Week')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*336) + 1000, '2 Weeks')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*336), '2 Weeks')).toEqual(true);

    expect(timeSinceLastChecked(currentTime - (hour*672) + 1000, '4 Weeks')).toEqual(false);
    expect(timeSinceLastChecked(currentTime - (hour*672), '4 Weeks')).toEqual(true);
});

it('Checks if an hour has passed since last checking a card', () => {
    const hour = 3600000;
    let overHourTime = new Date().getTime() - hour - 1024;
    expect(hourPassed(overHourTime)).toEqual(true);

    let underHourTime = new Date().getTime() - 2402;
    expect(hourPassed(underHourTime)).toEqual(false);

    expect(hourPassed(undefined)).toEqual(false);
})