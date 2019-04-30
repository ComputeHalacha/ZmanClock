import Utils from './JCal/Utils';
import Zmanim from './JCal/Zmanim';
import Location from './JCal/Location';
import Settings from './Settings';
import jDate from './JCal/jDate';
import Molad from './JCal/Molad';
import PirkeiAvos from './JCal/PirkeiAvos';
import NavigationBarAndroid from './NavigationBar';

const DaysOfWeek = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SHABBOS: 6
});

export default class AppUtils {
    static zmanTimesCache = [];

    /**
    * Returns the date corrected time of the given zmanim on the given date at the given location
    * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
    * @param {Date} sdate
    * @param {{hour : Number, minute :Number, second: Number }} time
    * @param {Settings} settings
    * @returns {[{zmanType:{name:String, desc: String, eng: String, heb: String },time:{hour : Number, minute :Number, second: Number }, isTommorrow:Boolean}]}
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
     * @param {[{name:String,desc:?String,eng:?String,heb:?String}]} zmanTypes An array of ZmanTypes to get the zman for.
     * @param {Date} date The secular date to get the zmanim for
     * @param {Location} location The location for which to get the zmanim
     * @returns{[{zmanType:{name:String,desc:String,eng:String,heb:String },time:{hour:Number,minute:Number,second:Number}}]}
     */
    static getZmanTimes(zmanTypes, date, location) {
        const mem = AppUtils.zmanTimesCache.find(z => Utils.isSameSdate(z.date, date) && z.location.Name === location.Name),
            zmanTimes = [];
        let sunrise, sunset, suntimesMishor, sunriseMishor, sunsetMishor, mishorNeg90, chatzos, shaaZmanis, shaaZmanisMga;
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
        }
        else {
            const suntimes = Zmanim.getSunTimes(date, location, true);
            sunrise = suntimes.sunrise;
            sunset = suntimes.sunset;
            suntimesMishor = Zmanim.getSunTimes(date, location, false);
            sunriseMishor = suntimesMishor.sunrise;
            sunsetMishor = suntimesMishor.sunset;
            mishorNeg90 = Utils.addMinutes(sunriseMishor, -90);
            chatzos = sunriseMishor && sunsetMishor &&
                Zmanim.getChatzosFromSuntimes(suntimesMishor);
            shaaZmanis = sunriseMishor && sunsetMishor &&
                Zmanim.getShaaZmanisFromSunTimes(suntimesMishor);
            shaaZmanisMga = sunriseMishor && sunsetMishor &&
                Zmanim.getShaaZmanisMga(suntimesMishor, true);

            AppUtils.zmanTimesCache.push({ date, location, sunrise, sunset, suntimesMishor, sunriseMishor, sunsetMishor, mishorNeg90, chatzos, shaaZmanis, shaaZmanisMga });
        }
        for (let zmanType of zmanTypes) {
            switch (zmanType.name) {
                case 'chatzosNight':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(chatzos, 720)
                    });
                    break;
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
                case 'talisTefillin':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -36)
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
                        time: Utils.addMinutes(mishorNeg90, Math.floor(shaaZmanisMga * 3))
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
                        time: Utils.addMinutes(mishorNeg90, Math.floor(shaaZmanisMga * 4))
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
                case 'tzais50':
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 50)
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
                        time: Utils.addMinutes(sunset, (shaaZmanisMga * 1.2))
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
     * @returns {{chatzosHayom:{hour:Number,minute:Number,second:Number}, chatzosHalayla:{hour:Number,minute:Number,second:Number}, alos:{hour:Number,minute:Number,second:Number}, shkia:{hour:Number,minute:Number,second:Number} }}
     */
    static getBasicShulZmanim(sdate, location) {
        const zmanim = AppUtils.getZmanTimes([
            { name: 'chatzos' },
            { name: 'alos90' },
            { name: 'shkiaElevation' },
        ],
            sdate,
            location);
        return {
            chatzosHayom: zmanim[0].time,
            chatzosHalayla: Utils.addMinutes(zmanim[0].time, 720),
            alos: zmanim[1].time,
            shkia: zmanim[2].time
        };
    }

    /**
     * Get shul notifications for the given date and location
     * @param {jDate} jdate
     * @param {Date} sdate
     * @param {{hour : Number, minute :Number, second: Number }} time
     * @param {Location} location
     */
    static getNotifications(jdate, sdate, time, location) {
        const notifications = [],
            month = jdate.Month,
            day = jdate.Day,
            dow = jdate.DayOfWeek,
            { chatzosHayom, chatzosHalayla, alos, shkia } = AppUtils.getBasicShulZmanim(sdate, location),
            isAfterChatzosHayom = Utils.isTimeAfter(chatzosHayom, time),
            isAfterChatzosHalayla = Utils.isTimeAfter(chatzosHalayla, time) ||
                (chatzosHalayla.hour > 12 && time.hour < 12), //Chatzos is before 0:00 and time is after 0:00
            isAfterAlos = Utils.isTimeAfter(alos, time),
            isAfterShkia = Utils.isTimeAfter(shkia, time),
            isDaytime = isAfterAlos && !isAfterShkia,
            isNightTime = !isDaytime,
            isMorning = isDaytime && !isAfterChatzosHayom,
            isAfternoon = isDaytime && isAfterChatzosHayom,
            isYomTov = (month === 1 && day > 14 && day < 22) ||
                (month === 3 && day === 6) ||
                (month === 7 && [1, 2, 10, 15, 16, 17, 18, 19, 20, 21, 22].includes(day)),
            isLeapYear = jDate.isJdLeapY(jdate.Year),
            noTachnun = isAfternoon && (dow === DaysOfWeek.FRIDAY || day === 29),
            dayInfo = {
                jdate, sdate, month, day, dow, isAfterChatzosHayom,
                isAfterChatzosHalayla, isAfterAlos,
                isAfterShkia, isDaytime, isNightTime, isMorning,
                isAfternoon, isYomTov, isLeapYear, noTachnun, location
            };
        if (dow === DaysOfWeek.SHABBOS) {
            getShabbosNotifications(notifications, dayInfo);
        }
        else {
            getWeekDayNotifications(notifications, dayInfo);
        }
        getAroundTheYearNotifications(notifications, dayInfo);

        if (dayInfo.noTachnun && isDaytime && !isYomTov) {
            if (dow !== DaysOfWeek.SHABBOS) {
                notifications.push('א"א תחנון');
            }
            else if (isAfternoon) {
                notifications.push('א"א צדקתך');
            }
            else if (!((month === 1 && day > 21) ||
                (month === 2) ||
                (month === 3 && day < 6))) {
                notifications.push('א"א אב הרחמים');
            }
        }

        //return only unique values
        return [...new Set(notifications)];
    }
    /**
     * Show Android settings to switch the Home app.
     * This allows the developer to access the default Android home app.
     * The user is only allowed to exit the app this way if they enter the "password" -
     * which is accomplished by changing the app settings to the required values (see code below).
     * @param {{ location:Location, showNotifications:Boolean, numberOfItemsToShow:Number, minToShowPassedZman:Number }} settings
     */
    static changeSystemHomeSettings(settings) {
        const { location, showNotifications, numberOfItemsToShow, minToShowPassedZman } = settings;
        if (location.Name === 'פומפדיתא' &&
            (!showNotifications) &&
            numberOfItemsToShow === 9 &&
            minToShowPassedZman === 57) {
            NavigationBarAndroid.changeSystemHomeSettings();
        }
    }
}

