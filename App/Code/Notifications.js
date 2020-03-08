import Utils from "./JCal/Utils";
import Settings from "./Settings";
import jDate from "./JCal/jDate";
import Molad from "./JCal/Molad";
import PirkeiAvos from "./JCal/PirkeiAvos";
import AppUtils, { DaysOfWeek } from "./AppUtils";

/**
 * Get shul notifications for the given date and location
 * @param {jDate} jdate
 * @param {Date} sdate
 * @param {{hour : Number, minute :Number, second: Number }} time
 * @param {Settings} settings
 */
export default function getNotifications(jdate, sdate, time, settings) {
    const notifications = [],
        month = jdate.Month,
        day = jdate.Day,
        dow = jdate.DayOfWeek,
        { location, showGaonShir, showDafYomi } = settings,
        {
            chatzosHayom,
            chatzosHalayla,
            alos,
            shkia,
        } = AppUtils.getBasicShulZmanim(sdate, jdate, location),
        isAfterChatzosHayom = Utils.isTimeAfter(chatzosHayom, time),
        isAfterChatzosHalayla =
            Utils.isTimeAfter(chatzosHalayla, time) ||
            (chatzosHalayla.hour > 12 && time.hour < 12), //Chatzos is before 0:00 and time is after 0:00
        isAfterAlos = Utils.isTimeAfter(alos, time),
        isAfterShkia = Utils.isTimeAfter(shkia, time),
        isDaytime = isAfterAlos && !isAfterShkia,
        isNightTime = !isDaytime,
        isMorning = isDaytime && !isAfterChatzosHayom,
        isAfternoon = isDaytime && isAfterChatzosHayom,
        isYomTov = jdate.isYomTovOrCholHamoed(location.Israel),
        isLeapYear = jDate.isJdLeapY(jdate.Year),
        noTachnun = isAfternoon && (dow === DaysOfWeek.FRIDAY || day === 29),
        dayInfo = {
            jdate,
            sdate,
            month,
            day,
            dow,
            isAfterChatzosHayom,
            isAfterChatzosHalayla,
            isAfterAlos,
            isAfterShkia,
            isDaytime,
            isNightTime,
            isMorning,
            isAfternoon,
            isYomTov,
            isLeapYear,
            noTachnun,
            location,
        };
    if (dow === DaysOfWeek.SHABBOS) {
        getShabbosNotifications(notifications, dayInfo, showGaonShir);
    } else {
        getWeekDayNotifications(notifications, dayInfo, showGaonShir);
    }
    getAroundTheYearNotifications(notifications, dayInfo, showGaonShir);

    if (dayInfo.noTachnun && isDaytime && !isYomTov) {
        if (dow !== DaysOfWeek.SHABBOS) {
            notifications.push('א"א תחנון');
        } else if (isAfternoon) {
            notifications.push('א"א צדקתך');
        } else if (
            !(
                (month === 1 && day > 21) ||
                month === 2 ||
                (month === 3 && day < 6)
            )
        ) {
            notifications.push('א"א אב הרחמים');
        }
    }
    if (showDafYomi) {
        notifications.push(jdate.getDafyomiHeb());
    }

    //return only unique values
    return [...new Set(notifications)];
}

