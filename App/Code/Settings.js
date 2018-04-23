import Location from './JCal/Location';
import { ZmanTypes } from './ZmanTypes';
import { AsyncStorage } from 'react-native';

export default class Settings {
    constructor() {
        this.zmanimToShow = [ZmanTypes.netzMishor];
        this.location = Location.getJerusalem();
    }
    async save() {
        await AsyncStorage.setItem('ZMANIM_TO_SHOW', JSON.stringify(this.zmanimToShow));
        await AsyncStorage.setItem('LOCATION', JSON.stringify(this.location));
    }
    static async GetSettings() {
        const settings = new Settings(),
            zmanimToShow = await AsyncStorage.getItem('ZMANIM_TO_SHOW'),
            location = await AsyncStorage.getItem('LOCATION');

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