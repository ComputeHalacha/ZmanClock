import Location from './JCal/Location';
import { ZmanTypes, getZmanType } from './ZmanTypes';
import { AsyncStorage } from 'react-native';
import { findLocation } from './Locations';
import { log, error } from './GeneralUtils';

export default class Settings {
    /**
     *
     * @param {[{name:String, decs: String, eng: String, heb: String }]} [zmanimToShow]
     * @param {Location} [location]
     */
    constructor(zmanimToShow, location) {
        /**
         * @property {[ZmanTypes]} zmanimToShow
         */
        this.zmanimToShow = zmanimToShow || [];
        /**
         * @property {Location} location
         */
        this.location = location || findLocation('ירושלים');
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
    static async getSettings() {
        let zmanimToShow, location;
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
        return { zmanimToShow, location };
    }
}