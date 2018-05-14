import Location from './JCal/Location';
import { ZmanTypes, getZmanType } from './ZmanTypes';
import { AsyncStorage } from 'react-native';
import { findLocation } from './Locations';
import { log, error, setDefault } from './GeneralUtils';

export default class Settings {
    /**
     *
     * @param {[{name:String, decs: String, eng: String, heb: String }]} [zmanimToShow]
     * @param {Location} [location]
     * @param {boolean} [showNotifications]
     */
    constructor(zmanimToShow, location, showNotifications = true) {
        /**
         * @property {[ZmanTypes]} zmanimToShow
         */
        this.zmanimToShow = zmanimToShow || [];
        /**
         * @property {Location} location
         */
        this.location = location || findLocation('ירושלים');
        /**
         * @property {boolean} showNotifications
         */
        this.showNotifications = setDefault(showNotifications, true);
    }
    /**
     * Saves the given zmanimToShow to AsyncStorage.
     * @param {[{name:String, decs: String, eng: String, heb: String }]} [zmanimToShow]
     */
    static async saveZmanim(zmanimToShow) {
        await AsyncStorage.setItem('ZMANIM_TO_SHOW',
            JSON.stringify(zmanimToShow),
            err => err && error(err));
    }
    /**
     * Saves the given Location to AsyncStorage.
     * @param {Location} location
     */
    static async saveLocation(location) {
        await AsyncStorage.setItem('LOCATION_NAME',
            location.Name,
            err => err && error(err));
    }
    /**
     * Saves the showNotifications to AsyncStorage.
     * @param {boolean} showNotifications
     */
    static async saveShowNotifications(showNotifications) {
        await AsyncStorage.setItem('NOTIFICATIONS',
            JSON.stringify(showNotifications),
            err => err && error(err));
    }
    static async getSettings() {
        let zmanimToShow, location, showNotifications;
        const allKeys = await AsyncStorage.getAllKeys();
        log('all storage keys', allKeys);
        if (allKeys.includes('ZMANIM_TO_SHOW')) {
            const zts = await AsyncStorage.getItem('ZMANIM_TO_SHOW');
            zmanimToShow = JSON.parse(zts);
            log('Zmanim to show from storage data', zts);
        }
        if (allKeys.includes('LOCATION_NAME')) {
            const locationName = await AsyncStorage.getItem('LOCATION_NAME');
            location = findLocation(locationName);
            log('Location from storage data', locationName);
        }
        if (allKeys.includes('NOTIFICATIONS')) {
            const sn = await AsyncStorage.getItem('NOTIFICATIONS');
            showNotifications = JSON.parse(sn);
            log('showNotifications from storage data', sn);
        }
        return { zmanimToShow, location, showNotifications };
    }
}