import { NativeModules } from 'react-native';
import Utils from './JCal/Utils';

/**
 * Set the current system clock.
 * @param {{hour:number,minute:number,second:number}} time
 */
export function setSystemTime(time) {
    const now =  new Date(),
        midnight = now.valueOf() - (Utils.totalSeconds(Utils.timeFromDate(now)) * 1000),
        milliseconds = midnight + (Utils.totalSeconds(time) * 1000);
    return NativeModules.SystemTimeAndroid.setSystemTime(milliseconds);
}

/**
 * 	Get the current system time
 */
export function getSystemTime() {
    return NativeModules.SystemTimeAndroid.getSystemTime();
}