function getShabbosNotifications(notifications, dayInfo) {
    const { month, day, isLeapYear, isMorning, isYomTov, jdate, isDaytime, isAfternoon } = dayInfo;
    if (month === 1 && day > 7 && day < 15) {
        notifications.push('שבת הגדול');
    }
    else if (month === 7 && day > 2 && day < 10) {
        notifications.push('שבת שובה');
    }
    else if (month === 5 && day > 2 && day < 10) {
        notifications.push('שבת חזון');
    }
    else if ((month === (isLeapYear ? 12 : 11) && day > 23 && day < 30) ||
        (month === (isLeapYear ? 13 : 12) && day === 1)) {
        notifications.push('פרשת שקלים');
    }
    else if (month === (isLeapYear ? 13 : 12) && day > 7 && day < 14) {
        notifications.push('פרשת זכור');
    }
    else if (month === (isLeapYear ? 13 : 12) && day > 16 && day < 24) {
        notifications.push('פרשת פרה');
    }
    else if ((month === (isLeapYear ? 13 : 12) && day > 23 && day < 30) ||
        (month === 1 && day === 1)) {
        notifications.push('פרשת החודש');
    }
    if (isMorning && !isYomTov) {
        notifications.push('קה"ת פרשת ' +
            jdate.getSedra(true).toStringHeb());
        //All months but Tishrei have Shabbos Mevarchim on the Shabbos before Rosh Chodesh
        if (month !== 6 && day > 22 && day < 30) {
            const nextMonth = jdate.addMonths(1);
            notifications.push('המולד יהיה ב' +
                Molad.getStringHeb(nextMonth.Year, nextMonth.Month));
            notifications.push('מברכים החודש');
        }
    }
    //Rosh Chodesh
    if ((month !== 7 && day === 1) || day === 30) {
        notifications.push('ראש חודש');
        notifications.push('יעלה ויבא');
        //Rosh Chodesh Teves is during Chanuka
        if (isDaytime && month !== 10 && !(month === 9 && day === 30)) {
            notifications.push('חצי הלל');
        }
    }
    //Kriyas Hatora - Shabbos by mincha - besides for Yom Kippur
    else if (isAfternoon && !(month === 7 && day === 10)) {
        notifications.push('קה"ת במנחה פרשת ' +
            jdate.addDays(1).getSedra(true).sedras[0].heb);
    }
    if (isAfternoon &&
        ((month === 1 && day > 21) || month <= 6 &&
            (!(month === 5 && [8, 9].includes(day))))) {
        notifications.push('פרקי אבות - ' +
            PirkeiAvos.getPrakim(jdate, true).map(s =>
                `פרק ${Utils.toJNum(s)}`).join(' ו'));
    }
}

