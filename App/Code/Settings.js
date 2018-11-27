import Location from './JCal/Location';
import { ZmanTypes, getZmanType } from './ZmanTypes';
import { AsyncStorage } from 'react-native';
import { findLocation } from './Locations';
import { log, error, setDefault } from './GeneralUtils';

export default class Settings {
    /**
     *
     * @param {[{name:String, desc: String, eng: String, heb: String }]} [zmanimToShow] List of which zmanim to show
     * @param {Location} [location]
     * @param {boolean} [showNotifications] Show shul notifications?
     * @param {number} [numberOfItemsToShow] Number of zmanim to show on the main screen
     * @param {number} [minToShowPassedZman] Number of minutes to continue showing zmanim that have passed
     */
    constructor(zmanimToShow, location, showNotifications, numberOfItemsToShow, minToShowPassedZman) {
        /**
         * @property {[ZmanTypes]} zmanimToShow List of which zmanim to show
         */
        this.zmanimToShow = zmanimToShow || [
            getZmanType('alos90'),
            getZmanType('netzMishor'),
            getZmanType('shkiaElevation'),
            getZmanType('tzais50')
        ];
        /**
         * @property {Location} location
         */
        this.location = location || findLocation('ירושלים');
        /**
         * @property {boolean} showNotifications Show shul notifications?
         */
        this.showNotifications = setDefault(showNotifications, true);
        /**
         * @property {number} numberOfItemsToShow Number of zmanim to show on the main screen
         */
        this.numberOfItemsToShow = setDefault(numberOfItemsToShow, 3);
        /**
         * @property {number} minToShowPassedZman Number of minutes to continue showing zmanim that have passed
         */
        this.minToShowPassedZman = setDefault(minToShowPassedZman, 2);
    }
    clone() {
        return new Settings(
            this.zmanimToShow,
            this.location,
            this.showNotifications,
            this.numberOfItemsToShow,
            this.minToShowPassedZman);
    }
    /**
     * Saves the current settings to AsyncStorage.
     */
    async save() {
        log('started save Settings');
        await AsyncStorage.multiSet([
            ['ZMANIM_TO_SHOW', JSON.stringify(this.zmanimToShow)],
            ['LOCATION_NAME', this.location.Name],
            ['NOTIFICATIONS', JSON.stringify(Number(this.showNotifications))],
            ['NUMBER_OF_ITEMS_TO_SHOW', JSON.stringify(this.numberOfItemsToShow)],
            ['MINUTES_PASSED_ZMAN', JSON.stringify(this.minToShowPassedZman)]
        ],
            errors => errors && error('Error during AsyncStorage.multiSet for settings', errors));
        log('Saved settings', this);
    }
    /**
     * Gets saved settings from the local storage
     */
    static async getSettings() {
        log('started getSettings');
        const settings = new Settings(),
            allKeys = await AsyncStorage.getAllKeys();
        log('all storage keys', allKeys);
        if (allKeys.includes('ZMANIM_TO_SHOW')) {
            const zts = await AsyncStorage.getItem('ZMANIM_TO_SHOW');
            settings.zmanimToShow = JSON.parse(zts);
            log('zmanimToShow to show from storage data', zts);
        }
        if (allKeys.includes('LOCATION_NAME')) {
            const locationName = await AsyncStorage.getItem('LOCATION_NAME');
            settings.location = findLocation(locationName);
            log('location from storage data', locationName);
        }
        if (allKeys.includes('NOTIFICATIONS')) {
            const sn = await AsyncStorage.getItem('NOTIFICATIONS');
            settings.showNotifications = Boolean(JSON.parse(sn));
            log('showNotifications from storage data', sn);
        }
        if (allKeys.includes('NUMBER_OF_ITEMS_TO_SHOW')) {
            const ni = await AsyncStorage.getItem('NUMBER_OF_ITEMS_TO_SHOW');
            settings.numberOfItemsToShow = JSON.parse(ni);
            log('numberOfItemsToShow from storage data', ni);
        }
        if (allKeys.includes('MINUTES_PASSED_ZMAN')) {
            const mpz = await AsyncStorage.getItem('MINUTES_PASSED_ZMAN');
            settings.minToShowPassedZman = JSON.parse(mpz);
            log('minToShowPassedZman from storage data', mpz);
        }
        return settings;
    }
}