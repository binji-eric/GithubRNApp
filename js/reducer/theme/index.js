import Types from '../../action/types'

const defaultState = {
    theme: 'black'
};
// reducers的作用是接收state和action，返回新的state
export default function onAction(state = defaultState, action) {
    switch(action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme
            }
        // 默认返回state本身
        default:
            return state;
    }
}