function getWeekDayNotifications(notifications, dayInfo) {
    const { isNightTime, dow, isYomTov, month, day, isMorning, jdate, location, isDaytime, isAfternoon } = dayInfo;

    //מוצאי שבת
    if (isNightTime && dow === DaysOfWeek.SUNDAY) {
        //הבדלה בתפילה for מוצאי שבת
        notifications.push(((month === 1 && day === 15) || (month === 3 && day === 6))
            ? 'ותודיעינו'
            : 'אתה חוננתנו');
        //Motzai Shabbos before Yom Tov - no ויהי נועם
        if ((month === 6 && day > 22) ||
            (month === 7 && day < 22 && day !== 3) ||
            (month === 1 && day > 8 && day < 15) ||
            (month === 3 && day < 6)) {
            notifications.push('א"א ויהי נועם');
        }
    }
    //אתה חוננתנו for מוצאי יו"ט
    else if (isNightTime &&
        ((month === 1 && (day === 16 || day === 22)) ||
            (month === 3 && day === 7) ||
            (month === 7 && [3, 11, 16, 23].includes(day)))) {
        notifications.push('אתה חוננתנו');
    }
    //Kriyas hatorah for monday and thursday
    //when it's not chol hamoed, chanuka, purim, a fast day or rosh chodesh
    if (isMorning && !isYomTov &&
        (dow === DaysOfWeek.MONDAY || dow === DaysOfWeek.THURSDAY) &&
        !hasOwnKriyasHatorah(jdate, location)) {
        notifications.push('קה"ת פרשת ' +
            jdate.getSedra(true).toStringHeb());
    }
    //Rosh Chodesh
    if ((month !== 7 && day === 1) || day === 30) {
        dayInfo.noTachnun = true;
        notifications.push('ראש חודש');
        notifications.push('יעלה ויבא');
        //Rosh Chodesh Teves is during Chanuka
        if (isDaytime && month !== 10 && !(month === 9 && day === 30)) {
            notifications.push('חצי הלל');
            if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                notifications.push('א"א למנצח');
            }
        }
    }
    //Yom Kippur Kattan
    else if (month !== 6 &&
        ((dow < DaysOfWeek.FRIDAY && day === 29) ||
            (dow === DaysOfWeek.THURSDAY && day === 28)) &&
        isAfternoon) {
        notifications.push('יו"כ קטן');
    }
}

