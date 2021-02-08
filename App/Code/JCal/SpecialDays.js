import { has } from '../GeneralUtils';
import jDate from './jDate';
import Utils from './Utils';
/**
 * Gets an Array[String] of holidays, fasts and any other special specifications for the given Jewish date.
 * @param {jDate} jd
 * @param {boolean} israel
 * @param {boolean} hebrew
 */
export function getSpecialDays(jd, israel, hebrew) {
    const list = [],
        jYear = jd.Year,
        jMonth = jd.Month,
        jDay = jd.Day,
        dayOfWeek = jd.getDayOfWeek(),
        isLeapYear = jDate.isJdLeapY(jYear),
        secDate = jd.getDate();

    if (dayOfWeek === 5) {
        list.push(!hebrew ? 'Erev Shabbos' : 'ערב שבת');
    } else if (dayOfWeek === 6) {
        list.push(!hebrew ? 'Shabbos Kodesh' : 'שבת קודש');

        if (jMonth === 1 && jDay > 7 && jDay < 15) {
            list.push(!hebrew ? 'Shabbos HaGadol' : 'שבת הגדול');
        } else if (jMonth === 7 && jDay > 2 && jDay < 10) {
            list.push(!hebrew ? 'Shabbos Shuva' : 'שבת שובה');
        } else if (jMonth === 5 && jDay > 2 && jDay < 10) {
            list.push(!hebrew ? 'Shabbos Chazon' : 'שבת חזון');
        } else if (
            (jMonth === (isLeapYear ? 12 : 11) && jDay > 24) ||
            (jMonth === (isLeapYear ? 13 : 12) && jDay === 1)
        ) {
            list.push(!hebrew ? 'Parshas Shkalim' : 'פרשת שקלים');
        } else if (jMonth === (isLeapYear ? 13 : 12) && jDay > 7 && jDay < 14) {
            list.push(!hebrew ? 'Parshas Zachor' : 'פרשת זכור');
        } else if (
            jMonth === (isLeapYear ? 13 : 12) &&
            jDay > 16 &&
            jDay < 24
        ) {
            list.push(!hebrew ? 'Parshas Parah' : 'פרשת פרה');
        } else if (
            (jMonth === (isLeapYear ? 13 : 12) && jDay > 23 && jDay < 30) ||
            (jMonth === 1 && jDay === 1)
        ) {
            list.push(!hebrew ? 'Parshas Hachodesh' : 'פרשת החודש');
        }

        //All months but Tishrei have Shabbos Mevarchim on the Shabbos before Rosh Chodesh
        if (jMonth != 6 && jDay > 22 && jDay < 30)
            list.push(!hebrew ? 'Shabbos Mevarchim' : 'מברכים החודש');

        const pa = jd.getPirkeiAvos(israel);
        if (pa.length) {
            list.push(
                !hebrew
                    ? 'Pirkei Avos - ' +
                          /**
                     * @param {number} s
                     */
                          pa
                              .map((s) => Utils.toSuffixed(s) + ' Perek')
                              .join(' and ')
                    : 'פרקי אבות - ' +
                          /**
                     * @param {number} s
                     */
                          pa.map((s) => Utils.toJNum(s) + ' פרק').join('ו')
            );
        }
    }
    if (jDay === 30) {
        const monthIndex =
            (jMonth === 12 && !isLeapYear) || jMonth === 13 ? 1 : jMonth + 1;
        list.push(
            !hebrew
                ? 'Rosh Chodesh ' + Utils.jMonthsEng[monthIndex]
                : 'ראש חודש ' + Utils.jMonthsHeb[monthIndex]
        );
    } else if (jDay === 1 && jMonth != 7) {
        list.push(
            !hebrew
                ? 'Rosh Chodesh ' + Utils.jMonthsEng[jMonth]
                : 'ראש חודש ' + Utils.jMonthsHeb[jMonth]
        );
    }
    //V'sain Tal U'Matar in Chutz La'aretz is according to the secular date
    if (dayOfWeek !== 6 && !israel && secDate.getMonth() === 11) {
        const sday = secDate.getDate();
        //The three possible dates for starting vt"u are the 5th, 6th and 7th of December
        if (has(sday, 5, 6, 7)) {
            const nextYearIsLeap = jDate.isJdLeapY(jYear + 1);
            //If next year is not a leap year, then vst"u starts on the 5th.
            //If next year is a leap year than vst"u starts on the 6th.
            //If the 5th or 6th were shabbos than vst"u starts on Sunday.
            if (
                ((sday === 5 || (sday === 6 && dayOfWeek === 0)) &&
                    !nextYearIsLeap) ||
                ((sday === 6 || (sday === 7 && dayOfWeek === 0)) &&
                    nextYearIsLeap)
            )
                list.push(!hebrew ? 'V\'sain Tal U\'Matar' : 'ותן טל ומטר');
        }
    }
    switch (jMonth) {
        case 1: //Nissan
            if (jDay === 12 && dayOfWeek === 4)
                list.push(!hebrew ? 'Bedikas Chametz' : 'בדיקת חמץ');
            else if (jDay === 13 && dayOfWeek !== 5)
                list.push(!hebrew ? 'Bedikas Chametz' : 'בדיקת חמץ');
            else if (jDay === 14)
                list.push(!hebrew ? 'Erev Pesach' : 'ערב פסח');
            else if (jDay === 15)
                list.push(!hebrew ? 'First Day of Pesach' : 'פסח - יום ראשון');
            else if (jDay === 16)
                list.push(
                    israel
                        ? !hebrew
                            ? 'Pesach - Chol HaMoed'
                            : 'פסח - חול המועד'
                        : !hebrew
                        ? 'Pesach - Second Day'
                        : 'פסח - יום שני'
                );
            else if (has(jDay, 17, 18, 19))
                list.push(
                    !hebrew ? 'Pesach - Chol Ha\'moed' : 'פסח - חול המועד'
                );
            else if (jDay === 20)
                list.push(
                    !hebrew
                        ? 'Pesach - Chol Ha\'moed - Erev Yomtov'
                        : 'פסח - חול המועד - ערב יו"ט'
                );
            else if (jDay === 21)
                list.push(!hebrew ? '7th Day of Pesach' : 'שביעי של פסח');
            else if (jDay === 22 && !israel)
                list.push(!hebrew ? 'Last Day of Pesach' : 'אחרון של פסח');
            break;
        case 2: //Iyar
            if (dayOfWeek === 1 && jDay > 3 && jDay < 13) {
                list.push(!hebrew ? 'Bahab' : 'תענית שני קמא');
            } else if (dayOfWeek === 4 && jDay > 6 && jDay < 14) {
                list.push(!hebrew ? 'Bahab' : 'תענית חמישי');
            } else if (dayOfWeek === 1 && jDay > 10 && jDay < 18) {
                list.push(!hebrew ? 'Bahab' : 'תענית שני בתרא');
            }
            if (jDay === 14) list.push(!hebrew ? 'Pesach Sheini' : 'פסח שני');
            else if (jDay === 18)
                list.push(!hebrew ? 'Lag BaOmer' : 'ל"ג בעומר');
            break;
        case 3: //Sivan
            if (jDay === 5) list.push(!hebrew ? 'Erev Shavuos' : 'ערב שבועות');
            else if (jDay === 6)
                list.push(
                    israel
                        ? !hebrew
                            ? 'Shavuos'
                            : 'חג השבועות'
                        : !hebrew
                        ? 'Shavuos - First Day'
                        : 'שבועות - יום ראשון'
                );
            if (jDay === 7 && !israel)
                list.push(
                    !hebrew ? 'Shavuos - Second Day' : 'שבועות - יום שני'
                );
            break;
        case 4: //Tamuz
            if (jDay === 17 && dayOfWeek !== 6) {
                list.push(!hebrew ? 'Fast - 17th of Tammuz' : 'צום י"ז בתמוז');
            } else if (jDay === 18 && dayOfWeek === 0) {
                list.push(!hebrew ? 'Fast - 17th of Tammuz' : 'צום י"ז בתמוז');
            }
            break;
        case 5: //Av
            if (jDay === 9 && dayOfWeek !== 6)
                list.push(!hebrew ? 'Tisha B\'Av' : 'תשעה באב');
            else if (jDay === 10 && dayOfWeek === 0)
                list.push(!hebrew ? 'Tisha B\'Av' : 'תשעה באב');
            else if (jDay === 15) list.push(!hebrew ? 'Tu B\'Av' : 'ט"ו באב');
            break;
        case 6: //Ellul
            if (dayOfWeek === 0 && has(jDay, 21, 22, 24, 26))
                list.push(!hebrew ? 'Selichos' : 'מתחילים סליחות');
            else if (jDay === 29)
                list.push(!hebrew ? 'Erev Rosh Hashana' : 'ערב ראש השנה');
            break;
        case 7: //Tishrei
            if (jDay === 1)
                list.push(!hebrew ? 'Rosh Hashana - First Day' : 'ראש השנה');
            else if (jDay === 2)
                list.push(!hebrew ? 'Rosh Hashana - Second Day' : 'ראש השנה');
            else if (jDay === 3 && dayOfWeek !== 6)
                list.push(!hebrew ? 'Tzom Gedalia' : 'צום גדליה');
            else if (jDay === 4 && dayOfWeek === 0)
                list.push(!hebrew ? 'Tzom Gedalia' : 'צום גדליה');
            else if (jDay === 9)
                list.push(!hebrew ? 'Erev Yom Kippur' : 'ערב יום הכיפורים');
            else if (jDay === 10)
                list.push(!hebrew ? 'Yom Kippur' : 'יום הכיפורים');
            else if (jDay === 14)
                list.push(!hebrew ? 'Erev Sukkos' : 'ערב חג הסוכות');
            else if (jDay === 15)
                list.push(!hebrew ? 'First Day of Sukkos' : 'חג הסוכות');
            else if (jDay === 16)
                list.push(
                    israel
                        ? !hebrew
                            ? 'Sukkos - Chol HaMoed'
                            : 'סוכות - חול המועד'
                        : !hebrew
                        ? 'Sukkos - Second Day'
                        : 'יום שני - חג הסוכות'
                );
            else if (has(jDay, 17, 18, 19, 20))
                list.push(
                    !hebrew ? 'Sukkos - Chol HaMoed' : 'סוכות - חול המועד'
                );
            else if (jDay === 21)
                list.push(
                    !hebrew
                        ? 'Hoshana Rabba - Erev Yomtov'
                        : 'הושענא רבה - ערב יו"ט'
                );
            else if (jDay === 22) {
                list.push(!hebrew ? 'Shmini Atzeres' : 'שמיני עצרת');
                if (israel) list.push(!hebrew ? 'Simchas Torah' : 'שמחת תורה');
            } else if (jDay === 23 && !israel)
                list.push(!hebrew ? 'Simchas Torah' : 'שמחת תורה');
            break;
        case 8: //Cheshvan
            if (dayOfWeek === 1 && jDay > 3 && jDay < 13) {
                list.push(!hebrew ? 'Bahab' : 'תענית שני קמא');
            } else if (dayOfWeek === 4 && jDay > 6 && jDay < 14) {
                list.push(!hebrew ? 'Bahab' : 'תענית חמישי');
            } else if (dayOfWeek === 1 && jDay > 10 && jDay < 18) {
                list.push(!hebrew ? 'Bahab' : 'תענית שני בתרא');
            }
            if (jDay === 7 && israel)
                list.push(!hebrew ? 'V\'sain Tal U\'Matar' : 'ותן טל ומטר');
            break;
        case 9: //Kislev
            if (jDay === 25)
                list.push(!hebrew ? 'Chanuka - One Candle' : '\'חנוכה - נר א');
            else if (jDay === 26)
                list.push(!hebrew ? 'Chanuka - Two Candles' : '\'חנוכה - נר ב');
            else if (jDay === 27)
                list.push(
                    !hebrew ? 'Chanuka - Three Candles' : '\'חנוכה - נר ג'
                );
            else if (jDay === 28)
                list.push(!hebrew ? 'Chanuka - Four Candles' : '\'חנוכה - נר ד');
            else if (jDay === 29)
                list.push(!hebrew ? 'Chanuka - Five Candles' : '\'חנוכה - נר ה');
            else if (jDay === 30)
                list.push(!hebrew ? 'Chanuka - Six Candles' : '\'חנוכה - נר ו');
            break;
        case 10: //Teves
            if (jDate.isShortKislev(jYear)) {
                if (jDay === 1)
                    list.push(
                        !hebrew ? 'Chanuka - Six Candles' : '\'חנוכה - נר ו'
                    );
                else if (jDay === 2)
                    list.push(
                        !hebrew ? 'Chanuka - Seven Candles' : '\'חנוכה - נר ז'
                    );
                else if (jDay === 3)
                    list.push(
                        !hebrew ? 'Chanuka - Eight Candles' : '\'חנוכה - נר ח'
                    );
            } else {
                if (jDay === 1)
                    list.push(
                        !hebrew ? 'Chanuka - Seven Candles' : '\'חנוכה - נר ז'
                    );
                else if (jDay === 2)
                    list.push(
                        !hebrew ? 'Chanuka - Eight Candles' : '\'חנוכה - נר ח'
                    );
            }
            if (jDay === 10)
                list.push(!hebrew ? 'Fast - 10th of Teves' : 'צום עשרה בטבת');
            break;
        case 11: //Shvat
            if (jDay === 15) list.push(!hebrew ? 'Tu B\'Shvat' : 'ט"ו בשבט');
            break;
        case 12: //Both Adars
        case 13:
            if (jMonth === 12 && isLeapYear) {
                //Adar Rishon in a leap year
                if (jDay === 14)
                    list.push(!hebrew ? 'Purim Katan' : 'פורים קטן');
                else if (jDay === 15)
                    list.push(
                        !hebrew ? 'Shushan Purim Katan' : 'שושן פורים קטן'
                    );
            } else {
                //The "real" Adar: the only one in a non-leap-year or Adar Sheini
                if (jDay === 11 && dayOfWeek === 4)
                    list.push(!hebrew ? 'Fast - Taanis Esther' : 'תענית אסתר');
                else if (jDay === 13 && dayOfWeek !== 6)
                    list.push(!hebrew ? 'Fast - Taanis Esther' : 'תענית אסתר');
                else if (jDay === 14) list.push(!hebrew ? 'Purim' : 'פורים');
                else if (jDay === 15)
                    list.push(!hebrew ? 'Shushan Purim' : 'שושן פורים');
            }
            break;
    }

    return list;
}
/**
 * Gets a String with the name of a major holidays or fast
 * @param {jDate} jd
 * @param {boolean} israel
 * @param {boolean} hebrew
 */
