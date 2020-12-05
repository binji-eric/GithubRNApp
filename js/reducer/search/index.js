import { act } from 'react-test-renderer';
import Types from '../../action/types'

const defaultState = {
    showText: '搜索',  // 搜索时，会显示取消
    items: [],
    isLoading: false,
    projectModels: [],      // 展示的数据
    hideLoadingMore: true,  // 默认隐藏加载更多
    showBottomButton: false // 不显示收藏搜索词的button
};

export default function onAction( state = defaultState, action) {
    switch(action.type) {
        // 搜索数据
        case Types.SEARCH_REFRESH:
            return {
                ...state,  
                isLoading: true,
                hideLoadingMore: true,
                showBottomButton: false,
                showText: '取消'
            };
        // 搜索数据成功
        case Types.SEARCH_REFRESH_SUCCESS: 
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: false,
                showBottomButton: action.showBottomButton,
                items: action.items,
                projectModels: action.projectModels,
                pageIndex: action.pageIndex,
                showText: '搜索',
                inputKey: action.inputKey
            };
        // 下拉刷新失败
        case Types.SEARCH_FAIL: 
            return {
                ...state,
                isLoading: false,
                showText: '搜索'
            };
        // 取消搜索
        case Types.SEARCH_CANCEL:
            return {
                ...state,
                isLoading: false,
                showText: '搜索'
            }
        // 上拉加载更多成功
        case Types.SEARCH_LOAD_MORE_SUCCESS: 
            return {
                ...state,
                projectModels: action.projectModels,
                hideLoadingMore: false,
                pageIndex: action.pageIndex
            };
        // 上拉加载更多失败
        case Types.SEARCH_LOAD_MORE_FAIL: 
            return {
                ...state,
                hideLoadingMore: true, // 没有跟多的数据可以加载，需要隐藏底部的loadMore
                pageIndex: action.pageIndex
            };
        default:
            return state;
    }
}