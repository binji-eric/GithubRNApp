import Types from '../types'
import DataStorage, {FLAG_STORAGE} from '../../expand/dao/DataStorage'
import {handleData} from '../ActionUtil'
import {_projectModels, doCallBack} from '../ActionUtil'
import ArrayUtil from '../../util/ArrayUtil'

const API_URL = 'https://api.github.com/search/repositories?q=';
// the search resutles are ranked by starts
const QUERY_STR = '$sort=starts';
const CANCEL_TOKENS = [];

/**
 * 开始搜索
 * @param {*} inputKey  搜索关键字
 * @param {*} pageSize 
 * @param {*} token 
 * @param {*} favoriteDao 
 * @param {*} popularKeys 
 * @param {*} callBack 
 */
export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
    return dispatch => {
        dispatch({type: Types.SEARCH_REFRESH});
        // 这里获取数据是实时的，不需要缓存
        fetch(genFetchUrl(inputKey)).then(response => {
            // If this fetch mission hasn't be canceled, just leave the response alone
            // 如果这时取消任务，不需要做反序列化parse的步骤
            return hasCancel(token) ? null : response.json();
        }).then (responseData => {
            // 这次判断后，会从CANCEL_TOKENS移除
            if(hasCancel(token, true)) {
                console.log('fetch任务被用户取消');
                return;
            } else if(!responseData || !responseData.items || responseData.items.length === 0){
                dispatch({type: Types.SEARCH_FAIL, message: `Can not find any item about ${inputKey}`});
                doCallBack(callBack, `Can not find any item about ${inputKey}`);
                return;
            }
            // If the response data exists
            let items = responseData.items;
            handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, "", {data: items}, pageSize,favoriteDao, {
                // If inputKey is already in the popularKeys, it shouldn't show the collection button
                showBottomButton: !checkKeyIsExist(popularKeys, inputKey),
                inputKey
            });
        }).catch(e => {
            console.log(e);
            dispatch({type: Types.SEARCH_FAIL, error: e});
        });
    }
}
/**
 * 取消搜索任务
 * @param {*} token 
 */
export function onSearchCancel(token) {
    return dispatch => {
        CANCEL_TOKENS.push(token);
        dispatch({type: Types.SEARCH_CANCEL});
    }
}

/**
 * 
 * @param {*} pageIndex  第几页
 * @param {*} pageSize   每页展示的条数
 * @param {*} dataArray  原始数据
 * @param {*} callback   回调函数，可以通过回调函数向调用页通信： 异常信息的展示，没有更多toast
 */

export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) { 
    return dispatch => {
        // 模拟网络请求
        setTimeout(() => { 
            // 加载完全部的数据
             if((pageIndex-1)*pageSize >= dataArray.length) {
                callBack('no more data')
                console.log('onLoadMoreData', 'over')
                dispatch({
                    type: Types.SEARCH_LOAD_MORE_FAIL,
                    error: 'noe more data',
                    pageIndex: --pageIndex
                })
             } else {
                 // 这次载入的最大的数据量
                 let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                 _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
                    dispatch({
                        type: Types.SEARCH_LOAD_MORE_SUCCESS,
                        pageIndex,
                        projectModels: projectModels
                    })
                })

             }
        }, 500);
    }
}

// 根据input生成url
function genFetchUrl (inputKey) {
    return API_URL + inputKey + QUERY_STR;
}

// fetch mission has been canceled or not?
function hasCancel (token, isRemove) {
    // token在数组中，证明是被取消了
    if(CANCEL_TOKENS.includes(token)) {
        if(isRemove) {
            ArrayUtil.remove(CANCEL_TOKENS, token);
        }
        return true;
    }
    return false;
}

// 检查key是否存在于keys中
function checkKeyIsExist(keys, key) {
    for(let i = 0, l = keys.length; i < l; i++) {
        if(key.toLowerCase() === keys[i].name.toLowerCase())
            return true;
    }
    return false;
}