export function getMajorHoliday(jd, israel, hebrew) {
    const jYear = jd.Year,
        jMonth = jd.Month,
        jDay = jd.Day,
        dayOfWeek = jd.getDayOfWeek(),
        isLeapYear = jDate.isJdLeapY(jYear);

    switch (jMonth) {
        case 1: //Nissan
            if (jDay >= 15 && jDay <= (israel ? 21 : 22))
                return !hebrew ? 'Pesach' : 'פסח';
            break;
        case 2: //Iyar
            if (jDay === 18) return !hebrew ? 'Lag BaOmer' : 'ל"ג בעומר';
            break;
        case 3: //Sivan
            if (jDay === 6 || (!israel && jDay === 7))
                return !hebrew ? 'Shavuos' : 'שבועות';
            break;
        case 4: //Tamuz
            if (
                (jDay === 17 && dayOfWeek !== 6) ||
                (jDay === 18 && dayOfWeek === 0)
            ) {
                return !hebrew ? '17 Tammuz' : 'י"ז בתמוז';
            }
            break;
        case 5: //Av
            if (
                (jDay === 9 && dayOfWeek !== 6) ||
                (jDay === 10 && dayOfWeek === 0)
            )
                return !hebrew ? 'Tisha B\'Av' : 'תשעה באב';
            break;
        case 7: //Tishrei
            if (jDay === 1 || jDay === 2)
                return !hebrew ? 'Rosh Hashana' : 'ראש השנה';
            else if (
                (jDay === 3 && dayOfWeek !== 6) ||
                (jDay === 4 && dayOfWeek === 0)
            )
                return !hebrew ? 'Tzom Gedalya' : 'צום גדליה';
            else if (jDay === 10) return !hebrew ? 'Yom Kippur' : 'יום כיפור';
            else if (jDay >= 15 && jDay <= 21)
                return !hebrew ? 'Sukkos' : 'סוכות';
            else if (jDay === 22) {
                if (israel) {
                    return !hebrew ? 'Simchas Torah' : 'שמחת תורה';
                } else {
                    return !hebrew ? 'Shmini Atzeres' : 'שמיני עצרת';
                }
            } else if (jDay === 23 && !israel)
                return !hebrew ? 'Simchas Torah' : 'שמחת תורה';
            break;
        case 9: //Kislev
            if (jDay >= 25) return !hebrew ? 'Chanuka' : 'חנוכה';
            break;
        case 10: //Teves
            if (jDay <= 2 || (jDay === 3 && jDate.isShortKislev(jYear)))
                return !hebrew ? 'Chanuka' : 'חנוכה';
            else if (jDay === 10) return !hebrew ? 'Asara B\'Teves' : 'י\' בטבת';
            break;
        case 12: //Both Adars
        case 13:
            //The "real" Adar: the only one in a non-leap-year or Adar Sheini
            if (jMonth === 13 || !isLeapYear) {
                if (
                    (jDay === 11 && dayOfWeek === 4) ||
                    (jDay === 13 && dayOfWeek !== 6)
                )
                    return !hebrew ? 'Taanis Esther' : 'תענית אסתר';
                else if (jDay === 14 || jDay === 15)
                    return !hebrew ? 'Purim' : 'פורים';
            }
            break;
    }
}
