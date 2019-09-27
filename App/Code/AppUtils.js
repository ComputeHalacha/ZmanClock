import Utils from './JCal/Utils';
import Zmanim from './JCal/Zmanim';
import Location from './JCal/Location';
import Settings from './Settings';
import NavigationBarAndroid from './NavigationBar';

export const DaysOfWeek = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SHABBOS: 6,
});

export default class AppUtils {
    static zmanTimesCache = [];

    /**
     * Returns the date corrected time of the given zmanim on the given date at the given location
     * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
     * @param {Date} sdate
     * @param {{hour : Number, minute :Number, second: Number }} time
     * @param {Settings} settings
     * @returns {[{zmanType:{name:String, desc: String, eng: String, heb: String },time:{hour : Number, minute :Number, second: Number }, isTomorrow:Boolean}]}
     */
    static getCorrectZmanTimes(sdate, time, settings) {
        const correctedTimes = [],
            zmanTypes = settings.zmanimToShow,
            location = settings.location,
            zmanTimes = AppUtils.getZmanTimes(zmanTypes, sdate, location),
            TomorrowTimes = AppUtils.getZmanTimes(
                zmanTypes,
                Utils.addDaysToSdate(sdate, 1),
                location
            );

        for (let zt of zmanTimes) {
            let oTime = zt.time,
                isTomorrow = false,
                diff = Utils.timeDiff(time, oTime, true);
            if (
                diff.sign < 1 &&
                Utils.totalMinutes(diff) >= settings.minToShowPassedZman
            ) {
                oTime = TomorrowTimes.find(t => t.zmanType === zt.zmanType)
                    .time;
                isTomorrow = true;
            }
            correctedTimes.push({
                zmanType: zt.zmanType,
                time: oTime,
                isTomorrow,
            });
        }
        return correctedTimes.sort(
            (a, b) =>
                (a.isTomorrow ? 1 : -1) - (b.isTomorrow ? 1 : -1) ||
                Utils.totalSeconds(a.time) - Utils.totalSeconds(b.time)
        );
    }

