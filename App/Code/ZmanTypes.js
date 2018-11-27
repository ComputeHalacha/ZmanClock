export const ZmanTypes = [
    { name: 'chatzosNight', desc: 'חצות הלילה', eng: 'Midnight', heb: 'חצות הלילה' },
    { name: 'alos90', desc: 'עלות השחר - 90 דקות', eng: 'Alos Hashachar', heb: 'עלות השחר' },
    { name: 'alos72', desc: 'עלות השחר - 72 דקות', eng: 'Alos Hashachar', heb: 'עלות השחר' },
    { name: 'talisTefillin', desc: 'זמן עטיפת טלית ותפילין - 36 דקות', eng: 'Talis and Tefillin', heb: 'טלית ותפילין' },
    { name: 'netzElevation', desc: 'הנץ החמה בגובה המיקום', eng: 'Sunrise', heb: 'הנץ החמה' },
    { name: 'netzMishor', desc: 'הנץ החמה בגובה פני הים', eng: 'Sunrise', heb: 'הנץ החמה' },
    { name: 'szksMga', desc: 'סזק"ש מג"א', eng: 'Krias Shma - MG"A', heb: 'סזק"ש מג"א' },
    { name: 'szksGra', desc: 'סזק"ש הגר"א', eng: 'Krias Shma - GR"A', heb: 'סזק"ש הגר"א' },
    { name: 'sztMga', desc: 'סז"ת מג"א', eng: 'Tefilla - MG"A', heb: 'סז"ת מג"א' },
    { name: 'sztGra', desc: 'סז"ת הגר"א', eng: 'Tefilla - GR"A', heb: 'סז"ת הגר"א' },
    { name: 'chatzos', desc: 'חצות היום', eng: 'Midday', heb: 'חצות היום' },
    { name: 'minGed', desc: 'מנחה גדולה', eng: 'Mincha Gedola', heb: 'מנחה גדולה' },
    { name: 'minKet', desc: 'מנחה קטנה', eng: 'Mincha Ketana', heb: 'מנחה קטנה' },
    { name: 'plag', desc: 'פלג המנחה', eng: 'Plag HaMincha', heb: 'פלג המנחה' },
    { name: 'shkiaMishor', desc: 'שקיעת החמה מגובה פני הים', eng: 'Sunset', heb: 'שקיעת החמה' },
    { name: 'shkiaElevation', desc: 'שקיעת החמה מגובה המיקום', eng: 'Sunset', heb: 'שקיעת החמה' },
    { name: 'tzais45', desc: '45 דקות אחרי שקיעה', eng: 'Nightfall', heb: 'צאת הכוכבים' },
    { name: 'tzais50', desc: '50 דקות אחרי שקיעה', eng: 'Nightfall', heb: 'צאת הכוכבים' },
    { name: 'tzais72', desc: '72 דקות אחרי שקיעה', eng: 'Rabbeinu Tam', heb: 'צה"כ ר"ת - 72 דקות' },
    { name: 'tzais72Zmaniot', desc: '72 דקות זמניות אחרי שקיעה', eng: 'Rabbeinu Tam', heb: 'צה"כ ר"ת - זמניות' },
    { name: 'tzais72ZmaniotMA', desc: '72 דקות זמניות אחרי שקיעה - מג"א', eng: 'Rabbeinu Tam', heb: 'צה"כ ר"ת - זמניות מג"א' }
];

/**
 * Get the ZmanType with the given name.
 * @param {String} name
 * @returns {{name:String, desc: String, eng: String, heb: String }}
 */
export function getZmanType(name) {
    return ZmanTypes.find(zt =>
        zt.name.toLowerCase() === name.toLowerCase());
}
