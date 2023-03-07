import { timeSinceLastChecked, hourPassed, getCheckingPeriodAsTime, getTimeString, getTimeTillNextPoint, getTimeStringTillNextPoint } from "./date.utils";

describe('Testing timeSinceLastChecked function', () => {
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
});

describe('Testing hourPassed function', () => {
    it('Checks if an hour has passed since last checking a card', () => {
        const hour = 3600000;
        let overHourTime = new Date().getTime() - hour - 1024;
        expect(hourPassed(overHourTime)).toEqual(true);
    
        let underHourTime = new Date().getTime() - 2402;
        expect(hourPassed(underHourTime)).toEqual(false);
    
        expect(hourPassed(undefined)).toEqual(false);
    });
});

describe('Testing getCheckingPeriodAsTime function', () => {
    it('Returns the correct number of milliseconds based on time string', () => {
        let milliseconds = getCheckingPeriodAsTime('1 Hour');
        expect(milliseconds).toBe(3600000);

        milliseconds = getCheckingPeriodAsTime('2 Hours');
        expect(milliseconds).toBe(3600000*2);

        milliseconds = getCheckingPeriodAsTime('4 Hours');
        expect(milliseconds).toBe(3600000*4);

        milliseconds = getCheckingPeriodAsTime('8 Hours');
        expect(milliseconds).toBe(3600000*8);

        milliseconds = getCheckingPeriodAsTime('1 Day');
        expect(milliseconds).toBe(3600000*24);

        milliseconds = getCheckingPeriodAsTime('2 Days');
        expect(milliseconds).toBe(3600000*48);

        milliseconds = getCheckingPeriodAsTime('4 Days');
        expect(milliseconds).toBe(3600000*96);

        milliseconds = getCheckingPeriodAsTime('1 Week');
        expect(milliseconds).toBe(3600000*168);

        milliseconds = getCheckingPeriodAsTime('2 Weeks');
        expect(milliseconds).toBe(3600000*336);

        milliseconds = getCheckingPeriodAsTime('4 Weeks');
        expect(milliseconds).toBe(3600000*672);

        milliseconds = getCheckingPeriodAsTime('aw 2ad');
        expect(milliseconds).toBe(0);

        milliseconds = getCheckingPeriodAsTime(undefined);
        expect(milliseconds).toBe(0);
    });
});

describe('Testing getTimeString function', () => {
    it('Returns a descriptive string from milliseconds', () => {
        let string = getTimeString(2160000);
        expect(string).toBe('36m');

        string = getTimeString(3600000);
        expect(string).toBe('1h:00m');

        string = getTimeString(5460000);
        expect(string).toBe('1h:31m');

        string = getTimeString(176857000);
        expect(string).toBe('2d:1h:07m');

        string = getTimeString(804240000);
        expect(string).toBe('1w:2d:7h:24m');
    });
});

describe('Testing getTimeStringTillNextPoint function', () => {
    it('Returns a time string based on time to next check', () => {
        let lastChecked = new Date().getTime();
        let lastCheckingPeriod = '1 Hour';
        let string = getTimeStringTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(string).toBe('1h:00m');

        lastChecked = new Date().getTime();
        lastCheckingPeriod = '2 Hours';
        string = getTimeStringTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(string).toBe('2h:00m');

        lastChecked = new Date().getTime() - 3600000;
        lastCheckingPeriod = '1 Hour';
        string = getTimeStringTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(string).toBe('00m');

        lastChecked = new Date().getTime() - 3700000;
        lastCheckingPeriod = '1 Hour';
        string = getTimeStringTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(string).toBe('Ready');

        string = getTimeStringTillNextPoint(undefined, undefined);
        expect(string).toBe('Ready');
    });
});

describe('Testing getTimeTillNextPoint function', () => {
    it('Returns a time based on time to next check', () => {
        let lastChecked = new Date().getTime();
        let lastCheckingPeriod = '1 Hour';
        let milliseconds = getTimeTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(milliseconds).toBe(3600000);

        lastChecked = new Date().getTime();
        lastCheckingPeriod = '2 Hours';
        milliseconds = getTimeTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(milliseconds).toBe(7200000);

        lastChecked = new Date().getTime() - 3600000;
        lastCheckingPeriod = '1 Hour';
        milliseconds = getTimeTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(milliseconds).toBe(0);

        lastChecked = new Date().getTime() - 3700000;
        lastCheckingPeriod = '1 Hour';
        milliseconds = getTimeTillNextPoint(lastChecked, lastCheckingPeriod);
        expect(milliseconds).toBe(-100000);

        milliseconds = getTimeTillNextPoint(undefined, undefined);
        expect(milliseconds).toBe(-1);
    });
});