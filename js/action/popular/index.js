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
 * @param favoriteDao
 */
export function onLoadPopularData(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        console.log('onLoadPopularDataKK')
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStorage = new DataStorage();
        // 异步action与数据流
        dataStorage.fetchData(url, FLAG_STORAGE.flag_popular)
            .then( data => {
                console.log('onLoadPopularData')
                handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
            })
            .catch( error => {
                console.log(error);
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
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

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao,callback) { 
    return dispatch => {
        // 模拟网络请求
        setTimeout(() => { 
            // 加载完全部的数据
             if((pageIndex-1)*pageSize >= dataArray.length) {
                callback('no more data')
                console.log('onLoadMoreData', 'over')
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'noe more data',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
             } else {
                 // 这次载入的最大的数据量
                 let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                 _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: projectModels
                    })
                })

             }
        }, 500);
    }
}

// export function onFLushPopularFavorite (storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
//     console.log('***************in the popular onFLushPopularFavorite function*********')
//     return dispatch => {
//         let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
//         _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
//             dispatch({
//                 type: Types.POPULAR_FLUSH_FAVORITE,
//                 storeName,
//                 pageIndex,
//                 projectModels: projectModels
//             })
//         })
//     }
// }


export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    console.log('***************in the popular onFLushPopularFavorite function*********')
    return dispatch=>{
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
            dispatch({
                type: Types.POPULAR_FLUSH_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data,
            })
        })
    }
}
