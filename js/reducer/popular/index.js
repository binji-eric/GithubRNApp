import Types from '../../action/types'

const defaultState = {};
/**
 *  popular: {
 *      java: {
 *          items: [],
 *          isLoading: false
 *      }
 *      ios: {
 *          items: [],
 *          isLoading: false
 *      }
 * }
 * 1, 如何动态设置store， 动态获取store，因为storeKey不固定
 * 
 */
export default function onAction( state = defaultState, action) {
    switch(action.type) {
        // 下载刷新成功
        case Types.POPULAR_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,  // 本次加载的数据
                    items: action.items, //  原始数据
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                }
            };
        // 下载刷新
        case Types.POPULAR_REFRESH: 
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: false
                }
            };
        // 下载刷新失败
        case Types.POPULAR_REFRESH_FAIL: 
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        // 上拉加载更多成功
        case Types.POPULAR_LOAD_MORE_SUCCESS: 
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }
            };
        // 上拉加载更多失败
        case Types.POPULAR_LOAD_MORE_FAIL: 
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true, // 没有跟多的数据可以加载，需要隐藏底部的loadMore
                    pageIndex: action.pageIndex
                }
            };
             // 刷新收藏内容
        case Types.POPULAR_FLUSH_FAVORITE: 
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels
                }
            };
        default:
            return state;
    }
}