    /**
     * Gets the zmanim for all the types in the given list.
     * @param {[{name:String,desc:?String,eng:?String,heb:?String}]} zmanTypes An array of ZmanTypes to get the zman for.
     * @param {Date} date The secular date to get the zmanim for
     * @param {Location} location The location for which to get the zmanim
     * @returns{[{zmanType:{name:String,desc:String,eng:String,heb:String },time:{hour:Number,minute:Number,second:Number}}]}
     */
    static getZmanTimes(zmanTypes, date, location) {
        const mem = AppUtils.zmanTimesCache.find(
                z =>
                    Utils.isSameSdate(z.date, date) &&
                    z.location.Name === location.Name
            ),
            zmanTimes = [];
        let sunrise,
            sunset,
            suntimesMishor,
            sunriseMishor,
            sunsetMishor,
            mishorNeg90,
            chatzos,
            shaaZmanis,
            shaaZmanisMga;
        if (mem) {
            sunrise = mem.sunrise;
            sunset = mem.sunset;
            suntimesMishor = mem.suntimesMishor;
            sunriseMishor = mem.sunriseMishor;
            sunsetMishor = mem.sunsetMishor;
            mishorNeg90 = mem.mishorNeg90;
            chatzos = mem.chatzos;
            shaaZmanis = mem.shaaZmanis;
            shaaZmanisMga = mem.shaaZmanisMga;
        } else {
            const suntimes = Zmanim.getSunTimes(date, location, true);
            sunrise = suntimes.sunrise;
            sunset = suntimes.sunset;
            suntimesMishor = Zmanim.getSunTimes(date, location, false);
            sunriseMishor = suntimesMishor.sunrise;
            sunsetMishor = suntimesMishor.sunset;
            mishorNeg90 = Utils.addMinutes(sunriseMishor, -90);
            chatzos =
                sunriseMishor &&
                sunsetMishor &&
                Zmanim.getChatzosFromSuntimes(suntimesMishor);
            shaaZmanis =
                sunriseMishor &&
                sunsetMishor &&
                Zmanim.getShaaZmanisFromSunTimes(suntimesMishor);
            shaaZmanisMga =
                sunriseMishor &&
                sunsetMishor &&
                Zmanim.getShaaZmanisMga(suntimesMishor, true);

            AppUtils.zmanTimesCache.push({
                date,
                location,
                sunrise,
                sunset,
                suntimesMishor,
                sunriseMishor,
                sunsetMishor,
                mishorNeg90,
                chatzos,
                shaaZmanis,
                shaaZmanisMga,
            });
        }
        for (let zmanType of zmanTypes) {
            switch (zmanType.name) {
                case 'chatzosNight':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(chatzos, 720),
                    });
                    break;
                case 'alos90':
                    zmanTimes.push({
                        zmanType,
                        time: mishorNeg90,
                    });
                    break;
                case 'alos72':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -72),
                    });
                    break;
                case 'talisTefillin':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -36),
                    });
                    break;
                case 'netzElevation':
                    zmanTimes.push({
                        zmanType,
                        time: sunrise,
                    });
                    break;
                case 'netzMishor':
                    zmanTimes.push({
                        zmanType,
                        time: sunriseMishor,
                    });
                    break;
                case 'szksMga':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            mishorNeg90,
                            Math.floor(shaaZmanisMga * 3)
                        ),
                    });
                    break;
                case 'szksGra':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunriseMishor,
                            Math.floor(shaaZmanis * 3)
                        ),
                    });
                    break;
                case 'sztMga':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            mishorNeg90,
                            Math.floor(shaaZmanisMga * 4)
                        ),
                    });
                    break;
                case 'sztGra':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunriseMishor,
                            Math.floor(shaaZmanis * 4)
                        ),
                    });
                    break;
                case 'chatzos':
                    zmanTimes.push({
                        zmanType,
                        time: chatzos,
                    });
                    break;
                case 'minGed':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(chatzos, shaaZmanis * 0.5),
                    });
                    break;
                case 'minKet':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, shaaZmanis * 9.5),
                    });
                    break;
                case 'plag':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunriseMishor,
                            shaaZmanis * 10.75
                        ),
                    });
                    break;
                case 'shkiaMishor':
                    zmanTimes.push({
                        zmanType,
                        time: sunsetMishor,
                    });
                    break;
                case 'shkiaElevation':
                    zmanTimes.push({
                        zmanType,
                        time: sunset,
                    });
                    break;
                case 'tzais45':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 45),
                    });
                    break;
                case 'tzais50':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 50),
                    });
                    break;
                case 'tzais72':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 72),
                    });
                    break;
                case 'tzais72Zmaniot':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, shaaZmanis * 1.2),
                    });
                    break;
                case 'tzais72ZmaniotMA':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, shaaZmanisMga * 1.2),
                    });
                    break;
            }
        }
        return zmanTimes;
    }

    /**
     * Returns the zmanim necessary for showing basic shul notifications: chatzosHayom, chatzosHalayla, alos
     * @param {Date} sdate
     * @param {Location} location
     * @returns {{chatzosHayom:{hour:Number,minute:Number,second:Number}, chatzosHalayla:{hour:Number,minute:Number,second:Number}, alos:{hour:Number,minute:Number,second:Number}, shkia:{hour:Number,minute:Number,second:Number} }}
     */
    static getBasicShulZmanim(sdate, location) {
        const zmanim = AppUtils.getZmanTimes(
            [
                { name: 'chatzos' },
                { name: 'alos90' },
                { name: 'shkiaElevation' },
            ],
            sdate,
            location
        );
        return {
            chatzosHayom: zmanim[0].time,
            chatzosHalayla: Utils.addMinutes(zmanim[0].time, 720),
            alos: zmanim[1].time,
            shkia: zmanim[2].time,
        };
    }

    /**
     * Show Android settings to switch the Home app.
     * This allows the developer to access the default Android home app.
     * The user is only allowed to exit the app this way if they enter the "password" -
     * which is accomplished by changing the app settings to the required values (see code below).
     * @param {{ location:Location, showNotifications:Boolean, numberOfItemsToShow:Number, minToShowPassedZman:Number }} settings
     */
    static changeSystemHomeSettings(settings) {
        const {
            location,
            showNotifications,
            numberOfItemsToShow,
            minToShowPassedZman,
        } = settings;
        if (
            location.Name === 'פומפדיתא' &&
            !showNotifications &&
            numberOfItemsToShow === 9 &&
            minToShowPassedZman === 57
        ) {
            NavigationBarAndroid.changeSystemHomeSettings();
        }
    }
}
