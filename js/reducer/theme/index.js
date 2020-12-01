import Types from '../../action/types';
import ThemeFactory, {ThemeFlags} from "../../share/styles/ThemeFactory";

const defaultState = {
    theme: ThemeFactory.createTheme(ThemeFlags.Default),
    onShowCustomThemeView: false,
};
// reducers的作用是接收state和action，返回新的state
export default function onAction(state = defaultState, action) {
    console.log('theme reducer', action.theme)
    switch(action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme
            }
        case Types.SHOW_THEME_VIEW:
            return {
                ...state,
                customThemeViewVisible: action.customThemeViewVisible
            }
        // 默认返回state本身
        default:
            return state;
    }
}