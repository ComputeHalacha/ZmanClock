import { NativeModules, ToastAndroid } from 'react-native';
import Utils from './JCal/Utils';

/**
 * Set the current system clock.
 * @param {{hour:number,minute:number,second:number}} time
 */
export function setSystemTime(time) {
  const now = new Date(),
    midnight =
      now.valueOf() - Utils.totalSeconds(Utils.timeFromDate(now)) * 1000,
    milliseconds = midnight + Utils.totalSeconds(time) * 1000;
  let success = false;
  try {
    success = NativeModules.SystemTimeAndroid.setSystemTime(milliseconds);
  } catch (e) {
    ToastAndroid.show(
      'Time could not be set. Please assure that the current app is a system app in a rooted device. ' +
        (e.description || ''),
      ToastAndroid.LONG
    );
  }

  return success;
}
/**
 * 	Get the current system time
 */
export function getSystemTime() {
  return NativeModules.SystemTimeAndroid.getSystemTime();
}

/**
 * Open system settings for date and time
 */
export function openSystemTimeSettings() {
  NativeModules.SystemTimeAndroid.openSystemTimeSettings();
}