function getShabbosNotifications(notifications, dayInfo, showGaonShir) {
    const {
        month,
        day,
        isLeapYear,
        isMorning,
        isYomTov,
        jdate,
        isDaytime,
        isAfternoon,
    } = dayInfo;
    if (month === 1 && day > 7 && day < 15) {
        notifications.push("שבת הגדול");
    } else if (month === 7 && day > 2 && day < 10) {
        notifications.push("שבת שובה");
    } else if (month === 5 && day > 2 && day < 10) {
        notifications.push("שבת חזון");
    } else if (
        (month === (isLeapYear ? 12 : 11) && day > 23 && day < 30) ||
        (month === (isLeapYear ? 13 : 12) && day === 1)
    ) {
        notifications.push("פרשת שקלים");
    } else if (month === (isLeapYear ? 13 : 12) && day > 7 && day < 14) {
        notifications.push("פרשת זכור");
    } else if (month === (isLeapYear ? 13 : 12) && day > 16 && day < 24) {
        notifications.push("פרשת פרה");
    } else if (
        (month === (isLeapYear ? 13 : 12) && day > 23 && day < 30) ||
        (month === 1 && day === 1)
    ) {
        notifications.push("פרשת החודש");
    }
    if (isMorning && !isYomTov) {
        notifications.push('קה"ת פרשת ' + jdate.getSedra(true).toStringHeb());
        //All months but Tishrei have Shabbos Mevarchim on the Shabbos before Rosh Chodesh
        if (month !== 6 && day > 22 && day < 30) {
            const nextMonth = jdate.addMonths(1);
            notifications.push(
                "המולד יהיה ב" +
                    Molad.getStringHeb(nextMonth.Year, nextMonth.Month)
            );
            notifications.push("מברכים החודש");
        }
    }
    //Rosh Chodesh
    if (month !== 7 && (day === 1 || day === 30)) {
        notifications.push("ראש חודש");
        notifications.push("יעלה ויבא");
        if (showGaonShir && isDaytime) {
            notifications.push('שיר של יום - קי"ד - ברכי נפשי');
        }
        //Rosh Chodesh Teves is during Chanuka
        if (isDaytime && month !== 10 && !(month === 9 && day === 30)) {
            notifications.push("חצי הלל");
        }
    } else if (showGaonShir && isDaytime) {
        notifications.push("שיר של יום - מזמור שיר ליום השבת");
    }
    //Kriyas Hatora - Shabbos by mincha - besides for Yom Kippur
    if (isAfternoon && !(month === 7 && day === 10)) {
        notifications.push(
            'קה"ת במנחה פרשת ' + jdate.addDays(1).getSedra(true).sedras[0].heb
        );
    }
    if (
        isAfternoon &&
        ((month === 1 && day > 21) ||
            (month <= 6 && !(month === 5 && [8, 9].includes(day))))
    ) {
        notifications.push(
            "פרקי אבות - " +
                PirkeiAvos.getPrakim(jdate, true)
                    .map(s => `פרק ${Utils.toJNum(s)}`)
                    .join(" ו")
        );
    }
}

function getWeekDayNotifications(notifications, dayInfo, showGaonShir) {
    const {
        isNightTime,
        dow,
        isYomTov,
        month,
        day,
        isMorning,
        jdate,
        location,
        isDaytime,
        isAfternoon,
    } = dayInfo;

    //מוצאי שבת
    if (isNightTime && dow === DaysOfWeek.SUNDAY) {
        //הבדלה בתפילה for מוצאי שבת
        notifications.push(
            (month === 1 && day === 15) || (month === 3 && day === 6)
                ? "ותודיעינו"
                : "אתה חוננתנו"
        );
        //Motzai Shabbos before Yom Tov - no ויהי נועם
        if (
            (month === 6 && day > 22) ||
            (month === 7 && day < 22 && day !== 3) ||
            (month === 1 && day > 8 && day < 15) ||
            (month === 3 && day < 6)
        ) {
            notifications.push('א"א ויהי נועם');
        }
    }
    //אתה חוננתנו for מוצאי יו"ט
    else if (
        isNightTime &&
        ((month === 1 && (day === 16 || day === 22)) ||
            (month === 3 && day === 7) ||
            (month === 7 && [3, 11, 16, 23].includes(day)))
    ) {
        notifications.push("אתה חוננתנו");
    }
    //Kriyas hatorah for monday and thursday
    //when it's not chol hamoed, chanuka, purim, a fast day or rosh chodesh
    if (
        isMorning &&
        !isYomTov &&
        (dow === DaysOfWeek.MONDAY || dow === DaysOfWeek.THURSDAY) &&
        !hasOwnKriyasHatorah(jdate, location)
    ) {
        notifications.push('קה"ת פרשת ' + jdate.getSedra(true).toStringHeb());
    }
    //Rosh Chodesh
    if ((month !== 7 && day === 1) || day === 30) {
        dayInfo.noTachnun = true;
        notifications.push("ראש חודש");
        notifications.push("יעלה ויבא");
        if (showGaonShir && isDaytime) {
            notifications.push('שיר של יום - קי"ד - ברכי נפשי');
        }
        //Rosh Chodesh Teves is during Chanuka
        if (isDaytime && month !== 10 && !(month === 9 && day === 30)) {
            notifications.push("חצי הלל");
            if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                notifications.push('א"א למנצח');
            }
        }
    }
    //Yom Kippur Kattan
    else if (
        month !== 6 &&
        ((dow < DaysOfWeek.FRIDAY && day === 29) ||
            (dow === DaysOfWeek.THURSDAY && day === 28)) &&
        isAfternoon
    ) {
        notifications.push('יו"כ קטן');
    }
}

