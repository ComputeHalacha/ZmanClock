import Utils from './JCal/Utils';
import Settings from './Settings';
import jDate from './JCal/jDate';
import Molad from './JCal/Molad';
import PirkeiAvos from './JCal/PirkeiAvos';
import AppUtils, {DaysOfWeek} from './AppUtils';

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
        {location, showGaonShir, showDafYomi, english} = settings,
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
        isNotBeinHasmashos =
            !isAfterShkia ||
            Utils.isTimeAfter(Utils.addMinutes(shkia, 18), time),
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
        getShabbosNotifications(
            notifications,
            dayInfo,
            showGaonShir,
            english,
            location.Israel,
        );
    } else {
        getWeekDayNotifications(
            notifications,
            dayInfo,
            showGaonShir,
            english,
            location.Israel,
        );
    }
    getAroundTheYearNotifications(
        notifications,
        dayInfo,
        showGaonShir,
        english,
        location.Israel,
    );

    if (dayInfo.noTachnun && isDaytime && !isYomTov) {
        if (dow !== DaysOfWeek.SHABBOS) {
            notifications.push(english ? 'No Tachnun' : 'א"א תחנון');
        } else if (isAfternoon) {
            notifications.push(english ? 'No Tzidkascha' : 'א"א צדקתך');
        } else if (
            !(
                (month === 1 && day > 21) ||
                month === 2 ||
                (month === 3 && day < 6)
            )
        ) {
            notifications.push(english ? 'No Av Harachamim' : 'א"א אב הרחמים');
        }
    }
    if (showDafYomi) {
        notifications.push(
            english ? jdate.getDafYomi() : jdate.getDafyomiHeb(),
        );
    }

    //If it is after the earliest Nacht during Sefiras Ha'omer
    if (
        isNotBeinHasmashos &&
        ((month === 1 && day > 15) || month === 2 || (month === 3 && day < 6))
    ) {
        const dayOfSefirah = jdate.getDayOfOmer();
        if (dayOfSefirah > 0) {
            notifications.push(Utils.getOmerNusach(dayOfSefirah, 'ashkenaz'));
        }
    }

    //return only unique values
    return [...new Set(notifications)];
}

function getShabbosNotifications(
    notifications,
    dayInfo,
    showGaonShir,
    english,
    israel,
) {
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
        notifications.push(english ? 'Shabbos Hagadol' : 'שבת הגדול');
    } else if (month === 7 && day > 2 && day < 10) {
        notifications.push(english ? 'Shabbos Shuva' : 'שבת שובה');
    } else if (month === 5 && day > 2 && day < 10) {
        notifications.push(english ? 'Shabbos Chazon' : 'שבת חזון');
    } else if (
        (month === (isLeapYear ? 12 : 11) && day > 24) ||
        (month === (isLeapYear ? 13 : 12) && day === 1)
    ) {
        notifications.push(english ? 'Parshas Shkalim' : 'פרשת שקלים');
    } else if (month === (isLeapYear ? 13 : 12) && day > 7 && day < 14) {
        notifications.push(english ? 'Parshas Zachor' : 'פרשת זכור');
    } else if (month === (isLeapYear ? 13 : 12) && day > 16 && day < 24) {
        notifications.push(english ? 'Parshas Parah' : 'פרשת פרה');
    } else if (
        (month === (isLeapYear ? 13 : 12) && day > 23 && day < 30) ||
        (month === 1 && day === 1)
    ) {
        notifications.push(english ? 'Parshas Hachodesh' : 'פרשת החודש');
    }
    if (isMorning && !isYomTov) {
        const sedra = jdate.getSedra(israel);
        notifications.push(
            english
                ? 'Kriyas Hatorah Parshas' + sedra.toString()
                : 'קה"ת פרשת ' + sedra.toStringHeb(),
        );
        //All months but Tishrei have Shabbos Mevarchim on the Shabbos before Rosh Chodesh
        if (month !== 6 && day > 22 && day < 30) {
            const nextMonth = jdate.addMonths(1);
            notifications.push(
                english
                    ? 'The molad will be ' +
                          Molad.getString(nextMonth.Year, nextMonth.Month)
                    : 'המולד יהיה ב' +
                          Molad.getStringHeb(nextMonth.Year, nextMonth.Month),
            );
            notifications.push(english ? 'Bircas Hachodesh' : 'מברכים החודש');
            if (month !== 1 && month !== 2) {
                notifications.push(
                    english ? 'No Av Harachamim' : 'א"א אב הרחמים',
                );
            }
        }
    }
    //Rosh Chodesh
    if (month !== 7 && (day === 1 || day === 30)) {
        notifications.push(english ? 'Rosh Chodesh' : 'ראש חודש');
        notifications.push(english ? 'Ya`aleh Viyavo' : 'יעלה ויבא');
        if (showGaonShir && isDaytime) {
            notifications.push(
                english ? 'Barchi Nafshi' : 'שיר של יום - קי"ד - ברכי נפשי',
            );
        }
        //Rosh Chodesh Teves is during Chanuka
        if (isDaytime && month !== 10 && !(month === 9 && day === 30)) {
            notifications.push(english ? 'Chatzi Hallel' : 'חצי הלל');
        }
        notifications.push(english ? 'No Av Harachamim' : 'א"א אב הרחמים');
    } else if (isYomTov) {
        notifications.push(english ? 'No Av Harachamim' : 'א"א אב הרחמים');
        if (showGaonShir && isDaytime) {
            notifications.push('שיר של יום - מזמור שיר ליום השבת');
        }
    }
    //Kriyas Hatora - Shabbos by mincha - besides for Yom Kippur
    if (isAfternoon && !(month === 7 && day === 10)) {
        const sedra = jdate.addDays(1).getSedra(israel);
        notifications.push(
            english
                ? 'Kriyas Hatorah Mincha Parshas ' + sedra.sedras[0].eng
                : 'קה"ת במנחה פרשת ' + sedra.sedras[0].heb,
        );
    }
    if (
        isAfternoon &&
        ((month === 1 && day > 21) ||
            (month <= 6 && !(month === 5 && [8, 9].includes(day))))
    ) {
        const prakim = PirkeiAvos.getPrakim(jdate, israel);
        notifications.push(
            english
                ? 'Pirkei Avos - ' +
                      prakim
                          .map((s) => `Perek ${Utils.toJNum(s)}`)
                          .join(' and ')
                : 'פרקי אבות - ' +
                      prakim.map((s) => `פרק ${Utils.toJNum(s)}`).join(' ו'),
        );
    }
}

