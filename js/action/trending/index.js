import Types from '../types'
import DataStorage, {FLAG_STORAGE} from '../../expand/dao/DataStorage'
import {handleData} from '../ActionUtil'
import {_projectModels} from '../ActionUtil'

// 获取最热数据的异步action
/**
 * 
 * @param {*} storeName 
 * @param {*} url 
 * @param {*} pageSize 
 */
export function onLoadTrendingData(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        console.log('onLoadTrendingDataKK')
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let dataStorage = new DataStorage();
        // 异步action与数据流
        dataStorage.fetchData(url, FLAG_STORAGE.flag_trending)
            .then( data => {
                console.log('onLoadTRENDINGData')
                handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
            })
            .catch( error => {
                console.log(error);
                dispatch({
                    type: Types.TRENDING_REFRESH_FAIL,
                    storeName,
                    error
                })
            })
    }
}
/**
 * 
 * @param {*} storeName 
 * @param {*} pageIndex  第几页
 * @param {*} pageSize   每页展示的条数
 * @param {*} dataArray  原始数据
 * @param {*} callback   回调函数，可以通过回调函数向调用页通信： 异常信息的展示，没有更多toast
 */

export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) { 
    return dispatch => {
        // 模拟网络请求
        setTimeout(() => { 
            // 加载完全部的数据
             if((pageIndex-1)*pageSize >= dataArray.length) {
                callback('no more data')
                console.log('onLoadMoreData', 'over')
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'noe more data',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
             } else {
                 // 这次载入的最大的数据量
                 console.log(dataArray.length, pageIndex, pageSize)
                 let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                 console.log('onLoadMoreData', max)
                 _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
                    dispatch({
                        type: Types.TRENDING_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: projectModels
                    })
                })

             }
        }, 500);
    }
}


export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    console.log('***************in the popular onFlushTrendingFavorite function*********')
    return dispatch=>{
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
            dispatch({
                type: Types.TRENDING_FLUSH_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data,
            })
        })
    }
}
