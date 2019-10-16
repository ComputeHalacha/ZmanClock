export const ZmanTypes = [
    {
        id: 0,
        desc: 'חצות הלילה',
        eng: 'Midnight',
        heb: 'חצות הלילה',
    },
    {
        id: 1,
        desc: 'עלות השחר - 90 דקות',
        eng: 'Alos Hashachar',
        heb: 'עלות השחר (90)',
    },
    {
        id: 2,
        desc: 'עלות השחר - 72 דקות',
        eng: 'Alos Hashachar',
        heb: 'עלות השחר (72)',
    },
    {
        id: 3,
        desc: 'זמן עטיפת טלית ותפילין - 36 דקות',
        eng: 'Talis and Tefillin',
        heb: 'טלית ותפילין',
    },
    {
        id: 4,
        desc: 'הנץ החמה בגובה המיקום',
        eng: 'Sunrise',
        heb: 'הנץ החמה - מגובה',
    },
    {
        id: 5,
        desc: 'הנץ החמה בגובה פני הים',
        eng: 'Sunrise',
        heb: 'הנץ החמה',
    },
    {
        id: 6,
        desc: 'סזק"ש מג"א',
        eng: 'Krias Shma - MG"A',
        heb: 'סזק"ש מג"א',
    },
    {
        id: 7,
        desc: 'סזק"ש הגר"א',
        eng: 'Krias Shma - GR"A',
        heb: 'סזק"ש הגר"א',
    },
    {
        id: 8,
        desc: 'סז"ת מג"א',
        eng: 'Tefilla - MG"A',
        heb: 'סז"ת מג"א',
    },
    {
        id: 9,
        desc: 'סז"ת הגר"א',
        eng: 'Tefilla - GR"A',
        heb: 'סז"ת הגר"א',
    },
    {
        id: 10,
        desc: 'חצות היום',
        eng: 'Midday',
        heb: 'חצות היום',
    },
    {
        id: 11,
        desc: 'מנחה גדולה',
        eng: 'Mincha Gedola',
        heb: 'מנחה גדולה',
    },
    {
        id: 12,
        desc: 'מנחה קטנה',
        eng: 'Mincha Ketana',
        heb: 'מנחה קטנה',
    },
    {
        id: 13,
        desc: 'פלג המנחה',
        eng: 'Plag HaMincha',
        heb: 'פלג המנחה',
    },
    {
        id: 14,
        desc: 'שקיעת החמה מגובה פני הים',
        eng: 'Sunset',
        heb: 'שקיעת החמה - ממישור',
    },
    {
        id: 15,
        desc: 'שקיעת החמה מגובה המיקום',
        eng: 'Sunset',
        heb: 'שקיעת החמה',
    },
    {
        id: 16,
        desc: '45 דקות אחרי שקיעה',
        eng: 'Nightfall',
        heb: 'צאת הכוכבים (45)',
    },
    {
        id: 17,
        desc: '50 דקות אחרי שקיעה',
        eng: 'Nightfall',
        heb: 'צאת הכוכבים (50)',
    },
    {
        id: 18,
        desc: '72 דקות אחרי שקיעה',
        eng: 'Rabbeinu Tam',
        heb: 'צה"כ ר"ת - 72 דקות',
    },
    {
        id: 19,
        desc: '72 דקות זמניות אחרי שקיעה',
        eng: 'Rabbeinu Tam',
        heb: 'צה"כ ר"ת - זמניות',
    },
    {
        id: 20,
        desc: '72 דקות זמניות אחרי שקיעה - מג"א',
        eng: 'Rabbeinu Tam',
        heb: 'צה"כ ר"ת - זמניות מג"א',
    },
    {
        id: 21,
        desc: 'זמן הדלקת נרות',
        eng: 'Candle lighting time',
        heb: 'זמן הדלקת נרות',
    },
];

/**
 * Get the ZmanType with the given id or name.
 * @param {Number} id
 * @returns {{id:number, desc: String, eng: String, heb: String }}
 */
export function getZmanType(id) {
    return ZmanTypes.find(zt => zt.id === id);
}
