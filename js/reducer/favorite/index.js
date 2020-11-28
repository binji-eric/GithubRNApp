import { ActionSheetIOS } from 'react-native';
import Types from '../../action/types'

const defaultState = {};
/**
 *  favoite: {
 *      popular: {
 *          projectModels: [],
 *          isLoading: false
 *      }
 *      trending: {
 *          projectModels: [],
 *          isLoading: false
 *      }
 * }
 * 1, 如何动态设置store， 动态获取store，因为storeKey不固定
 * 
 */
export default function onAction( state = defaultState, action) {
    switch(action.type) {
        // 获取数据
        case Types.FAVORITE_LOAD_DATA:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        // 获取数据成功
        case Types.FAVORITE_LOAD_SUCCESS: 
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    projectModels: action.projectModels
                }
            };
        // 获取数据失败失败
        case Types.FAVORITE_LOAD_FAIL: 
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        default:
            return state;
    }
}