function getWeekDayNotifications(
    notifications,
    dayInfo,
    showGaonShir,
    english,
    israel,
) {
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
                ? 'ותודיעינו'
                : 'אתה חוננתנו',
        );
        //Motzai Shabbos before Yom Tov - no ויהי נועם
        if (
            (month === 6 && day > 22) ||
            (month === 7 && day < 22 && day !== 3) ||
            (month === 1 && day > 8 && day < 15) ||
            (month === 3 && day < 6)
        ) {
            notifications.push(english ? 'No Vihi Noam' : 'א"א ויהי נועם');
        }
    }
    //אתה חוננתנו for מוצאי יו"ט
    else if (
        isNightTime &&
        ((month === 1 && (day === 16 || day === 22)) ||
            (month === 3 && day === 7) ||
            (month === 7 && [3, 11, 16, 23].includes(day)))
    ) {
        notifications.push(english ? 'Ata Chonantanu' : 'אתה חוננתנו');
    }
    //Kriyas hatorah for monday and thursday
    //when it's not chol hamoed, chanuka, purim, a fast day or rosh chodesh
    if (
        isMorning &&
        !isYomTov &&
        (dow === DaysOfWeek.MONDAY || dow === DaysOfWeek.THURSDAY) &&
        !hasOwnKriyasHatorah(jdate, location)
    ) {
        const sedra = jdate.getSedra(israel);
        notifications.push(
            english
                ? 'Kriyas Hatorah Parshas ' + sedra.toString()
                : 'קה"ת פרשת ' + sedra.toStringHeb(),
        );
    }
    //Rosh Chodesh
    if ((month !== 7 && day === 1) || day === 30) {
        dayInfo.noTachnun = true;
        notifications.push(english ? 'Rosh Chodesh' : 'ראש חודש');
        notifications.push(english ? 'Ya`aleh Viyavo' : 'יעלה ויבא');
        if (showGaonShir && isDaytime) {
            notifications.push(
                english ? 'Barchi Nafshi' : 'שיר של יום - קי"ד - ברכי נפשי',
            );
        }
        //Rosh Chodesh Teves is during Chanuka
        if (isDaytime && month !== 10 && !(month === 9 && day === 30)) {
            notifications.push(english ? 'Chatzi Hallel' : 'חצי הלל');
            if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                notifications.push(english ? 'No Laminatzeach' : 'א"א למנצח');
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
        notifications.push(english ? 'Yom Kippur Kattan' : 'יו"כ קטן');
    }
    if (jdate.hasEiruvTavshilin(israel)) {
        notifications.push(english ? 'Eruv Tavshilin' : 'עירוב תבשילין');
    }
}

