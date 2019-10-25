import darkTheme from './Styles.dark';
import lightTheme from './Styles.light';

/**
 * @param {'light'|'dark'} theme
 * @param {'app'|'main'|'settingsDrawer'|'customZmanim'} styleType
 * @returns {object}
 */
export default function getStyle(theme, styleType) {
    switch (theme) {
        case 'light':
            switch (styleType) {
                case 'app':
                    return lightTheme.appStyles;
                case 'main':
                    return lightTheme.mainStyles;
                case 'settingsDrawer':
                    return lightTheme.settingsDrawerStyles;
                case 'customZmanim':
                    return lightTheme.customZmanimStyles;
            }
            break;
        default:
            switch (styleType) {
                case 'app':
                    return darkTheme.appStyles;
                case 'main':
                    return darkTheme.mainStyles;
                case 'settingsDrawer':
                    return darkTheme.settingsDrawerStyles;
                case 'customZmanim':
                    return darkTheme.customZmanimStyles;
            }
            break;
    }
}