function getAroundTheYearNotifications(notifications, dayInfo, showGaonShir) {
    const {
        month,
        day,
        isNightTime,
        dow,
        isAfternoon,
        isDaytime,
        isMorning,
        isAfterChatzosHalayla,
        jdate,
        isLeapYear,
        location,
    } = dayInfo;
    switch (month) {
        case 1: //Nissan
            dayInfo.noTachnun = true;
            if (day > 15) {
                notifications.push("מוריד הטל");
                if (isNightTime)
                    notifications.push(`${Utils.toJNum(day - 15)} בעומר`);
            }
            if (dow !== DaysOfWeek.SHABBOS && day > 15 && day !== 21) {
                notifications.push("ותן ברכה");
            }
            if (
                isMorning &&
                dow !== DaysOfWeek.SHABBOS &&
                [14, 16, 17, 18, 19, 20].includes(day)
            ) {
                notifications.push('א"א מזמור לתודה');
                if (dow !== DaysOfWeek.SHABBOS) {
                    notifications.push('א"א למנצח');
                }
            }
            if (day === 15) {
                notifications.push('יו"ט ראשון של פסח');
                notifications.push("הלל השלם");
                if (isAfternoon) {
                    notifications.push("מוריד הטל");
                }
                if (showGaonShir && isDaytime && dow !== DaysOfWeek.SHABBOS) {
                    notifications.push('שיר של יום - קי"ד - בצאת ישראל');
                }
            } else if ([16, 17, 18, 19, 20, 21].includes(day)) {
                if (day === 21) {
                    notifications.push("שביעי של פםח");
                    if (isDaytime) {
                        notifications.push("יזכור");
                        if (showGaonShir && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                "שיר של יום - י\"ח - למנצח לעבד ה'"
                            );
                        }
                    }
                } else {
                    notifications.push("פסח - חול המועד");
                    notifications.push("יעלה ויבא");
                    if (isMorning && dow !== DaysOfWeek.SHABBOS)
                        notifications.push('א"א למנצח');
                    if (
                        showGaonShir &&
                        isDaytime &&
                        dow !== DaysOfWeek.SHABBOS
                    ) {
                        switch (day) {
                            case 16:
                                if (dow === DaysOfWeek.SUNDAY) {
                                    notifications.push(
                                        'שיר של יום - קי"ד - בצאת ישראל'
                                    );
                                } else {
                                    notifications.push(
                                        'שיר של יום - ע"ח - משכיל לאסף'
                                    );
                                }
                                break;
                            case 17:
                                if (dow === DaysOfWeek.MONDAY) {
                                    notifications.push(
                                        'שיר של יום - ע"ח - משכיל לאסף'
                                    );
                                } else {
                                    notifications.push(
                                        "שיר של יום - פ' - למנצח אל שושנים"
                                    );
                                }
                                break;
                            case 18:
                                if (
                                    dow === DaysOfWeek.TUESDAY ||
                                    dow === DaysOfWeek.SUNDAY
                                ) {
                                    notifications.push(
                                        "שיר של יום - פ' - למנצח אל שושנים"
                                    );
                                } else {
                                    notifications.push(
                                        "שיר של יום - ק\"ה - הודו לה'"
                                    );
                                }
                                break;
                            case 19:
                                if (dow === DaysOfWeek.THURSDAY) {
                                    notifications.push(
                                        'שיר של יום - קל"ה - הללוי-ה הללו את שם'
                                    );
                                } else {
                                    notifications.push(
                                        "שיר של יום - ק\"ה - הודו לה'"
                                    );
                                }
                                break;
                            case 20:
                                if (dow === DaysOfWeek.FRIDAY) {
                                    notifications.push(
                                        'שיר של יום - ס"ו - למנצח שיר מזמור'
                                    );
                                } else {
                                    notifications.push(
                                        'שיר של יום - קל"ה - הללוי-ה הללו את שם'
                                    );
                                }
                                break;
                        }
                    }
                }
                if (isDaytime) notifications.push("חצי הלל");
            }
            if (day === 22) {
                notifications.push("איסרו חג");
                if (dow !== DaysOfWeek.SHABBOS && isMorning) {
                    notifications.push('א"א למנצח');
                }
            } else if (
                dow === DaysOfWeek.SHABBOS &&
                [15, 16, 17, 18, 19, 20].includes(day)
            ) {
                notifications.push("מגילת שיר השירים");
            }
            break;
        case 2: //Iyar
            if (isNightTime)
                notifications.push(`${Utils.toJNum(day + 15)} בעומר`);
            if (day <= 15) {
                notifications.push("מוריד הטל");
                if (dow !== DaysOfWeek.SHABBOS) {
                    notifications.push("ותן ברכה");
                }
            }
            //Pesach Sheini and Lag Ba'Omer
            if (
                day === 15 ||
                (day === 14 && isAfternoon) ||
                day === 18 ||
                (day === 17 && isAfternoon)
            ) {
                dayInfo.noTachnun = true;
                if (day === 15) {
                    notifications.push("פסח שני");
                }
            }
            //Baha"b
            if (
                isMorning &&
                ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
                    (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
                    (dow === DaysOfWeek.MONDAY && day > 10 && day < 18))
            ) {
                notifications.push('סליחות בה"ב');
                notifications.push("אבינו מלכנו");
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
                notifications.push("יום טוב של שבועות");
                notifications.push("הלל השלם");
                notifications.push("מגילת רות");
                notifications.push("אקדמות");
                notifications.push("יזכור");
                if (showGaonShir) {
                    notifications.push('שיר של יום - י"ט - ..השמים מספרים..');
                }
            } else if (day === 7) {
                notifications.push("איסרו חג");
                if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                    notifications.push('א"א למנצח');
                }
            }
            break;
        case 4: //Tammuz
            if (
                isDaytime &&
                ((day === 17 && DaysOfWeek.SHABBOS !== 6) ||
                    (day === 18 && dow === DaysOfWeek.SUNDAY))
            ) {
                if (isDaytime) {
                    notifications.push('י"ז בתמוז');
                    notifications.push("אבינו מלכנו");
                    notifications.push("עננו");
                }
                if (isMorning) {
                    notifications.push("סליחות");
                }
            }
            break;
        case 5: //Av
            if (isAfternoon && day === 8 && dow !== DaysOfWeek.FRIDAY) {
                dayInfo.noTachnun = true;
            } else if (
                (day === 9 && dow !== DaysOfWeek.SHABBOS) ||
                (day === 10 && dow === DaysOfWeek.SUNDAY)
            ) {
                notifications.push("תשעה באב");
                if (isDaytime) {
                    notifications.push("קינות");
                    notifications.push("עננו");
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push('א"א למנצח');
                    }
                } else {
                    notifications.push("מגילת איכה");
                    if (isNightTime && dow === DaysOfWeek.SUNDAY) {
                        notifications.push('א"א ויהי נועם');
                    }
                }
                dayInfo.noTachnun = true;
            } else if (isAfternoon && day === 14) {
                dayInfo.noTachnun = true;
            } else if (day === 15) {
                notifications.push('ט"ו באב');
                dayInfo.noTachnun = true;
            }
            break;
        case 6: //Ellul
            notifications.push("לדוד ה' אורי");
            if (
                day > 20 &&
                dow !== DaysOfWeek.SHABBOS &&
                (isAfterChatzosHalayla || isMorning)
            ) {
                let startedSelichos = day >= 26;
                if (day < 26) {
                    const daysToRH = 30 - day,
                        dowRH = (daysToRH + dow) % 7;
                    switch (dowRH) {
                        case DaysOfWeek.MONDAY:
                            startedSelichos = day >= 22;
                            break;
                        case DaysOfWeek.TUESDAY:
                            startedSelichos = day >= 21;
                            break;
                        case DaysOfWeek.SHABBOS:
                            startedSelichos = day >= 24;
                            break;
                    }
                }
                if (startedSelichos) {
                    notifications.push("סליחות");
                }
            }
            if (day === 29) {
                dayInfo.noTachnun = true;
            }
            break;
        case 7: //Tishrei
            if (day < 11) {
                notifications.push("המלך הקדוש");
                if (dow !== DaysOfWeek.SHABBOS && day !== 9) {
                    notifications.push("אבינו מלכנו");
                }
            }
            //Days of Rosh Hashana, Tzom Gedaliah and Yom Kippur are dealt with individually below.
            if (day > 4 && day < 10 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push("סליחות");
                notifications.push("המלך המשפט");
            }
            if (dow === DaysOfWeek.SHABBOS && day > 2 && day < 10) {
                notifications.push("שבת שובה");
            }
            if (day >= 10) {
                dayInfo.noTachnun = true;
            }
            switch (day) {
                case 1:
                    notifications.push("ראש השנה");
                    if (dow !== DaysOfWeek.SHABBOS && isDaytime) {
                        notifications.push("תקיעת שופר");
                        if (showGaonShir) {
                            notifications.push(
                                'שיר של יום - פ"א - למנצח על הגתית'
                            );
                        }
                        if (isAfternoon) {
                            notifications.push("תשליך");
                        }
                    }
                    break;
                case 2:
                    notifications.push("ראש השנה");
                    if (isDaytime) {
                        notifications.push("תקיעת שופר");
                        if (showGaonShir) {
                            notifications.push(
                                'שיר של יום - פ"א - למנצח על הגתית'
                            );
                        }
                        if (dow === DaysOfWeek.SUNDAY && isAfternoon) {
                            notifications.push("תשליך");
                        }
                    }
                    break;
                case 3:
                    if (dow !== DaysOfWeek.SHABBOS) {
                        if (isDaytime) {
                            notifications.push("צום גדליה");
                            notifications.push("עננו");
                        }
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push("סליחות");
                        }
                        notifications.push("המלך המשפט");
                    }
                    break;
                case 4:
                    if (dow === DaysOfWeek.SUNDAY) {
                        if (isDaytime) {
                            notifications.push("צום גדליה");
                            notifications.push("עננו");
                        }
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push("סליחות");
                        }
                        notifications.push("המלך המשפט");
                    } else if (dow !== DaysOfWeek.SHABBOS) {
                        notifications.push("המלך המשפט");
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push("סליחות");
                        }
                    }
                    break;
                case 9:
                    notifications.push("ערב יום כיפור");
                    if (isMorning) {
                        notifications.push('א"א מזמור לתודה');
                        if (dow !== DaysOfWeek.SHABBOS) {
                            notifications.push('א"א למנצח');
                        }
                        if (dow === DaysOfWeek.FRIDAY) {
                            notifications.push("אבינו מלכנו");
                        }
                    } else if (isAfternoon) {
                        notifications.push("ודוי בעמידה");
                    }
                    if (isDaytime && dow !== DaysOfWeek.FRIDAY) {
                        notifications.push('א"א אבינו מלכנו');
                    }
                    dayInfo.noTachnun = true;
                    break;
                case 10:
                    notifications.push("יום הכיפורים");
                    notifications.push("לפני ה' תטהרו");
                    if (isDaytime) {
                        notifications.push("יזכור");
                        if (showGaonShir && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push('שיר של יום - ל"ב - לדוד משכיל');
                        }
                    }
                    if (isAfternoon) {
                        //only Yom Kippur has its own Kriyas Hatorah
                        notifications.push('קה"ת במנחה סוף פרשת אח"מ');
                    }
                    break;
                case 15:
                    notifications.push('יו"ט ראשון של סוכות');
                    if (isDaytime) {
                        notifications.push("הלל השלם");
                        if (dow !== DaysOfWeek.SHABBOS) {
                            notifications.push("הושענות - למען אמתך");
                            notifications.push("קה קלי");
                            if (showGaonShir) {
                                notifications.push(
                                    'שיר של יום - ע"ו - למנצח בנגינות מזמור'
                                );
                            }
                        } else {
                            notifications.push("הושענות - אום נצורה");
                        }
                    }
                    break;
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                    notifications.push("סוכות - חול המועד");
                    notifications.push("יעלה ויבא");
                    if (isDaytime) {
                        notifications.push("הלל השלם");
                        switch (day) {
                            case 16:
                                notifications.push(
                                    "הושענות - " +
                                        (dow === DaysOfWeek.SUNDAY
                                            ? "למען אמתך"
                                            : "אבן שתיה")
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    notifications.push(
                                        "שיר של יום - כ\"ט - ..הבו לה' בני אלים"
                                    );
                                }
                                break;
                            case 17:
                                notifications.push(
                                    "הושענות - " +
                                        (dow === DaysOfWeek.SHABBOS
                                            ? "אום נצורה"
                                            : "אערוך שועי")
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    notifications.push(
                                        "שיר של יום - נ' - מזמור לאסף"
                                    );
                                }
                                break;
                            case 18:
                                if (dow === DaysOfWeek.SUNDAY) {
                                    notifications.push("הושענות - אערוך שועי");
                                    if (
                                        showGaonShir &&
                                        dow !== DaysOfWeek.SHABBOS
                                    ) {
                                        notifications.push(
                                            "שיר של יום - נ' - מזמור לאסף"
                                        );
                                    }
                                } else {
                                    if (dow === DaysOfWeek.TUESDAY) {
                                        notifications.push(
                                            "הושענות - אבן שתיה"
                                        );
                                    } else if (dow === DaysOfWeek.THURSDAY) {
                                        notifications.push(
                                            "הושענות - אום אני חומה"
                                        );
                                    } else if (dow === DaysOfWeek.FRIDAY) {
                                        notifications.push(
                                            "הושענות - א-ל למושעות"
                                        );
                                    }
                                    if (
                                        showGaonShir &&
                                        dow !== DaysOfWeek.SHABBOS
                                    ) {
                                        notifications.push(
                                            'שיר של יום - צ"ד - ..מי יקום לי..'
                                        );
                                    }
                                }
                                break;
                            case 19:
                                notifications.push(
                                    "הושענות - " +
                                        (dow === DaysOfWeek.SHABBOS
                                            ? "אום נצורה"
                                            : "א-ל למושעות")
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    if (dow === DaysOfWeek.MONDAY) {
                                        notifications.push(
                                            'שיר של יום - צ"ד - ..מי יקום לי..'
                                        );
                                    } else {
                                        notifications.push(
                                            'שיר של יום - צ"ד - א-ל נקמות.. ישרי לב'
                                        );
                                    }
                                }
                                break;
                            case 20:
                                notifications.push(
                                    "הושענות - " +
                                        (dow === DaysOfWeek.SHABBOS
                                            ? "אום נצורה"
                                            : "אדון המושיע")
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    if (dow === DaysOfWeek.THURSDAY) {
                                        notifications.push(
                                            'שיר של יום - פ"א - למנצח על הגתית'
                                        );
                                    } else {
                                        notifications.push(
                                            'שיר של יום - צ"ד - א-ל נקמות.. ישרי לב'
                                        );
                                    }
                                }
                                break;
                        }
                    }
                    break;
                case 21:
                    notifications.push("הושעה רבה");
                    notifications.push("יעלה ויבא");
                    if (isNightTime) {
                        notifications.push("משנה תורה");
                    } else {
                        notifications.push("הושענות - הושעה רבה");
                        notifications.push("הלל השלם");
                        if (showGaonShir) {
                            if (dow === DaysOfWeek.FRIDAY) {
                                notifications.push(
                                    'שיר של יום - פ"ב - מזמור לאסף'
                                );
                            } else {
                                notifications.push(
                                    'שיר של יום - פ"א - למנצח על הגתית'
                                );
                            }
                        }
                    }
                    break;
                case 22:
                    notifications.push("שמיני עצרת - שמחת תורה");
                    notifications.push("הקפות");
                    if (isDaytime) {
                        notifications.push("הלל השלם");
                        notifications.push("יזכור");
                        notifications.push("תפילת גשם");
                        notifications.push("משיב הרוח ומוריד הגשם");
                        if (showGaonShir && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                'שיר של יום - י"ב - למנצח על השמינית'
                            );
                        }
                    }
                    break;
            }
            if (day === 23) {
                notifications.push("איסרו חג");
                if (isNightTime) {
                    notifications.push("חורף טוב");
                } else if (dow !== DaysOfWeek.SHABBOS && isMorning) {
                    notifications.push('א"א למנצח');
                }
            } else if (
                dow === DaysOfWeek.SHABBOS &&
                [15, 17, 18, 19, 20].includes(day)
            ) {
                notifications.push("מגילת קהלת");
            }
            if (day < 22) {
                notifications.push("לדוד ה' אורי");
            } else if (day > 22) {
                notifications.push("משיב הרוח ומוריד הגשם");
            }
            break;
        case 8: //Cheshvan
            if (
                isDaytime &&
                ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
                    (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
                    (dow === DaysOfWeek.MONDAY && day > 10 && day < 18))
            ) {
                notifications.push('סליחות בה"ב');
                notifications.push("אבינו מלכנו");
            }
            if (day <= 22) {
                notifications.push("משיב הרוח ומוריד הגשם");
            }
            if (day >= 7 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push("ותן טל ומטר");
            }
            break;
        case 9: //Kislev
            if (day <= 7 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push("ותן טל ומטר");
            } else if (
                day === 24 &&
                dow !== DaysOfWeek.SHABBOS &&
                isAfternoon
            ) {
                dayInfo.noTachnun = true;
            } else if (day >= 25) {
                dayInfo.noTachnun = true;
                notifications.push("חנוכה");
                notifications.push("על הניסים");
                if (isDaytime) {
                    notifications.push("הלל השלם");
                    if (isMorning && dow !== DaysOfWeek.SHABBOS)
                        notifications.push('א"א למנצח');
                    if (
                        showGaonShir &&
                        day !== 30 &&
                        dow !== DaysOfWeek.SHABBOS
                    ) {
                        notifications.push(
                            "שיר של יום - ל' - מזמור שיר חנוכת הבית"
                        );
                    }
                }
            }
            break;
        case 10: //Teves
            if (day <= (jDate.isShortKislev(jdate.Year) ? 3 : 2)) {
                dayInfo.noTachnun = true;
                notifications.push("חנוכה");
                notifications.push("על הניסים");
                if (isDaytime) {
                    notifications.push("הלל השלם");
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push('א"א למנצח');
                        if (day !== 1 && showGaonShir) {
                            notifications.push(
                                "שיר של יום - ל' - מזמור שיר חנוכת הבית"
                            );
                        }
                    }
                }
            } else if (day === 10 && isDaytime) {
                notifications.push("עשרה בטבת");
                if (isMorning) {
                    notifications.push("סליחות");
                }
                notifications.push("אבינו מלכנו");
                notifications.push("עננו");
            }
            break;
        case 11: //Shvat
            if (day === 14 && isAfternoon) dayInfo.noTachnun = true;
            if (day === 15) {
                dayInfo.noTachnun = true;
                notifications.push('ט"ו בשבט');
            }
            break;
        case 12:
        case 13:
            if (month === 12 && isLeapYear) {
                //Adar Rishon in a leap year
                if (
                    ((day === 13 && isAfternoon) || [14, 15].includes(day)) &&
                    isDaytime
                ) {
                    notifications.push(
                        day === 14 ? "פורים קטן" : "שןשן פורים קטן"
                    );
                    dayInfo.noTachnun = true;
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push('א"א למנצח');
                    }
                }
            } else {
                //The "real" Adar: the only one in a non-leap-year or Adar Sheini
                if (
                    isDaytime &&
                    ((day === 11 && dow === DaysOfWeek.THURSDAY) ||
                        (day === 13 && dow !== DaysOfWeek.SHABBOS))
                ) {
                    if (isMorning) {
                        notifications.push("תענית אסתר");
                        notifications.push("סליחות");
                    }
                    notifications.push("אבינו מלכנו");
                    notifications.push("עננו");
                } else {
                    //Only ירושלים says על הניסים on ט"ו
                    const isYerushalayim = location.Name === "ירושלים";
                    if (day === 14) {
                        dayInfo.noTachnun = true;
                        if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push('א"א למנצח');
                        }
                        if (!isYerushalayim) {
                            notifications.push("פורים");
                            notifications.push("על הניסים");
                            notifications.push("מגילת אסתר");
                            if (showGaonShir) {
                                notifications.push(
                                    'שיר של יום - כ"ב - למנצח על אילת השחר'
                                );
                            }
                        } else {
                            notifications.push("פורים דפרזים");
                        }
                    } else if (day === 15) {
                        dayInfo.noTachnun = true;
                        if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push('א"א למנצח');
                        }
                        if (isYerushalayim) {
                            notifications.push("פורים");
                            notifications.push("על הניסים");
                            notifications.push("מגילת אסתר");
                            if (
                                showGaonShir &&
                                isDaytime &&
                                dow !== DaysOfWeek.SHABBOS
                            ) {
                                notifications.push(
                                    'שיר של יום - כ"ב - למנצח על אילת השחר'
                                );
                            }
                        } else if (
                            [
                                "טבריה",
                                "יפו",
                                "עכו",
                                "צפת",
                                "באר שבע",
                                "חיפה",
                                "באר שבע",
                                "בית שאן",
                                "לוד",
                            ].includes(location.Name)
                        ) {
                            notifications.push("פורים דמוקפין");
                            notifications.push("(מגילת אסתר)");
                        } else {
                            notifications.push("שושן פורים");
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
    if (Day === 1 || Day === 30) {
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
            return (
                [3, 16, 17, 18, 19, 20, 21].includes(Day) ||
                (DayOfWeek === 0 && Day === 4)
            );
        case 9:
            return Day >= 25;
        case 10:
            return (
                Day === 10 ||
                Day < 3 ||
                (Day === 3 && jDate.isShortKislev(jdate.Year))
            );
        case 12:
        case 13:
            return (
                Month === (jDate.isJdLeapY(jdate.Year) ? 13 : 12) &&
                (Day === 13 || Day === (location.Name === "ירושלים" ? 15 : 14))
            );
        default:
            return false;
    }
}