function getAroundTheYearNotifications(
    notifications,
    dayInfo,
    showGaonShir,
    english,
    israel,
) {
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
                notifications.push(english ? 'Morid Hatal' : 'מוריד הטל');
            }
            if (dow !== DaysOfWeek.SHABBOS && day > 15 && day !== 21) {
                notifications.push(english ? 'Vesain Bracha' : 'ותן ברכה');
            }
            if (
                isMorning &&
                dow !== DaysOfWeek.SHABBOS &&
                [14, 16, 17, 18, 19, 20].includes(day)
            ) {
                notifications.push(
                    english ? 'No Mizmor Lesodah' : 'א"א מזמור לתודה',
                );
                if (dow !== DaysOfWeek.SHABBOS) {
                    notifications.push(
                        english ? 'No Leminatzeach' : 'א"א למנצח',
                    );
                }
            }
            if (day === 15) {
                notifications.push(
                    english ? 'First Day of Pesach' : 'יו"ט ראשון של פסח',
                );
                notifications.push(english ? 'Full Hallel' : 'הלל השלם');
                if (isAfternoon) {
                    notifications.push(english ? 'Morid Hatal' : 'מוריד הטל');
                }
                if (showGaonShir && isDaytime && dow !== DaysOfWeek.SHABBOS) {
                    notifications.push('שיר של יום - קי"ד - בצאת ישראל');
                }
            } else if (day === 16 && !israel) {
                notifications.push(
                    english ? 'Second Day of Pesach' : 'יו"ט שני של פסח',
                );
                notifications.push(english ? 'Full Hallel' : 'הלל השלם');
                notifications.push(english ? 'Morid Hatal' : 'מוריד הטל');
                if (showGaonShir && isDaytime && dow !== DaysOfWeek.SHABBOS) {
                    notifications.push('שיר של יום - קי"ד - בצאת ישראל');
                }
            } else if ([16, 17, 18, 19, 20, 21].includes(day)) {
                if (day === 21) {
                    notifications.push(
                        english ? 'Shvi`i Shel Pesach' : 'שביעי של פםח',
                    );
                    if (isDaytime) {
                        if (israel) {
                            notifications.push(english ? 'Yizkor' : 'יזכור');
                        }
                        if (showGaonShir && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                'שיר של יום - י"ח - למנצח לעבד ה\'',
                            );
                        }
                    }
                } else {
                    notifications.push(
                        english ? 'Chol Ha`moed Pesach' : 'פסח - חול המועד',
                    );
                    notifications.push(
                        english ? 'Ya`aleh Viyavo' : 'יעלה ויבא',
                    );
                    if (isMorning && dow !== DaysOfWeek.SHABBOS)
                        notifications.push(
                            english ? 'No Laminatzeach' : 'א"א למנצח',
                        );
                    if (
                        showGaonShir &&
                        isDaytime &&
                        dow !== DaysOfWeek.SHABBOS
                    ) {
                        switch (day) {
                            case 16:
                                if (dow === DaysOfWeek.SUNDAY) {
                                    notifications.push(
                                        'שיר של יום - קי"ד - בצאת ישראל',
                                    );
                                } else {
                                    notifications.push(
                                        'שיר של יום - ע"ח - משכיל לאסף',
                                    );
                                }
                                break;
                            case 17:
                                if (dow === DaysOfWeek.MONDAY) {
                                    notifications.push(
                                        'שיר של יום - ע"ח - משכיל לאסף',
                                    );
                                } else {
                                    notifications.push(
                                        "שיר של יום - פ' - למנצח אל שושנים",
                                    );
                                }
                                break;
                            case 18:
                                if (
                                    dow === DaysOfWeek.TUESDAY ||
                                    dow === DaysOfWeek.SUNDAY
                                ) {
                                    notifications.push(
                                        "שיר של יום - פ' - למנצח אל שושנים",
                                    );
                                } else {
                                    notifications.push(
                                        'שיר של יום - ק"ה - הודו לה\'',
                                    );
                                }
                                break;
                            case 19:
                                if (dow === DaysOfWeek.THURSDAY) {
                                    notifications.push(
                                        'שיר של יום - קל"ה - הללוי-ה הללו את שם',
                                    );
                                } else {
                                    notifications.push(
                                        'שיר של יום - ק"ה - הודו לה\'',
                                    );
                                }
                                break;
                            case 20:
                                if (dow === DaysOfWeek.FRIDAY) {
                                    notifications.push(
                                        'שיר של יום - ס"ו - למנצח שיר מזמור',
                                    );
                                } else {
                                    notifications.push(
                                        'שיר של יום - קל"ה - הללוי-ה הללו את שם',
                                    );
                                }
                                break;
                        }
                    }
                }
                if (isDaytime) notifications.push('חצי הלל');
            }
            if (day === 22) {
                if (israel) {
                    notifications.push(english ? 'Isru Chag' : 'איסרו חג');
                } else {
                    notifications.push(
                        english ? 'Acharon Shel Pesach' : 'אחרון של פסח',
                    );
                    if (isDaytime) {
                        notifications.push(english ? 'Yizkor' : 'יזכור');
                        notifications.push('חצי הלל');
                    }
                }
                if (dow !== DaysOfWeek.SHABBOS && isMorning) {
                    notifications.push('א"א למנצח');
                }
            } else if (
                dow === DaysOfWeek.SHABBOS &&
                ([15, 16, 17, 18, 19, 20, 21].includes(day) ||
                    (!israel && day === 22))
            ) {
                notifications.push(
                    english ? 'Shir Hashirim' : 'מגילת שיר השירים',
                );
            }
            break;
        case 2: //Iyar
            if (day <= 15) {
                notifications.push(english ? 'Morid Hatal' : 'מוריד הטל');
                if (dow !== DaysOfWeek.SHABBOS) {
                    notifications.push(english ? 'V`sain Bracha' : 'ותן ברכה');
                }
            }
            //Pesach Sheini and Lag Ba'Omer
            if (
                day === 14 ||
                (day === 13 && isAfternoon) ||
                day === 18 ||
                (day === 17 && isAfternoon)
            ) {
                dayInfo.noTachnun = true;
                if (day === 14) {
                    notifications.push(english ? 'Pesach Sheini' : 'פסח שני');
                }
            }
            //Baha"b
            if (
                isMorning &&
                ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
                    (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
                    (dow === DaysOfWeek.MONDAY &&
                        day > 10 &&
                        day < 18 &&
                        day !== 14))
            ) {
                notifications.push(english ? 'Ba`hab' : 'סליחות בה"ב');
                notifications.push(english ? 'Avinu Malkeinu' : 'אבינו מלכנו');
            }
            break;
        case 3: //Sivan
            if (day < 13) {
                dayInfo.noTachnun = true;
            }
            if (day === 6 && isMorning) {
                notifications.push(english ? 'Shavuos' : 'יום טוב של שבועות');
                notifications.push(english ? 'Full Hallel' : 'הלל השלם');
                notifications.push(english ? 'Megilas Rus' : 'מגילת רות');
                notifications.push(english ? 'Akdamus' : 'אקדמות');
                if (israel) notifications.push(english ? 'Yizkor' : 'יזכור');
                if (showGaonShir) {
                    notifications.push('שיר של יום - י"ט - ..השמים מספרים..');
                }
            } else if (day === 7) {
                if (israel) {
                    notifications.push('איסרו חג');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push('א"א למנצח');
                    }
                } else {
                    notifications.push(
                        english ? 'Shavuos Second Day' : 'יום טוב של שבועות',
                    );
                    notifications.push(english ? 'Full Hallel' : 'הלל השלם');
                    notifications.push(english ? 'Yizkor' : 'יזכור');
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
                    notifications.push(
                        english ? 'Shiva Asar B`Tamuz' : 'י"ז בתמוז',
                    );
                    notifications.push(
                        english ? 'Avinu Malkeinu' : 'אבינו מלכנו',
                    );
                    notifications.push(english ? 'Aneinu' : 'עננו');
                }
                if (isMorning) {
                    notifications.push(english ? 'Selichos' : 'סליחות');
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
                notifications.push(english ? 'Tish B`Av' : 'תשעה באב');
                if (isDaytime) {
                    notifications.push(english ? 'Kinos' : 'קינות');
                    notifications.push(english ? 'Aneinu' : 'עננו');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push(
                            english ? 'No Laminatzeach' : 'א"א למנצח',
                        );
                    }
                } else {
                    notifications.push(
                        english ? 'Megilas Eicha' : 'מגילת איכה',
                    );
                    if (isNightTime && dow === DaysOfWeek.SUNDAY) {
                        notifications.push(
                            english ? 'No Vihi Noam' : 'א"א ויהי נועם',
                        );
                    }
                }
                dayInfo.noTachnun = true;
            } else if (isAfternoon && day === 14) {
                dayInfo.noTachnun = true;
            } else if (day === 15) {
                notifications.push(english ? 'Tu B`Av' : 'ט"ו באב');
                dayInfo.noTachnun = true;
            }
            break;
        case 6: //Ellul
            notifications.push(english ? 'L`Dovid Hashem Ori' : "לדוד ה' אורי");
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
                    notifications.push(english ? 'Selichos' : 'סליחות');
                }
            }
            if (day === 29) {
                dayInfo.noTachnun = true;
            }
            break;
        case 7: //Tishrei
            if (day < 11) {
                notifications.push(
                    english ? 'Hamelech Hakadosh' : 'המלך הקדוש',
                );
                if (dow !== DaysOfWeek.SHABBOS && day !== 9) {
                    notifications.push(
                        english ? 'Avinu Malkeinu' : 'אבינו מלכנו',
                    );
                }
            }
            //Days of Rosh Hashana, Tzom Gedaliah and Yom Kippur are dealt with individually below.
            if (day > 4 && day < 10 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push(english ? 'Selichos' : 'סליחות');
                notifications.push(
                    english ? 'Hamelech Hamishpat' : 'המלך המשפט',
                );
            }
            if (dow === DaysOfWeek.SHABBOS && day > 2 && day < 10) {
                notifications.push(english ? 'Shabbos Shuva' : 'שבת שובה');
            }
            if (day >= 10) {
                dayInfo.noTachnun = true;
            }
            switch (day) {
                case 1:
                    notifications.push(english ? 'Rosh Hashana' : 'ראש השנה');
                    if (dow !== DaysOfWeek.SHABBOS && isDaytime) {
                        notifications.push(
                            english ? 'Tekias Shofar' : 'תקיעת שופר',
                        );
                        if (showGaonShir) {
                            notifications.push(
                                'שיר של יום - פ"א - למנצח על הגתית',
                            );
                        }
                        if (isAfternoon) {
                            notifications.push(english ? 'Tashlich' : 'תשליך');
                        }
                    }
                    break;
                case 2:
                    notifications.push(english ? 'Rosh Hashana' : 'ראש השנה');
                    if (isDaytime) {
                        notifications.push(
                            english ? 'Tekias Shofar' : 'תקיעת שופר',
                        );
                        if (showGaonShir) {
                            notifications.push(
                                'שיר של יום - פ"א - למנצח על הגתית',
                            );
                        }
                        if (dow === DaysOfWeek.SUNDAY && isAfternoon) {
                            notifications.push(english ? 'Tashlich' : 'תשליך');
                        }
                    }
                    break;
                case 3:
                    if (dow !== DaysOfWeek.SHABBOS) {
                        if (isDaytime) {
                            notifications.push(
                                english ? 'Fast of Tzom Gedalya' : 'צום גדליה',
                            );
                            notifications.push(english ? 'Aneinu' : 'עננו');
                        }
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push(english ? 'Selichos' : 'סליחות');
                        }
                        notifications.push(
                            english ? 'Hamelech Hamishpat' : 'המלך המשפט',
                        );
                    }
                    break;
                case 4:
                    if (dow === DaysOfWeek.SUNDAY) {
                        if (isDaytime) {
                            notifications.push(
                                english ? 'Fast of Tzom Gedalya' : 'צום גדליה',
                            );
                            notifications.push(english ? 'Aneinu' : 'עננו');
                        }
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push(english ? 'Selichos' : 'סליחות');
                        }
                        notifications.push(
                            english ? 'Hamelech Hamishpat' : 'המלך המשפט',
                        );
                    } else if (dow !== DaysOfWeek.SHABBOS) {
                        notifications.push(
                            english ? 'Hamelech Hamishpat' : 'המלך המשפט',
                        );
                        if (isAfterChatzosHalayla || isMorning) {
                            notifications.push(english ? 'Selichos' : 'סליחות');
                        }
                    }
                    break;
                case 9:
                    notifications.push(
                        english ? 'Erev Yom Kippur' : 'ערב יום כיפור',
                    );
                    if (isMorning) {
                        notifications.push(
                            english ? 'No Mizmor L`Sodah' : 'א"א מזמור לתודה',
                        );
                        if (dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                english ? 'No Laminatzeach' : 'א"א למנצח',
                            );
                        }
                        if (dow === DaysOfWeek.FRIDAY) {
                            notifications.push(
                                english ? 'Avinu Malkeinu' : 'אבינו מלכנו',
                            );
                        }
                    } else if (isAfternoon) {
                        notifications.push(english ? 'Vidduy' : 'ודוי בעמידה');
                    }
                    if (isDaytime && dow !== DaysOfWeek.FRIDAY) {
                        notifications.push(
                            english ? 'No Avinu Malkeinu' : 'א"א אבינו מלכנו',
                        );
                    }
                    dayInfo.noTachnun = true;
                    break;
                case 10:
                    notifications.push(english ? 'Yom Kippur' : 'יום הכיפורים');
                    notifications.push("לפני ה' תטהרו");
                    if (isDaytime) {
                        notifications.push(english ? 'Yizkor' : 'יזכור');
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
                    notifications.push(
                        english ? 'First day of Sukkos' : 'יו"ט ראשון של סוכות',
                    );
                    if (isDaytime) {
                        notifications.push(
                            english ? 'Full Hallel' : 'הלל השלם',
                        );
                        if (dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                english
                                    ? 'Hoshanos - למען אמתך'
                                    : 'הושענות - למען אמתך',
                            );
                            notifications.push(english ? 'Kah Keli' : 'קה קלי');
                            if (showGaonShir) {
                                notifications.push(
                                    'שיר של יום - ע"ו - למנצח בנגינות מזמור',
                                );
                            }
                        } else {
                            notifications.push(
                                english
                                    ? 'Hoshanos - אום נצורה'
                                    : 'הושענות - אום נצורה',
                            );
                        }
                    }
                    break;
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                    if (day === 16 && !israel) {
                        notifications.push(
                            english
                                ? 'Second day of Sukkos'
                                : 'סוכות - יום טוב שני',
                        );
                    } else if (!israel) {
                        notifications.push(
                            english
                                ? 'Chol Hamoed Sukkos'
                                : 'סוכות - חול המועד',
                        );
                        notifications.push(
                            english ? 'Ya`aleh V`yavo' : 'יעלה ויבא',
                        );
                    }
                    if (isDaytime) {
                        notifications.push('הלל השלם');
                        switch (day) {
                            case 16:
                                notifications.push(
                                    'הושענות - ' +
                                        (dow === DaysOfWeek.SUNDAY
                                            ? 'למען אמתך'
                                            : 'אבן שתיה'),
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    notifications.push(
                                        'שיר של יום - כ"ט - ..הבו לה\' בני אלים',
                                    );
                                }
                                break;
                            case 17:
                                notifications.push(
                                    (english ? 'Hoshanos' : 'הושענות') +
                                        ' - ' +
                                        (dow === DaysOfWeek.SHABBOS
                                            ? 'אום נצורה'
                                            : 'אערוך שועי'),
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    notifications.push(
                                        "שיר של יום - נ' - מזמור לאסף",
                                    );
                                }
                                break;
                            case 18:
                                if (dow === DaysOfWeek.SUNDAY) {
                                    notifications.push(
                                        (english ? 'Hoshanos' : 'הושענות') +
                                            ' - אערוך שועי',
                                    );
                                    if (
                                        showGaonShir &&
                                        dow !== DaysOfWeek.SHABBOS
                                    ) {
                                        notifications.push(
                                            "שיר של יום - נ' - מזמור לאסף",
                                        );
                                    }
                                } else {
                                    if (dow === DaysOfWeek.TUESDAY) {
                                        notifications.push(
                                            (english ? 'Hoshanos' : 'הושענות') +
                                                ' - אבן שתיה',
                                        );
                                    } else if (dow === DaysOfWeek.THURSDAY) {
                                        notifications.push(
                                            (english ? 'Hoshanos' : 'הושענות') +
                                                ' - אום אני חומה',
                                        );
                                    } else if (dow === DaysOfWeek.FRIDAY) {
                                        notifications.push(
                                            (english ? 'Hoshanos' : 'הושענות') +
                                                ' - א-ל למושעות',
                                        );
                                    }
                                    if (
                                        showGaonShir &&
                                        dow !== DaysOfWeek.SHABBOS
                                    ) {
                                        notifications.push(
                                            'שיר של יום - צ"ד - ..מי יקום לי..',
                                        );
                                    }
                                }
                                break;
                            case 19:
                                notifications.push(
                                    (english ? 'Hoshanos' : 'הושענות') +
                                        ' - ' +
                                        (dow === DaysOfWeek.SHABBOS
                                            ? 'אום נצורה'
                                            : 'א-ל למושעות'),
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    if (dow === DaysOfWeek.MONDAY) {
                                        notifications.push(
                                            'שיר של יום - צ"ד - ..מי יקום לי..',
                                        );
                                    } else {
                                        notifications.push(
                                            'שיר של יום - צ"ד - א-ל נקמות.. ישרי לב',
                                        );
                                    }
                                }
                                break;
                            case 20:
                                notifications.push(
                                    (english ? 'Hoshanos' : 'הושענות') +
                                        ' - ' +
                                        (dow === DaysOfWeek.SHABBOS
                                            ? 'אום נצורה'
                                            : 'אדון המושיע'),
                                );
                                if (
                                    showGaonShir &&
                                    dow !== DaysOfWeek.SHABBOS
                                ) {
                                    if (dow === DaysOfWeek.THURSDAY) {
                                        notifications.push(
                                            'שיר של יום - פ"א - למנצח על הגתית',
                                        );
                                    } else {
                                        notifications.push(
                                            'שיר של יום - צ"ד - א-ל נקמות.. ישרי לב',
                                        );
                                    }
                                }
                                break;
                        }
                    }
                    break;
                case 21:
                    notifications.push(english ? 'Hoshana Raba' : 'הושעה רבה');
                    notifications.push(
                        english ? 'Ya`aleh V`yavo' : 'יעלה ויבא',
                    );
                    if (isNightTime) {
                        notifications.push(
                            english ? 'Mishneh Torah' : 'משנה תורה',
                        );
                    } else {
                        notifications.push(
                            (english ? 'Hoshanos' : 'הושענות') + ' - הושעה רבה',
                        );
                        notifications.push(
                            english ? 'Full Hallel' : 'הלל השלם',
                        );
                        if (showGaonShir) {
                            if (dow === DaysOfWeek.FRIDAY) {
                                notifications.push(
                                    'שיר של יום - פ"ב - מזמור לאסף',
                                );
                            } else {
                                notifications.push(
                                    'שיר של יום - פ"א - למנצח על הגתית',
                                );
                            }
                        }
                    }
                    break;
                case 22:
                    notifications.push(
                        english ? 'Shmini Atzeres' : 'שמיני עצרת',
                    );
                    if (israel) {
                        notifications.push('Simchas Torah', 'שמחת תורה');
                        notifications.push('Hakafos', 'הקפות');
                    }
                    if (isDaytime) {
                        notifications.push(
                            english ? 'Full Hallel' : 'הלל השלם',
                        );
                        notifications.push(english ? 'Yizkor' : 'יזכור');
                        notifications.push(
                            english ? 'Tefilas Geshem' : 'תפילת גשם',
                        );
                        notifications.push('משיב הרוח ומוריד הגשם');
                        if (showGaonShir && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                'שיר של יום - י"ב - למנצח על השמינית',
                            );
                        }
                    }
                    break;
            }
            if (day === 23) {
                if (!israel) {
                    notifications.push('Simchas Torah', 'שמחת תורה');
                    notifications.push('Hakafos', 'הקפות');
                    notifications.push(english ? 'Full Hallel' : 'הלל השלם');
                } else {
                    notifications.push('איסרו חג');
                    if (isNightTime) {
                        notifications.push('חורף טוב');
                    } else if (dow !== DaysOfWeek.SHABBOS && isMorning) {
                        notifications.push('א"א למנצח');
                    }
                }
            } else if (
                dow === DaysOfWeek.SHABBOS &&
                [15, 17, 18, 19, 20].includes(day)
            ) {
                notifications.push(english ? 'Megilas Koheles' : 'מגילת קהלת');
            }
            if (day < 22) {
                notifications.push(
                    english ? 'L`Dovid Hashem Ori' : "לדוד ה' אורי",
                );
            } else if (day > 22) {
                notifications.push(
                    english
                        ? 'Mashiv Haruach U`Morid Hageshem'
                        : 'משיב הרוח ומוריד הגשם',
                );
            }
            break;
        case 8: //Cheshvan
            if (
                isDaytime &&
                ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
                    (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
                    (dow === DaysOfWeek.MONDAY && day > 10 && day < 18))
            ) {
                notifications.push(english ? 'Ba`Hab' : 'סליחות בה"ב');
                notifications.push(english ? 'Avinu Malkeinu' : 'אבינו מלכנו');
            }
            if (day <= 22) {
                notifications.push(
                    english
                        ? 'Mashiv Haruach U`Morid Hageshem'
                        : 'משיב הרוח ומוריד הגשם',
                );
            }
            if (day >= 7 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push(
                    english ? 'V`sain Tal U`matar' : 'ותן טל ומטר',
                );
            }
            break;
        case 9: //Kislev
            if (day <= 7 && dow !== DaysOfWeek.SHABBOS) {
                notifications.push(
                    english ? 'V`sain Tal U`matar' : 'ותן טל ומטר',
                );
            } else if (
                day === 24 &&
                dow !== DaysOfWeek.SHABBOS &&
                isAfternoon
            ) {
                dayInfo.noTachnun = true;
            } else if (day >= 25) {
                dayInfo.noTachnun = true;
                notifications.push(english ? 'Chanukah' : 'חנוכה');
                notifications.push(english ? 'Al Hanissim' : 'על הניסים');
                if (isDaytime) {
                    notifications.push(english ? 'Full Hallel' : 'הלל השלם');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS)
                        notifications.push(
                            english ? 'No Laminatzeach' : 'א"א למנצח',
                        );
                    if (
                        showGaonShir &&
                        day !== 30 &&
                        dow !== DaysOfWeek.SHABBOS
                    ) {
                        notifications.push(
                            "שיר של יום - ל' - מזמור שיר חנוכת הבית",
                        );
                    }
                }
            }
            break;
        case 10: //Teves
            if (day <= (jDate.isShortKislev(jdate.Year) ? 3 : 2)) {
                dayInfo.noTachnun = true;
                notifications.push(english ? 'Chanukah' : 'חנוכה');
                notifications.push(english ? 'Al Hanissim' : 'על הניסים');
                if (isDaytime) {
                    notifications.push(english ? 'Full Hallel' : 'הלל השלם');
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push(
                            english ? 'No Laminatzeach' : 'א"א למנצח',
                        );
                        if (day !== 1 && showGaonShir) {
                            notifications.push(
                                "שיר של יום - ל' - מזמור שיר חנוכת הבית",
                            );
                        }
                    }
                }
            } else if (day === 10 && isDaytime) {
                notifications.push(
                    english ? 'Fast of Asara B`Teves' : 'עשרה בטבת',
                );
                if (isMorning) {
                    notifications.push(english ? 'Selichos' : 'סליחות');
                }
                notifications.push(english ? 'Avinu Malkeinu' : 'אבינו מלכנו');
                notifications.push(english ? 'Aneinu' : 'עננו');
            }
            break;
        case 11: //Shvat
            if (day === 14 && isAfternoon) dayInfo.noTachnun = true;
            if (day === 15) {
                dayInfo.noTachnun = true;
                notifications.push(english ? 'Tu B`Shvat' : 'ט"ו בשבט');
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
                        day === 14
                            ? english
                                ? 'Purim Katan'
                                : 'פורים קטן'
                            : english
                            ? 'Shushan Purim Katan'
                            : 'שושן פורים קטן',
                    );
                    dayInfo.noTachnun = true;
                    if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                        notifications.push(
                            english ? 'No Laminatzeach' : 'א"א למנצח',
                        );
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
                        notifications.push(
                            english ? 'Fast of Ta`anis Esther' : 'תענית אסתר',
                        );
                        notifications.push(english ? 'Selichos' : 'סליחות');
                    }
                    notifications.push(
                        english ? 'Avinu Malkeinu' : 'אבינו מלכנו',
                    );
                    notifications.push(english ? 'Aneinu' : 'עננו');
                } else {
                    //Only ירושלים says על הניסים on ט"ו
                    const isYerushalayim = location.Name === 'ירושלים';
                    if (day === 14) {
                        dayInfo.noTachnun = true;
                        if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                english ? 'No Laminatzeach' : 'א"א למנצח',
                            );
                        }
                        //On a Purim Meshulash in Yerushalayim, מגילת אסתר is on י"ד
                        if (!isYerushalayim || dow === DaysOfWeek.FRIDAY) {
                            notifications.push(
                                english ? 'Megilas Esther' : 'מגילת אסתר',
                            );
                            if (!isYerushalayim) {
                                notifications.push(english ? 'Purim' : 'פורים');
                                notifications.push(
                                    english ? 'Al Hanissim' : 'על הניסים',
                                );
                                if (showGaonShir) {
                                    notifications.push(
                                        'שיר של יום - כ"ב - למנצח על אילת השחר',
                                    );
                                }
                            } else {
                                //On a Purim Meshulash in Yerushalayim, מתנות לאביונים is on י"ד
                                notifications.push(
                                    english
                                        ? 'Matanos LeEvyonim'
                                        : 'מתנות לאביונים',
                                );
                            }
                        } else {
                            notifications.push(
                                english ? 'Purim D`Prazim' : 'פורים דפרזים',
                            );
                        }
                    } else if (day === 15) {
                        dayInfo.noTachnun = true;
                        if (isMorning && dow !== DaysOfWeek.SHABBOS) {
                            notifications.push(
                                english ? 'No Laminatzeach' : 'א"א למנצח',
                            );
                        }
                        if (isYerushalayim) {
                            notifications.push(english ? 'Purim' : 'פורים');
                            notifications.push(
                                english ? 'Al Hanissim' : 'על הניסים',
                            );
                            if (dow !== DaysOfWeek.SHABBOS) {
                                notifications.push(
                                    english ? 'Megilas Esther' : 'מגילת אסתר',
                                );
                            }
                            if (
                                showGaonShir &&
                                isDaytime &&
                                dow !== DaysOfWeek.SHABBOS
                            ) {
                                notifications.push(
                                    'שיר של יום - כ"ב - למנצח על אילת השחר',
                                );
                            }
                        } else if (
                            [
                                'טבריה',
                                'יפו',
                                'עכו',
                                'צפת',
                                'באר שבע',
                                'חיפה',
                                'באר שבע',
                                'בית שאן',
                                'לוד',
                            ].includes(location.Name)
                        ) {
                            notifications.push(
                                english ? 'Purim D`Mukafin' : 'פורים דמוקפין',
                            );
                            if (dow !== DaysOfWeek.SHABBOS) {
                                notifications.push(
                                    english
                                        ? '(Megilas Esther)'
                                        : '(מגילת אסתר)',
                                );
                            }
                        } else {
                            notifications.push(
                                english ? 'Shushan Purim' : 'שושן פורים',
                            );
                        }
                    } else if (
                        day === 16 &&
                        isYerushalayim &&
                        dow === DaysOfWeek.SUNDAY
                    ) {
                        notifications.push(
                            english
                                ? 'Purim Seuda and Mishloach Manos'
                                : 'סעודת פורים ומשלוח מנות',
                        );
                    }
                }
            }
            break;
    }
}

function hasOwnKriyasHatorah(jdate, location) {
    const {Month, Day, DayOfWeek} = jdate;
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
                (Day === 13 || Day === (location.Name === 'ירושלים' ? 15 : 14))
            );
        default:
            return false;
    }
}
