export const ZmanTypes = [
    { name: 'chatzosNight', decs: 'חצות הלילה', eng: 'Midnight', heb: 'חצות הלילה' },
    { name: 'alos90', decs: 'עלות השחר - 90 דקות', eng: 'Alos Hashachar', heb: 'עלות השחר' },
    { name: 'alos72', decs: 'עלות השחר - 72 דקות', eng: 'Alos Hashachar', heb: 'עלות השחר' },
    { name: 'talisTefillin', decs: 'זמן עטיפת טלית ותפילין', eng: 'Talis and Tefillin', heb: 'טלית ותפילין' },
    { name: 'netzElevation', decs: 'הנץ החמה בגובה המיקום', eng: 'Sunrise', heb: 'הנץ החמה' },
    { name: 'netzMishor', decs: 'הנץ החמה בגובה פני הים', eng: 'Sunrise', heb: 'הנץ החמה' },
    { name: 'szksMga', decs: 'סזק"ש מג"א', eng: 'Krias Shma - MG"A', heb: 'סזק"ש מג"א' },
    { name: 'szksGra', decs: 'סזק"ש הגר"א', eng: 'Krias Shma - GR"A', heb: 'סזק"ש הגר"א' },
    { name: 'sztMga', decs: 'סז"ת מג"א', eng: 'Tefilla - MG"A', heb: 'סז"ת מג"א' },
    { name: 'sztGra', decs: 'סז"ת הגר"א', eng: 'Tefilla - GR"A', heb: 'סז"ת הגר"א' },
    { name: 'chatzos', decs: 'חצות היום', eng: 'Midday', heb: 'חצות היום' },
    { name: 'minGed', decs: 'מנחה גדולה', eng: 'Mincha Gedola', heb: 'מנחה גדולה' },
    { name: 'minKet', decs: 'מנחה קטנה', eng: 'Mincha Ketana', heb: 'מנחה קטנה' },
    { name: 'plag', decs: 'פלג המנחה', eng: 'Plag HaMincha', heb: 'פלג המנחה' },
    { name: 'shkiaMishor', decs: 'שקיעת החמה מגובה פני הים', eng: 'Sunset', heb: 'שקיעת החמה' },
    { name: 'shkiaElevation', decs: 'שקיעת החמה מגובה המיקום', eng: 'Sunset', heb: 'שקיעת החמה' },
    { name: 'tzais45', decs: '45 דקות אחרי שקיעה', eng: 'Nightfall', heb: 'צאת הכוכבים' },
    { name: 'tzais50', decs: '50 דקות אחרי שקיעה', eng: 'Nightfall', heb: 'צאת הכוכבים' },
    { name: 'tzais72', decs: '72 דקות אחרי שקיעה', eng: 'Rabbeinu Tam', heb: 'צה"כ ר"ת - 72 דקות' },
    { name: 'tzais72Zmaniot', decs: '72 דקות זמניות אחרי שקיעה', eng: 'Rabbeinu Tam', heb: 'צה"כ ר"ת - זמניות' },
    { name: 'tzais72ZmaniotMA', decs: '72 דקות זמניות אחרי שקיעה - מג"א', eng: 'Rabbeinu Tam', heb: 'צה"כ ר"ת - זמניות מג"א' }
];

/**
 * Get the ZmanType with the given name.
 * @param {String} name
 * @returns {{name:String, decs: String, eng: String, heb: String }}
 */
export function getZmanType(name) {
    return ZmanTypes.find(zt =>
        zt.name.toLowerCase() === name.toLowerCase());
}
