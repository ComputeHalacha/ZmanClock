import Utils from './JCal/Utils';
import Zmanim from './JCal/Zmanim';
import Location from './JCal/Location';
import Settings from './Settings';
import jDate from './JCal/jDate';

export default class AppUtils {
    static zmanTimesCache = [];

    /**
    * Returns the date corrected time of the given zmanim on the given date at the given location
    * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
    * @param {Date} sdate
    * @param {{hour : Number, minute :Number, second: Number }} time
    * @param {Settings} settings
    * @returns {[{zmanType:{name:String, decs: String, eng: String, heb: String },time:{hour : Number, minute :Number, second: Number }, isTommorrow:Boolean}]}
    */
    static getCorrectZmanTimes(sdate, time, settings) {
        const correctedTimes = [],
            zmanTypes = settings.zmanimToShow,
            location = settings.location,
            zmanTimes = AppUtils.getZmanTimes(zmanTypes, sdate, location),
            tommorowTimes = AppUtils.getZmanTimes(zmanTypes, Utils.addDaysToSdate(sdate, 1), location);

        for (let zt of zmanTimes) {
            let oTime = zt.time,
                isTommorrow = false,
                diff = Utils.timeDiff(time, oTime, true);
            if (diff.sign < 1 && Utils.totalMinutes(diff) >= settings.minToShowPassedZman) {
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
     * @param {[{name:String,decs:?String,eng:?String,heb:?String}]} zmanTypes An array of ZmanTypes to get the zman for.
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
            const suntimes = Zmanim.getSunTimes(date, location, true);
            sunrise = suntimes.sunrise;
            sunset = suntimes.sunset;
            suntimesMishor = Zmanim.getSunTimes(date, location, false);
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

    /**
     * Returns the zmanim nessesary for showing basic shul notifications: chatzosHayom, chatzosHalayla, alos
     * @param {Date} sdate
     * @param {Location} location
     * @returns {{chatzosHayom:{hour:Number,minute:Number,second:Number}, chatzosHalayla:{hour:Number,minute:Number,second:Number}, alos:{hour:Number,minute:Number,second:Number} }}
     */
    static getBasicShulZmanim(sdate, location) {
        const zmanim = AppUtils.getZmanTimes([
            { name: 'chatzos' },
            { name: 'alos90' },
            { name: 'tzais45' }],
            sdate,
            location);
        return {
            chatzosHayom: zmanim[0].time,
            chatzosHalayla: Utils.addMinutes(zmanim[0].time, 720),
            alos: zmanim[1].time
        };
    }

    /**
     *
     * @param {jDate} jdate
     * @param {Location} location
     */
    static getNotifications(jdate, sdate, time, location) {
        const notifications = [],
            month = jdate.Month,
            day = jdate.Day,
            dow = jdate.DayOfWeek,
            { chatzosHayom, chatzosHalayla, alos } = AppUtils.getBasicShulZmanim(sdate, location),
            isAfterChatzosHayom = Utils.totalSeconds(chatzosHayom) < Utils.totalSeconds(time),
            isAfterChatzosHalayla = Utils.totalSeconds(chatzosHalayla) < Utils.totalSeconds(time) ||
                chatzosHalayla.hour > 12 && time.Hour < 12, //Chatzos is before 12 AM and time is after 12 AM
            isAfterAlos = Utils.totalSeconds(alos) < Utils.totalSeconds(time),
            isYomTov = (month === 1 && day > 14 && day < 22) ||
                (month === 3 && day === 6) ||
                (month === 7 && [1, 2, 10, 15, 16, 17, 18, 19, 20, 21, 22].includes(day));
        let noTachnun = ((dow === 5 || day === 29) && isAfterChatzosHayom);

        if (dow === 6 && !isYomTov) {
            notifications.push('קה"ת פרשת ' +
                jdate.getSedra(true).map((s) => s.heb).join(' - '));
        }
        if (dow === 0 && !isAfterAlos) {
            notifications.push(
                isYomTov
                    ? 'ותודיעינו'
                    : 'אתה חוננתנו');
        }
        else if (dow !== 6 && !isAfterAlos && ((month === 1 && (day === 16 || day === 22)) ||
            (month === 3 && day === 7) ||
            (month === 7 && [3, 11, 16, 23].includes(day)))) {
            notifications.push('אתה חוננתנו');
        }
        if ((month !== 7 && day === 1) || day === 30) {
            noTachnun = true;
            notifications.push('ראש חודש');
            notifications.push('יעלה ויבא');
            if (isAfterAlos) {
                notifications.push('חצי הלל');
                if (!isAfterChatzosHayom)
                    notifications.push('א"א למנצח');
            }

        }
        else if (month !== 6 &&
            ((dow < 6 && day === 29) || (dow === 4 && day === 28)) &&
            isAfterChatzosHayom) {
            notifications.push('יו"כ קטן');
        }
        switch (month) {
            case 1: //Nissan
                noTachnun = true;
                if (day > 15) {
                    notifications.push('מוריד הטל');
                    if (!isAfterAlos)
                        notifications.push(`${Utils.toJNum(day - 15)} בעומר`);
                }
                if (dow !== 6 && day > 15 && day !== 21) {
                    notifications.push('ותן ברכה');
                }
                if (dow !== 6 && [14, 16, 17, 18, 19, 20].includes(day)) {
                    notifications.push('א"א מזמור לתודה');
                    notifications.push('א"א למנצח');
                }
                if (day === 15) {
                    notifications.push('יום טוב');
                    if (isAfterAlos) {
                        notifications.push('הלל השלם');
                        if (isAfterChatzosHayom) {
                            notifications.push('מוריד הטל');
                        }
                    }
                }
                else if ([16, 17, 18, 19, 20, 21].includes(day)) {
                    if (day === 21) {
                        notifications.push('שביעי של פםח');
                        if (isAfterAlos)
                            notifications.push('יזכור');
                    }
                    else {
                        notifications.push('חול המועד');
                        notifications.push('יעלה ויבא');
                        if (!isAfterChatzosHayom)
                            notifications.push('א"א למנצח');
                    }
                    if (isAfterAlos)
                        notifications.push('חצי הלל');
                }
                if (dow === 6 && [15, 16, 17, 18, 19, 20].includes(day)) {
                    notifications.push('שיר השירים');
                }
                break;
            case 2: //Iyar
                if (!isAfterAlos)
                    notifications.push(`${Utils.toJNum(day + 15)} בעומר`);
                if (day <= 15) {
                    notifications.push('מוריד הטל');
                    if (dow !== 6) {
                        notifications.push('ותן ברכה');
                    }
                }
                if (day === 15 ||
                    (day === 14 && isAfterChatzosHayom) ||
                    day === 18 ||
                    (day === 17 && isAfterChatzosHayom)) {
                    noTachnun = true;
                    if (day === 15)
                        notifications.push('פסח שני');
                }
                if (isAfterAlos && (dow === 1 && day > 3 && day < 13) ||
                    (dow === 4 && day > 6 && day < 14) ||
                    (dow === 1 && day > 10 && day < 18)) {
                    notifications.push('סליחות בה"ב');
                    notifications.push('אבינו מלכנו');
                }
                break;
            case 3: //Sivan
                if (day < 6 && !isAfterAlos) {
                    notifications.push(`${Utils.toJNum(day + 44)} בעומר`);
                }
                if (day < 13) {
                    noTachnun = true;
                }
                if (day === 6 && isAfterAlos) {
                    notifications.push('הלל השלם');
                    notifications.push('מגילת רות');
                    notifications.push('אקדמות');
                    notifications.push('יזכור');
                }
                break;
            case 4: //Tammuz
                if (((day === 17 && dow !== 6) || (day === 18 && dow === 0)) && isAfterAlos) {
                    if (!isAfterChatzosHayom) {
                        notifications.push('סליחות י"ז בתמוז');
                    }
                    notifications.push('אבינו מלכנו');
                    notifications.push('עננו');
                }
                break;
            case 5: //Av
                if (isAfterChatzosHayom && (day === 8 && dow !== 5)) {
                    noTachnun = true;
                }
                else if ((day === 9 && dow !== 6) || (day === 10 && dow === 0)) {
                    notifications.push('מגילת איכה');
                    if (isAfterAlos) {
                        notifications.push('קינות לתשעה באב');
                        notifications.push('עננו');
                        notifications.push('א"א למנצח');
                    }
                    noTachnun = true;
                }
                else if (isAfterChatzosHayom && day === 14) {
                    noTachnun = true;
                }
                else if (day === 15) {
                    noTachnun = true;
                }
                break;
            case 6: //Ellul
                notifications.push('לדוד ה\' אורי');
                if (dow !== 6 && isAfterChatzosHalayla && !isAfterChatzosHayom &&
                    (day >= 26 || (dow > 4 && day > 20))) {
                    notifications.push('סליחות');
                }
                if (day === 29) {
                    noTachnun = true;
                }
                break;
            case 7: //Tishrei
                if (day < 11) {
                    notifications.push('המלך הקדוש');
                    if (dow !== 6 && day !== 9) {
                        notifications.push('אבינו מלכנו');
                    }
                }
                if (day > 4 && day < 10 && dow !== 6) {
                    notifications.push('סליחות');
                    notifications.push('המלך המשפט');
                }
                if (dow === 6 && day > 2 && day < 10) {
                    notifications.push('שבת שובה');
                }
                switch (day) {
                    case 1:
                        if (dow !== 6) {
                            notifications.push('תקיעת שופר');
                            if (isAfterChatzosHayom) {
                                notifications.push('תשליך');
                            }
                        }
                        break;
                    case 2:
                        notifications.push('תקיעת שופר');
                        if (dow === 0 && isAfterChatzosHayom) {
                            notifications.push('תשליך');
                        }
                        break;
                    case 3:
                        if (dow !== 6) {
                            if (!isAfterChatzosHayom) {
                                notifications.push('סליחות צום גדליה');
                            }
                            notifications.push('עננו');
                            notifications.push('המלך המשפט');
                        }
                        break;
                    case 4:
                        if (dow === 0) {
                            if (!isAfterChatzosHayom) {
                                notifications.push('סליחות צום גדליה');
                            }
                            notifications.push('עננו');
                        }
                        else if (dow !== 6) {
                            notifications.push('המלך המשפט');
                        }
                        break;
                    case 9:
                        if ((!isAfterChatzosHayom) && dow === 5) {
                            notifications.push('אבינו מלכנו');
                        }
                        if (isAfterChatzosHayom) {
                            notifications.push('ודוי בעמידה');
                        }
                        else {
                            notifications.push('א"א מזמור לתודה');
                            notifications.push('א"א למנצח');
                        }

                        noTachnun = true;
                        break;
                    case 10:
                        notifications.push('לפני ה\' תטהרו');
                        if (isAfterAlos) {
                            notifications.push('יזכור');
                        }
                        break;
                    case 15:
                        if (isAfterAlos) {
                            notifications.push('הלל השלם');
                            if (dow !== 6) {
                                notifications.push('קה קלי');
                            }
                        }
                        break;
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                        notifications.push('חול המועד');
                        notifications.push('יעלה ויבא');
                        if (isAfterAlos) {
                            notifications.push('הושענות');
                            notifications.push('הלל השלם');
                        }
                        break;
                    case 21:
                        notifications.push('הושעה רבה');
                        notifications.push('יעלה ויבא');
                        if (!isAfterAlos) {
                            notifications.push('משנה תורה');
                        }
                        else {
                            notifications.push('הושענות');
                            notifications.push('הלל השלם');
                        }
                        break;
                    case 22:
                        notifications.push('שמ"ע - שמח"ת');
                        if (isAfterAlos) {
                            notifications.push('הלל השלם');
                            notifications.push('יזכור');
                            notifications.push('משיב הרוח ומוריד הגשם');
                        }
                        break;
                }
                if (day <= 22) {
                    notifications.push('לדוד ה\' אורי');
                }
                else if (day >= 10) {
                    noTachnun = true;
                }
                else if (day > 22) {
                    notifications.push('משיב הרוח ומוריד הגשם');
                }
                break;
            case 8: //Cheshvan
                if (isAfterAlos && (dow === 1 && day > 3 && day < 13) ||
                    (dow === 4 && day > 6 && day < 14) ||
                    (dow === 1 && day > 10 && day < 18)) {
                    notifications.push('סליחות בה"ב');
                    notifications.push('אבינו מלכנו');
                }
                if (day <= 22) {
                    notifications.push('משיב הרוח ומוריד הגשם');
                }
                if (day >= 7) {
                    notifications.push('ותן טל ומטר');
                }
                break;
            case 9: //Kislev
                if (day <= 7) {
                    notifications.push('ותן טל ומטר');
                }
                else if (day === 24 && dow !== 6 && isAfterChatzosHayom) {
                    noTachnun = true;
                }
                else if (day >= 25) {
                    noTachnun = true;
                    notifications.push('על הניסים');
                    if (isAfterAlos) {
                        notifications.push('הלל השלם');
                        if (!isAfterChatzosHayom)
                            notifications.push('א"א למנצח');
                    }
                }
                break;
            case 10: //Teves
                if (day <= (jDate.isShortKislev(jdate.Year) ? 3 : 2)) {
                    noTachnun = true;
                    notifications.push('על הניסים');
                    if (isAfterAlos) {
                        notifications.push('הלל השלם');
                        if (!isAfterChatzosHayom)
                            notifications.push('א"א למנצח');
                    }
                }
                else if (day === 10 && isAfterAlos) {
                    if (!isAfterChatzosHayom) {
                        notifications.push('סליחות עשרה בטבת');
                    }
                    notifications.push('אבינו מלכנו');
                    notifications.push('עננו');
                }
                break;
            case 11: //Shvat
                if (day === 14 && isAfterChatzosHayom)
                    noTachnun = true;
                if (day === 15) {
                    noTachnun = true;
                    notifications.push('ט"ו בשבט');
                }
                break;
            case 12:
            case 13:
                if (month === 12 && jDate.isJdLeapY(jdate.Year)) { //Adar Rishon in a leap year
                    if ((day === 13 && isAfterChatzosHayom) || [14, 15].includes(day)) {
                        noTachnun = true;
                        notifications.push('א"א למנצח');
                    }
                }
                else { //The "real" Adar: the only one in a non-leap-year or Adar Sheini
                    if (isAfterAlos && (day === 11 && dow === 4) || (day === 13 && dow !== 6)) {
                        if (!isAfterChatzosHayom) {
                            notifications.push('סליחות תענית אסתר');
                        }
                        notifications.push('אבינו מלכנו');
                        notifications.push('עננו');
                    }
                    else {
                        //Only ירושלים says על הניסים on ט"ו
                        const isYerushalayim = (location.Name === 'ירושלים');

                        if (day === 14) {
                            noTachnun = true;
                            notifications.push('א"א למנצח');
                            if (!isYerushalayim) {
                                notifications.push('על הניסים');
                                notifications.push('מגילת אסתר');
                            }
                        }
                        else if (day === 15) {
                            noTachnun = true;
                            notifications.push('א"א למנצח');
                            if (isYerushalayim) {
                                notifications.push('על הניסים');
                                notifications.push('מגילת אסתר');
                            }
                            else if (['טבריה', 'יפו', 'עכו', 'צפת', 'באר שבע', 'חיפה', 'באר שבע', 'בית שאן', 'לוד']
                                .includes(location.Name)) {
                                notifications.push('(מגילת אסתר)');
                            }
                        }
                    }
                }
                break;
        }
        if (noTachnun && isAfterAlos && dow !== 6 && !isYomTov) {
            notifications.push('א"א תחנון');
        }
        return notifications;
    }
}