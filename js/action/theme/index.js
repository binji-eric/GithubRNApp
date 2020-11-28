import Types from '../types'
// onThemeChange 纯函数
export function onThemeChange(theme) {
    return {type: Types.THEME_CHANGE, theme: theme}
}