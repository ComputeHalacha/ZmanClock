import Location from './JCal/Location';
import { ZmanTypes } from './ZmanTypes';
import { AsyncStorage } from 'react-native';

export default class Settings {
    /**
     *
     * @param {[{name:String, decs: String, eng: String, heb: String }]} zmanimToShow
     * @param {Location} location
     */
    constructor(zmanimToShow, location) {
        /**
         * @property {[ZmanTypes]} zmanimToShow
         */
        this.zmanimToShow = zmanimToShow || [ZmanTypes.find(zt => zt.name === 'netzMishor')];
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
        console.log('got settings');

        if (zmanimToShow) {
            settings.zmanimToShow = JSON.parse(zmanimToShow);
        }
        if (location) {
            settings.location = JSON.parse(location);
        }
        if ((!zmanimToShow) || (!location)) {
            await settings.save();
        }

        return settings;
    }
}