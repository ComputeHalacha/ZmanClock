import Utils from './Code/JCal/Utils';
import Zmanim from './Code/JCal/Zmanim';
import Location from './Code/JCal/Location';
import { ZmanTypes } from './Code/ZmanTypes';

export default class AppUtils {
    /**
         * Returns the date corrected time of the given zman on the given date at the given location
         * If the zman is after or within an hour of the given time, this days zman is returned, othwise tomorrows zman is returned.
         * @param {Date} sdate
         * @param {{hour : Number, minute :Number, second: Number }} time
         * @param {Location} location
         * @param {{ decs: String, eng: String, heb: String }} zmanToShow
         * @returns {{zmanTime:{hour : Number, minute :Number, second: Number }, isTommorrow:Boolean}}
         */
    static getCorrectZmanTime(sdate, time, location, zmanToShow) {
        let zmanTime = AppUtils.getZmanTime(sdate, location, zmanToShow),
            isTommorrow = false,
            diff = Utils.timeDiff(time, zmanTime, true);
        if (diff.sign < 1 && Utils.totalMinutes(diff) >= 60) {
            zmanTime = AppUtils.getZmanTime(new Date(sdate.valueOf() + 8.64E7), location, zmanToShow);
            isTommorrow = true;
        }
        return { zmanTime, isTommorrow };
    }

    /**
     * Returns the time of the given zman on the given date at the given location
     * @param {Date} sdate
     * @param {Location} location
     * @param {{ decs: String, eng: String, heb: String }} zmanToShow
     */
    static getZmanTime(sdate, location, zmanToShow) {
        switch (zmanToShow) {
            case ZmanTypes.netzMishor:
                return Zmanim.getSunTimes(sdate, location, false).sunrise;
        }
    }
}