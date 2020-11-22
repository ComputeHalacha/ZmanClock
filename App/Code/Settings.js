import Location from './JCal/Location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findLocation } from './Locations';
import { log, warn, error, setDefault, isNumber } from './GeneralUtils';
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
     * @param {string} [theme] The name of the theme
     * @param {boolean} [showDafYomi] Show the Daf Yomi?
     * @param {boolean} [english] Show in English?
     */
    constructor(
        zmanimToShow,
        customZmanim,
        location,
        showNotifications,
        numberOfItemsToShow,
        minToShowPassedZman,
        showGaonShir,
        theme,
        showDafYomi,
        english
    ) {
        /**
         * @property {[{id:Number, offset: ?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }]} zmanimToShow List of which zmanim to show
         */
        this.zmanimToShow = zmanimToShow || [
            getZmanType(1), //alos90
            getZmanType(5), //netzMishor
            getZmanType(15), //shkiaElevation
            getZmanType(17), //tzais50
            getZmanType(21), //candleLighting
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
        /**
         * @property {string} [theme] name of the style theme
         */
        this.theme = theme || 'dark';
        /**
         * @property {boolean} [showDafYomi] Show Daf Yomi?
         */
        this.showDafYomi = setDefault(showDafYomi, true);
        /**
         * @property {boolean} [english] Should the language be English?
         */
        this.english = !!english;
    }
    clone() {
        return new Settings(
            [...this.zmanimToShow],
            [...this.customZmanim],
            this.location,
            this.showNotifications,
            this.numberOfItemsToShow,
            this.minToShowPassedZman,
            this.showGaonShir,
            this.theme,
            this.showDafYomi,
            this.english
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
                ['SHIR_GAON', JSON.stringify(Number(this.showGaonShir))],
                ['THEME_NAME', this.theme],
                ['DAF_YOMI', JSON.stringify(Number(this.showDafYomi))],
                ['ENGLISH', JSON.stringify(Number(this.english))],
            ],
            (errors) =>
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
            try {
                const zts = await AsyncStorage.getItem('ZMANIM_TO_SHOW'),
                    i = JSON.parse(zts);
                if (i && Array.isArray(i) && i.length) {
                    settings.zmanimToShow = i;
                    log('zmanimToShow to show from storage data', zts);
                } else {
                    warn(
                        'Invalid or empty zmanimToShow in storage data variable: ' +
                            zts
                    );
                }
            } catch (e) {
                error(
                    'Failed to load zmanimToShow array from storage data:',
                    e
                );
            }
        }
        if (allKeys.includes('CUSTOM_ZMANIM')) {
            try {
                const cz = await AsyncStorage.getItem('CUSTOM_ZMANIM'),
                    i = JSON.parse(cz);
                if (i && Array.isArray(i) && i.length) {
                    settings.customZmanim = i;
                    log('customZmanim to show from storage data', cz);
                } else {
                    warn(
                        'Invalid or empty customZmanim in storage data variable: ' +
                            cz
                    );
                }
            } catch (e) {
                error(
                    'Failed to load customZmanim array from storage data:',
                    e
                );
            }
        }
        if (allKeys.includes('LOCATION_NAME')) {
            try {
                const locationName = await AsyncStorage.getItem(
                        'LOCATION_NAME'
                    ),
                    i = findLocation(locationName);
                if (i && i.Latitude) {
                    settings.location = i;
                    log('location from storage data', locationName);
                } else {
                    warn(
                        'Invalid or empty location in storage data variable: ' +
                            locationName
                    );
                }
            } catch (e) {
                error('Failed to load location from storage data:', e);
            }
        }
        if (allKeys.includes('NOTIFICATIONS')) {
            try {
                const sn = await AsyncStorage.getItem('NOTIFICATIONS');
                if (sn) {
                    settings.showNotifications = Boolean(JSON.parse(sn));
                    log('showNotifications from storage data', sn);
                } else {
                    warn(
                        'Invalid showNotifications in storage data variable: ' +
                            sn
                    );
                }
            } catch (e) {
                error('Failed to load showNotifications from storage data:', e);
            }
        }
        if (allKeys.includes('NUMBER_OF_ITEMS_TO_SHOW')) {
            try {
                const ni = await AsyncStorage.getItem(
                        'NUMBER_OF_ITEMS_TO_SHOW'
                    ),
                    i = JSON.parse(ni);
                if (isNumber(i)) {
                    settings.numberOfItemsToShow = i;
                    log('numberOfItemsToShow from storage data', i);
                } else {
                    warn(
                        'Invalid numberOfItemsToShow in storage data variable: ' +
                            ni
                    );
                }
            } catch (e) {
                error(
                    'Failed to load numberOfItemsToShow from storage data:',
                    e
                );
            }
        }
        if (allKeys.includes('MINUTES_PASSED_ZMAN')) {
            try {
                const mpz = await AsyncStorage.getItem('MINUTES_PASSED_ZMAN'),
                    i = JSON.parse(mpz);
                if (isNumber(i)) {
                    settings.minToShowPassedZman = i;
                    log('minToShowPassedZman from storage data', mpz);
                } else {
                    warn(
                        'Invalid minToShowPassedZman in storage data variable: ' +
                            mpz
                    );
                }
            } catch (e) {
                error(
                    'Failed to load minToShowPassedZman from storage data:',
                    e
                );
            }
        }
        if (allKeys.includes('SHIR_GAON')) {
            try {
                const sn = await AsyncStorage.getItem('SHIR_GAON');
                if (sn) {
                    settings.showGaonShir = Boolean(JSON.parse(sn));
                    log('showGaonShir from storage data', sn);
                } else {
                    warn(
                        'Invalid showGaonShir in storage data variable: ' + sn
                    );
                }
            } catch (e) {
                error('Failed to load showGaonShir from storage data:', e);
            }
        }
        if (allKeys.includes('THEME_NAME')) {
            try {
                const tn = await AsyncStorage.getItem('THEME_NAME');
                if (tn) {
                    settings.theme = tn;
                    log('theme from storage data', tn);
                } else {
                    warn(
                        'Invalid or missing theme in storage data variable: ' +
                            tn
                    );
                }
            } catch (e) {
                error('Failed to load theme from storage data:', e);
            }
        }
        if (allKeys.includes('DAF_YOMI')) {
            try {
                const sn = await AsyncStorage.getItem('DAF_YOMI');
                if (sn) {
                    settings.showDafYomi = Boolean(JSON.parse(sn));
                    log('showDafYomi from storage data', sn);
                } else {
                    warn('Invalid showDafYomi in storage data variable: ' + sn);
                }
            } catch (e) {
                error('Failed to load showDafYomi from storage data:', e);
            }
        }
        if (allKeys.includes('ENGLISH')) {
            try {
                const eng = await AsyncStorage.getItem('ENGLISH');
                if (eng) {
                    settings.english = Boolean(JSON.parse(eng));
                    log('English from storage data', eng);
                } else {
                    warn('Invalid english in storage data variable: ' + eng);
                }
            } catch (e) {
                error('Failed to load English from storage data:', e);
            }
        }
        return settings;
    }
}
