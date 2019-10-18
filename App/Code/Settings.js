import Location from './JCal/Location';
import { AsyncStorage } from 'react-native';
import { findLocation } from './Locations';
import { log, error, setDefault } from './GeneralUtils';
import { getZmanType } from './ZmanTypes';

export default class Settings {
    /**
     *
     * @param {[{id:Number, offset: ?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }]} [zmanimToShow] List of which zmanim to show
     * @param {[{id:Number, offset: Number, whichDaysFlags: Number }]} [customZmanim] List of which zmanim were added
     * @param {Location} [location]
     * @param {boolean} [showNotifications] Show shul notifications?
     * @param {number} [numberOfItemsToShow] Number of zmanim to show on the main screen
     * @param {number} [minToShowPassedZman] Number of minutes to continue showing zmanim that have passed
     * @param {boolean} [showGaonShir] Show the Shir Shel Yom of the Gr"a?
     */
    constructor(
        zmanimToShow,
        customZmanim,
        location,
        showNotifications,
        numberOfItemsToShow,
        minToShowPassedZman,
        showGaonShir
    ) {
        /**
         * @property {[{id:Number, offset: ?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }]} zmanimToShow List of which zmanim to show
         */
        this.zmanimToShow = zmanimToShow || [
            getZmanType(1), //alos90
            getZmanType(5), //netzMishor
            getZmanType(15), //shkiaElevation
            getZmanType(17), //tzais50
        ];
        /**
         * @property {[{id:Number, offset: Number, whichDaysFlags: Number, desc: String, eng: String, heb: String }]} customZmanim List of added zmanim
         * Note: the id needs to be one of the ids of ZmanTypes list in the file ZmanTypes.js
         * The offset is the number of minutes to be added/subtracted to this ZmanType.
         * The whichDaysFlags is an integer which contains a bit-flag of WhichDaysFlags values (contained in AppUtils.js)
         */
        this.customZmanim = customZmanim || [];
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
        /**
         * @property {boolean} [showGaonShir] Show the Shir Shel Yom of the Gr"a?
         */
        this.showGaonShir = setDefault(showGaonShir, true);
        
    }
    clone() {
        return new Settings(
            this.zmanimToShow,
            this.customZmanim,
            this.location,
            this.showNotifications,
            this.numberOfItemsToShow,
            this.minToShowPassedZman,
            this.showGaonShir
        );
    }
    /**
     * Saves the current settings to AsyncStorage.
     */
    async save() {
        log('started save Settings');
        await AsyncStorage.multiSet(
            [
                ['ZMANIM_TO_SHOW', JSON.stringify(this.zmanimToShow)],
                ['CUSTOM_ZMANIM', JSON.stringify(this.customZmanim)],
                ['LOCATION_NAME', this.location.Name],
                [
                    'NOTIFICATIONS',
                    JSON.stringify(Number(this.showNotifications)),
                ],
                [
                    'NUMBER_OF_ITEMS_TO_SHOW',
                    JSON.stringify(this.numberOfItemsToShow),
                ],
                [
                    'MINUTES_PASSED_ZMAN',
                    JSON.stringify(this.minToShowPassedZman),
                ],
                [
                    'SHIR_GAON',
                    JSON.stringify(Number(this.showGaonShir)),
                ],
            ],
            errors =>
                errors &&
                error('Error during AsyncStorage.multiSet for settings', errors)
        );
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
        if (allKeys.includes('CUSTOM_ZMANIM')) {
            const cz = await AsyncStorage.getItem('CUSTOM_ZMANIM');
            settings.customZmanim = JSON.parse(cz);                
            log('customZmanim to show from storage data', cz);
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
        if (allKeys.includes('SHIR_GAON')) {
            const sn = await AsyncStorage.getItem('SHIR_GAON');
            settings.showGaonShir = Boolean(JSON.parse(sn));
            log('showGaonShir from storage data', sn);
        }
        return settings;
    }
}
