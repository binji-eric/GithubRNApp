import Types from '../../action/types';
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";

const defaultState = {
    languages: [],  // languages对应popular的标签
    keys: []  // keys对应trending的标签
};
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS://获取数据成功
            if (FLAG_LANGUAGE.flag_key === action.flag) {
                console.log('language reducers->', action.languages)
                return {
                    ...state,
                    keys: action.languages
                }
            } else {
                return {
                    ...state,
                    languages: action.languages
                }
            }
        default:
            return state;
    }

}