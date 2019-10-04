import Utils from './JCal/Utils';
import Zmanim from './JCal/Zmanim';
import Location from './JCal/Location';
import Settings from './Settings';
import NavigationBarAndroid from './NavigationBar';
import jDate from './JCal/jDate';

export const DaysOfWeek = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SHABBOS: 6,
});

export const WhichDaysFlags = Object.freeze({
    SUNDAY: 1,
    MONDAY: 2,
    TUESDAY: 4,
    WEDNESDAY: 8,
    THURSDAY: 16,
    FRIDAY: 32,
    SHABBOS: 64,
    YOMTOV: 128,
});

export default class AppUtils {
    static zmanTimesCache = [];

    /**
     * Returns the date corrected time of the given zmanim on the given date at the given location
     * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
     * @param {Date} sdate
     * @param {jDate} jdate
     * @param {{hour : Number, minute :Number, second: Number }} time
     * @param {Settings} settings
     * @returns {[{zmanType:{id:Number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String },time:{hour : Number, minute :Number, second: Number }, isTomorrow:Boolean}]}
     */
    static getCorrectZmanTimes(sdate, jdate, time, settings) {
        const correctedTimes = [],
            zmanTypes = settings.zmanimToShow,
            location = settings.location,
            zmanTimes = AppUtils.getZmanTimes(
                zmanTypes,
                sdate,
                jdate,
                location
            ),
            TomorrowTimes = AppUtils.getZmanTimes(
                zmanTypes,
                Utils.addDaysToSdate(sdate, 1),
                jdate.addDays(1),
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
     * @param {[{id:number,offset:?number, whichDaysFlags:?Number,desc:?String,eng:?String,heb:?String}]} zmanTypes An array of ZmanTypes to get the zman for.
     * @param {Date} date The secular date to get the zmanim for
     * @param {jDate} jdate The jewish date to get the zmanim for
     * @param {Location} location The location for which to get the zmanim
     * @returns{[{zmanType:{id:number,offset:?number,desc:String,eng:String,heb:String },time:{hour:Number,minute:Number,second:Number}}]}
     */
    static getZmanTimes(zmanTypes, date, jdate, location) {
        const mem = AppUtils.zmanTimesCache.find(
                z =>
                    Utils.isSameSdate(z.date, date) &&
                    z.location.Name === location.Name
            ),
            zmanTimes = [],
            whichDay = AppUtils.getWhichDays(date, jdate, location);
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
            const offset =
                zmanType.offset &&
                ((!zmanType.whichDaysFlags) || (zmanType.whichDaysFlags & whichDay))
                    ? zmanType.offset
                    : 0;
            switch (zmanType.id) {
                case 0: // chatzosNight
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(chatzos, 720 + offset),
                    });
                    break;
                case 1: // alos90
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(mishorNeg90, offset)
                            : mishorNeg90,
                    });
                    break;
                case 2: // alos72
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -72 + offset),
                    });
                    break;
                case 3: //talisTefillin
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -36 + offset),
                    });
                    break;
                case 4: //netzElevation
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(sunrise, offset)
                            : sunrise,
                    });
                    break;
                case 5: // netzMishor:
                    zmanTimes.push({
                        zmanType,
                        time: offset
                        ? Utils.addMinutes(sunriseMishor, offset)
                        : sunriseMishor,
                    });
                    break;
                case 6: //szksMga
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            mishorNeg90,
                            Math.floor(shaaZmanisMga * 3) + offset
                        ),
                    });
                    break;
                case 7: //szksGra
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunriseMishor,
                            Math.floor(shaaZmanis * 3) + offset
                        ),
                    });
                    break;
                case 8: // sztMga
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            mishorNeg90,
                            Math.floor(shaaZmanisMga * 4) + offset
                        ),
                    });
                    break;
                case 9: //sztGra
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunriseMishor,
                            Math.floor(shaaZmanis * 4) + offset
                        ),
                    });
                    break;
                case 10: //chatzos
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(chatzos, offset)
                            : chatzos,
                    });
                    break;
                case 11: //minGed
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            chatzos,
                            shaaZmanis * 0.5 + offset
                        ),
                    });
                    break;
                case 12: //minKet
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunriseMishor,
                            shaaZmanis * 9.5 + offset
                        ),
                    });
                    break;
                case 13: //plag
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunriseMishor,
                            shaaZmanis * 10.75 + offset
                        ),
                    });
                    break;
                case 14: //shkiaMishor
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(sunsetMishor, offset)
                            : sunsetMishor,
                    });
                    break;
                case 15: //shkiaElevation
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(sunset, offset)
                            : sunset,
                    });
                    break;
                case 16: // tzais45
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 45 + offset),
                    });
                    break;
                case 17: //tzais50
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 50 + offset),
                    });
                    break;
                case 18: //tzais72
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 72 + offset),
                    });
                    break;
                case 19: //tzais72Zmaniot
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunset,
                            shaaZmanis * 1.2 + offset
                        ),
                    });
                    break;
                case 20: //tzais72ZmaniotMA
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(
                            sunset,
                            shaaZmanisMga * 1.2 + offset
                        ),
                    });
                    break;
            }
        }
        return zmanTimes;
    }
    /**
     * Get the WhichDaysFlags for the given secular date
     * @param {Date} date
     * @param {jDate} jdate
     * @param {Location} location
     */
    static getWhichDays(date, jdate, location) {
        if (jdate.isYomTov(location.Israel)) {
            return WhichDaysFlags.YOMTOV;
        }
        switch (date.getDay()) {
            case DaysOfWeek.SUNDAY:
                return WhichDaysFlags.SUNDAY;
            case DaysOfWeek.MONDAY:
                return WhichDaysFlags.MONDAY;
            case DaysOfWeek.TUESDAY:
                return WhichDaysFlags.TUESDAY;
            case DaysOfWeek.WEDNESDAY:
                return WhichDaysFlags.WEDNESDAY;
            case DaysOfWeek.THURSDAY:
                return WhichDaysFlags.THURSDAY;
            case DaysOfWeek.FRIDAY:
                return WhichDaysFlags.FRIDAY;
            case DaysOfWeek.SHABBOS:
                return WhichDaysFlags.SHABBOS;
        }
        return 0;
    }

    /**
     * Returns the zmanim necessary for showing basic shul notifications: chatzosHayom, chatzosHalayla, alos
     * @param {Date} sdate
     * @param {Location} location
     * @returns {{chatzosHayom:{hour:Number,minute:Number,second:Number}, chatzosHalayla:{hour:Number,minute:Number,second:Number}, alos:{hour:Number,minute:Number,second:Number}, shkia:{hour:Number,minute:Number,second:Number} }}
     */
    static getBasicShulZmanim(sdate, jdate, location) {
        const zmanim = AppUtils.getZmanTimes(
            [
                { id: 10 }, //Chatzos hayom
                { id: 2 }, //alos90
                { id: 15 }, //shkiaElevation,
            ],
            sdate,
            jdate,
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

    /**
     * Compares two zmanim for showing to see if they are the same
     * @param {{id:Number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman1
     * @param {{id:Number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman2
     */
    static IsSameZmanToShow(zman1, zman2) {
        return (
            zman1.id === zman2.id &&
            zman1.desc === zman2.desc &&
            zman1.eng === zman2.eng &&
            zman1.heb === zman2.heb &&
            (zman1.offset || 0) === (zman2.offset || 0) &&
            (zman1.whichDaysFlags || 0) === (zman2.whichDaysFlags || 0)
        );
    }
}