function getAroundTheYearNotifications(notifications, dayInfo) {
    const { month, day, isNightTime, dow, isAfternoon, isDaytime, isMorning, isAfterChatzosHalayla, jdate, isLeapYear, location } = dayInfo;
    switch (month) {
        case 1: //Nissan
            dayInfo.noTachnun = true;
            if (day > 15) {
                notifications.push('מוריד הטל');
                if (isNightTime)
                    notifications.push(`${Utils.toJNum(day - 15)} בעומר`);
            }
            if (dow !== DaysOfWeek.SHABBOS && day > 15 && day !== 21) {
                notifications.push('ותן ברכה');
            }
            if (isMorning && dow !== DaysOfWeek.SHABBOS &&
                [14, 16, 17, 18, 19, 20].includes(day)) {
                notifications.push('א"א מזמור לתודה');
                if (dow !== DaysOfWeek.SHABBOS) {
                    notifications.push('א"א למנצח');
                }
            }
            if (day === 15) {
                notifications.push('יום טוב');
                notifications.push('הלל השלם');
                if (isAfternoon) {
                    notifications.push('מוריד הטל');
                }
            }
            else if ([16, 17, 18, 19, 20, 21].includes(day)) {
                if (day === 21) {
                    notifications.push('שביעי של פםח');
                    if (isDaytime)
                        notifications.push('יזכור');
                }
                else {
                    notifications.push('חול המועד');
                    notifications.push('יעלה ויבא');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS)
                        notifications.push('א"א למנצח');
                }
                if (isDaytime)
                    notifications.push('חצי הלל');
            }
            if (dow === DaysOfWeek.SHABBOS &&
                [15, 16, 17, 18, 19, 20].includes(day)) {
                notifications.push('שיר השירים');
            }
            break;
        case 2: //Iyar
            if (isNightTime)
                notifications.push(`${Utils.toJNum(day + 15)} בעומר`);
            if (day <= 15) {
                notifications.push('מוריד הטל');
                if (dow !== DaysOfWeek.SHABBOS) {
                    notifications.push('ותן ברכה');
                }
            }
            //Pesach Sheini and Lag Ba'Omer
            if (day === 15 ||
                (day === 14 && isAfternoon) ||
                day === 18 ||
                (day === 17 && isAfternoon)) {
                dayInfo.noTachnun = true;
                if (day === 15) {
                    notifications.push('פסח שני');
                }
            }
            //Baha"b
            if (isMorning &&
                ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
                    (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
                    (dow === DaysOfWeek.MONDAY && day > 10 && day < 18))) {
                notifications.push('סליחות בה"ב');
                notifications.push('אבינו מלכנו');
            }
            break;
        case 3: //Sivan
            if (day < 6 && isNightTime) {
                notifications.push(`${Utils.toJNum(day + 44)} בעומר`);
            }
            if (day < 13) {
                dayInfo.noTachnun = true;
            }
            if (day === 6 && isMorning) {
                notifications.push('הלל השלם');
                notifications.push('מגילת רות');
                notifications.push('אקדמות');
                notifications.push('יזכור');
            }
            else if (day === 7 && isMorning && dow !== DaysOfWeek.SHABBOS) {
                notifications.push('א"א למנצח');
            }
            break;
        case 4: //Tammuz
            if (isDaytime && ((day === 17 && DaysOfWeek.SHABBOS !== 6) ||
                (day === 18 && dow === DaysOfWeek.SUNDAY))) {
                if (isMorning) {
                    notifications.push('סליחות י"ז בתמוז');
                }
                notifications.push('אבינו מלכנו');
                notifications.push('עננו');
            }
            break;
        case 5: //Av
            if (isAfternoon && (day === 8 && dow !== DaysOfWeek.FRIDAY)) {
                dayInfo.noTachnun = true;
            }
            else if ((day === 9 && dow !== DaysOfWeek.SHABBOS) ||
                (day === 10 && dow === DaysOfWeek.SUNDAY)) {
                if (isDaytime) {
                    notifications.push('קינות לתשעה באב');
                    notifications.push('עננו');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push('א"א למנצח');
                    }
                }
                else {
                    notifications.push('מגילת איכה');
                    if (isNightTime && dow === DaysOfWeek.SUNDAY) {
                        notifications.push('א"א ויהי נועם');
                    }
                }
                dayInfo.noTachnun = true;
            }
            else if (isAfternoon && day === 14) {
                dayInfo.noTachnun = true;
            }
            else if (day === 15) {
                dayInfo.noTachnun = true;
            }
            break;
        case 6: //Ellul
            notifications.push('לדוד ה\' אורי');
            if (dow !== DaysOfWeek.SHABBOS &&
                (isAfterChatzosHalayla || isMorning) &&
                (day >= 26 || (dow > DaysOfWeek.THURSDAY && day > 20))) {
                notifications.push('סליחות');
            }
            if (day === 29) {
                dayInfo.noTachnun = true;
            }
            break;
        case 7: //Tishrei
            if (day < 11) {
                notifications.push('המלך הקדוש');
                if (dow !== DaysOfWeek.SHABBOS && day !== 9) {
                    notifications.push('אבינו מלכנו');
                }
            }
            //Days of Rosh Hashana, Tzom Gedaliah and Yom Kippur are dealt with individually below.
            if (day > 4 && day < 10 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push('סליחות');
                notifications.push('המלך המשפט');
            }
            if (dow === DaysOfWeek.SHABBOS && day > 2 && day < 10) {
                notifications.push('שבת שובה');
            }
            switch (day) {
                case 1:
                    if (dow !== DaysOfWeek.SHABBOS && isDaytime) {
                        notifications.push('תקיעת שופר');
                        if (isAfternoon) {
                            notifications.push('תשליך');
                        }
                    }
                    break;
                case 2:
                    if (isDaytime) {
                        notifications.push('תקיעת שופר');
                        if (dow === DaysOfWeek.SUNDAY && isAfternoon) {
                            notifications.push('תשליך');
                        }
                    }
                    break;
                case 3:
                    if (dow !== DaysOfWeek.SHABBOS) {
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push('סליחות צום גדליה');
                        }
                        if (isDaytime) {
                            notifications.push('עננו');
                        }
                        notifications.push('המלך המשפט');
                    }
                    break;
                case 4:
                    if (dow === DaysOfWeek.SUNDAY) {
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push('סליחות צום גדליה');
                        }
                        if (isDaytime) {
                            notifications.push('עננו');
                        }
                        notifications.push('המלך המשפט');
                    }
                    else if (dow !== DaysOfWeek.SHABBOS) {
                        notifications.push('המלך המשפט');
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push('סליחות');
                        }
                    }
                    break;
                case 9:
                    if (isMorning) {
                        notifications.push('א"א מזמור לתודה');
                        if (dow !== DaysOfWeek.SHABBOS) {
                            notifications.push('א"א למנצח');
                        }
                        if (dow === DaysOfWeek.FRIDAY) {
                            notifications.push('אבינו מלכנו');
                        }
                    }
                    else if (isAfternoon) {
                        notifications.push('ודוי בעמידה');
                    }
                    if (isDaytime && dow !== DaysOfWeek.FRIDAY) {
                        notifications.push('א"א אבינו מלכנו');
                    }
                    dayInfo.noTachnun = true;
                    break;
                case 10:
                    notifications.push('לפני ה\' תטהרו');
                    if (isDaytime) {
                        notifications.push('יזכור');
                    }
                    if (isAfternoon) {
                        //only Yom Kippur has its own Kriyas Hatorah
                        notifications.push('קה"ת במנחה סוף פרשת אח"מ');
                    }
                    break;
                case 15:
                    if (isDaytime) {
                        notifications.push('הלל השלם');
                        if (dow !== DaysOfWeek.SHABBOS) {
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
                    if (isDaytime) {
                        notifications.push('הושענות');
                        notifications.push('הלל השלם');
                    }
                    break;
                case 21:
                    notifications.push('הושעה רבה');
                    notifications.push('יעלה ויבא');
                    if (isNightTime) {
                        notifications.push('משנה תורה');
                    }
                    else {
                        notifications.push('הושענות');
                        notifications.push('הלל השלם');
                    }
                    break;
                case 22:
                    notifications.push('שמ"ע - שמח"ת');
                    if (isDaytime) {
                        notifications.push('הלל השלם');
                        notifications.push('יזכור');
                        notifications.push('משיב הרוח ומוריד הגשם');
                    }
                    break;
            }
            if (day < 22) {
                notifications.push('לדוד ה\' אורי');
            }
            else if (day >= 10) {
                dayInfo.noTachnun = true;
            }
            else if (day > 22) {
                notifications.push('משיב הרוח ומוריד הגשם');
            }
            break;
        case 8: //Cheshvan
            if (isDaytime &&
                ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
                    (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
                    (dow === DaysOfWeek.MONDAY && day > 10 && day < 18))) {
                notifications.push('סליחות בה"ב');
                notifications.push('אבינו מלכנו');
            }
            if (day <= 22) {
                notifications.push('משיב הרוח ומוריד הגשם');
            }
            if (day >= 7 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push('ותן טל ומטר');
            }
            break;
        case 9: //Kislev
            if (day <= 7 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push('ותן טל ומטר');
            }
            else if (day === 24 && dow !== DaysOfWeek.SHABBOS && isAfternoon) {
                dayInfo.noTachnun = true;
            }
            else if (day >= 25) {
                dayInfo.noTachnun = true;
                notifications.push('על הניסים');
                if (isDaytime) {
                    notifications.push('הלל השלם');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS)
                        notifications.push('א"א למנצח');
                }
            }
            break;
        case 10: //Teves
            if (day <= (jDate.isShortKislev(jdate.Year) ? 3 : 2)) {
                dayInfo.noTachnun = true;
                notifications.push('על הניסים');
                if (isDaytime) {
                    notifications.push('הלל השלם');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS)
                        notifications.push('א"א למנצח');
                }
            }
            else if (day === 10 && isDaytime) {
                if (isMorning) {
                    notifications.push('סליחות עשרה בטבת');
                }
                notifications.push('אבינו מלכנו');
                notifications.push('עננו');
            }
            break;
        case 11: //Shvat
            if (day === 14 && isAfternoon)
                dayInfo.noTachnun = true;
            if (day === 15) {
                dayInfo.noTachnun = true;
                notifications.push('ט"ו בשבט');
            }
            break;
        case 12:
        case 13:
            if (month === 12 && isLeapYear) { //Adar Rishon in a leap year
                if (((day === 13 && isAfternoon) || [14, 15].includes(day)) &&
                    isDaytime) {
                    dayInfo.noTachnun = true;
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push('א"א למנצח');
                    }
                }
            }
            else { //The "real" Adar: the only one in a non-leap-year or Adar Sheini
                if (isDaytime &&
                    ((day === 11 && dow === DaysOfWeek.THURSDAY) ||
                        (day === 13 && dow !== DaysOfWeek.SHABBOS))) {
                    if (isMorning) {
                        notifications.push('סליחות תענית אסתר');
                    }
                    notifications.push('אבינו מלכנו');
                    notifications.push('עננו');
                }
                else {
                    //Only ירושלים says על הניסים on ט"ו
                    const isYerushalayim = (location.Name === 'ירושלים');
                    if (day === 14) {
                        dayInfo.noTachnun = true;
                        if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push('א"א למנצח');
                        }
                        if (!isYerushalayim) {
                            notifications.push('על הניסים');
                            notifications.push('מגילת אסתר');
                        }
                    }
                    else if (day === 15) {
                        dayInfo.noTachnun = true;
                        if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push('א"א למנצח');
                        }
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
}

function hasOwnKriyasHatorah(jdate, location) {
    const { Month, Day, DayOfWeek } = jdate;
    //Rosh chodesh
    if ((Day === 1) || (Day === 30)) {
        return true;
    }
    switch (Month) {
        case 1:
            return Day > 14 && Day < 22;
        case 4:
            return Day === 17 || (DayOfWeek === 0 && Day === 18);
        case 5:
            return Day === 9 || (DayOfWeek === 0 && Day === 10);
        case 7:
            return [3, 16, 17, 18, 19, 20, 21].includes(Day) ||
                (DayOfWeek === 0 && Day === 4);
        case 9:
            return Day >= 25;
        case 10:
            return Day === 10 ||
                Day < 3 ||
                (Day === 3 && jDate.isShortKislev(jdate.Year));
        case 12:
        case 13:
            return Month === (jDate.isJdLeapY(jdate.Year) ? 13 : 12) &&
                (Day === 13 ||
                    Day === (location.Name === 'ירושלים' ? 15 : 14));
        default:
            return false;
    }
}