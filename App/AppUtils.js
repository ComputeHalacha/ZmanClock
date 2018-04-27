import Utils from './Code/JCal/Utils';
import Zmanim from './Code/JCal/Zmanim';
import Location from './Code/JCal/Location';
import jDate from './Code/JCal/jDate';

export default class AppUtils {
    static zmanTimesCache = [];

    /**
    * Returns the date corrected time of the given zmanim on the given date at the given location
    * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
    * @param {Date} sdate
    * @param {{hour : Number, minute :Number, second: Number }} time
    * @param {Location} location
    * @param {[{name:String, decs: String, eng: String, heb: String }]} zmanTypes
    * @returns {[{zmanType:{name:String, decs: String, eng: String, heb: String },time:{hour : Number, minute :Number, second: Number }, isTommorrow:Boolean}]}
    */
    static getCorrectZmanTimes(sdate, time, location, zmanTypes) {
        const correctedTimes = [],
            zmanTimes = AppUtils.getZmanTimes(zmanTypes, sdate, location),
            tommorowTimes = AppUtils.getZmanTimes(zmanTypes, new Date(sdate.valueOf() + 8.64E7), location);

        for (let zt of zmanTimes) {
            let oTime = zt.time,
                isTommorrow = false,
                diff = Utils.timeDiff(time, oTime, true);
            if (diff.sign < 1 && Utils.totalMinutes(diff) >= 30) {
                oTime = tommorowTimes.find(t => t.zmanType === zt.zmanType).time;
                isTommorrow = true;
            }
            correctedTimes.push({ zmanType: zt.zmanType, time: oTime, isTommorrow });
        }
        return correctedTimes.sort((a, b) =>
            (a.isTommorrow ? 1 : -1) - (b.isTommorrow ? 1 : -1) ||
            Utils.totalSeconds(a.time) - Utils.totalSeconds(b.time));
    }

    /**
     * Gets the zmanim for all the types in the given list.
     * @param {[{name:String,decs:String,eng:String,heb:String}]} zmanTypes An array of ZmanTypes to get the zman for.
     * @param {Date} date The secular date to get the zmanim for
     * @param {Location} location The location for which to get the zmanim
     * @returns{[{zmanType:{name:String,decs:String,eng:String,heb:String },time:{hour:Number,minute:Number,second:Number}}]}
     */
    static getZmanTimes(zmanTypes, date, location) {
        const mem = AppUtils.zmanTimesCache.find(z => Utils.isSameSdate(z.date, date) && z.location.Name === location.Name),
            zmanTimes = [];
        let sunrise, sunset, suntimesMishor, sunriseMishor, sunsetMishor, candles, mishorNeg90, chatzos, shaaZmanis, shaaZmanis90;
        if (mem) {
            sunrise = mem.sunrise;
            sunset = mem.sunset;
            suntimesMishor = mem.suntimesMishor;
            sunriseMishor = mem.sunriseMishor;
            sunsetMishor = mem.sunsetMishor;
            candles = mem.candles;
            mishorNeg90 = mem.mishorNeg90;
            chatzos = mem.chatzos;
            shaaZmanis = mem.shaaZmanis;
            shaaZmanis90 = mem.shaaZmanis90;
        }
        else {
            const suntimes = Zmanim.getSunTimes(date, location, false);
            sunrise = suntimes.sunrise;
            sunset = suntimes.sunset;
            suntimesMishor = Zmanim.getSunTimes(date, location, true);
            sunriseMishor = suntimesMishor.sunrise;
            sunsetMishor = suntimesMishor.sunset;
            candles = jDate.toJDate(date).hasCandleLighting() &&
                Zmanim.getCandleLightingFromSunTimes({ sunrise, sunset }, location);
            mishorNeg90 = Utils.addMinutes(sunriseMishor, -90);
            chatzos = sunriseMishor && sunsetMishor &&
                Zmanim.getChatzosFromSuntimes(suntimesMishor);
            shaaZmanis = sunriseMishor && sunsetMishor &&
                Zmanim.getShaaZmanisFromSunTimes(suntimesMishor);
            shaaZmanis90 = sunriseMishor && sunsetMishor &&
                Zmanim.getShaaZmanisFromSunTimes(suntimesMishor, 90);

            AppUtils.zmanTimesCache.push({ date, location, sunrise, sunset, suntimesMishor, sunriseMishor, sunsetMishor, candles, mishorNeg90, chatzos, shaaZmanis, shaaZmanis90 });
        }
        for (let zmanType of zmanTypes) {
            switch (zmanType.name) {
                case 'alos90':
                    zmanTimes.push({
                        zmanType,
                        time: mishorNeg90
                    });
                    break;
                case 'alos72':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -72)
                    });
                    break;
                case 'netzElevation':
                    zmanTimes.push({
                        zmanType,
                        time: sunrise
                    });
                    break;
                case 'netzMishor':
                    zmanTimes.push({
                        zmanType,
                        time: sunriseMishor
                    });
                    break;
                case 'szksMga':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(mishorNeg90, Math.floor(shaaZmanis90 * 3))
                    });
                    break;
                case 'szksGra':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, Math.floor(shaaZmanis * 3))
                    });
                    break;
                case 'sztMga':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(mishorNeg90, Math.floor(shaaZmanis90 * 4))
                    });
                    break;
                case 'sztGra':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, Math.floor(shaaZmanis * 4))
                    });
                    break;
                case 'chatzos':
                    zmanTimes.push({
                        zmanType,
                        time: chatzos
                    });
                    break;
                case 'minGed':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(chatzos, (shaaZmanis * 0.5))
                    });
                    break;
                case 'minKet':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, (shaaZmanis * 9.5))
                    });
                    break;
                case 'plag':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, (shaaZmanis * 10.75))
                    });
                    break;
                case 'candles':
                    zmanTimes.push({
                        zmanType,
                        time: candles
                    });
                    break;
                case 'shkiaMishor':
                    zmanTimes.push({
                        zmanType,
                        time: sunsetMishor
                    });
                    break;
                case 'shkiaElevation':
                    zmanTimes.push({
                        zmanType,
                        time: sunset
                    });
                    break;
                case 'tzais45':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 45)
                    });
                    break;
                case 'tzais72':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 72)
                    });
                    break;
                case 'tzais72Zmaniot':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, (shaaZmanis * 1.2))
                    });
                    break;
                case 'tzais72ZmaniotMA':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, (shaaZmanis90 * 1.2))
                    });
                    break;
            }
        }
        return zmanTimes;
    }
}