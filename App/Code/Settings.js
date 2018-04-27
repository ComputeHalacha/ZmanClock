import Location from './JCal/Location';
import { ZmanTypes, getZmanType } from './ZmanTypes';
import { AsyncStorage } from 'react-native';

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
        this.zmanimToShow = zmanimToShow || [getZmanType('netzMishor'), getZmanType('szksMga'), getZmanType('shkiaElevation'), getZmanType('tzais72')];
        /**
         * @property {Location} location
         */
        this.location = location || Location.getJerusalem();
    }
    save() {
        AsyncStorage.multiSet([
            ['ZMANIM_TO_SHOW', JSON.stringify(this.zmanimToShow)],
            ['LOCATION', JSON.stringify(this.location)]]);
    }
    static async getSettings() {
        const [zmanimToShow, location] = await AsyncStorage.multiGet(['ZMANIM_TO_SHOW', 'LOCATION']),
        settings = new Settings();

        if (zmanimToShow) {
            settings.zmanimToShow = JSON.parse(zmanimToShow[1]);
        }
        if (location) {
            settings.location = JSON.parse(location[1]);
        }

        return settings;
    }
}