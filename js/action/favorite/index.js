import Types from '../types'
import DataStorage, {FLAG_STORAGE} from '../../expand/dao/DataStorage'
import {handleData} from '../ActionUtil'
import {_projectModels} from '../ActionUtil'
import ProjectModel from '../../model/ProjectModel'
import FavoriteDao from '../../expand/dao/FavoriteDao'
// 获取最热数据的异步action

/**
 * 
 * @param {*} flag 
 * @param {*} isShowLoading 
 */
export function onLoadFavoriteData(flag, isShowLoading) {
    return dispatch => {
        console.log('onLoadFavoriteData')
        if(isShowLoading) {  
            dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag});
        }
        new FavoriteDao(flag).getAllItems()
            .then(items => {
                let res = []
                items.forEach((item, index) => {
                    res.push(new ProjectModel(item, true))
                })
                dispatch({type: Types.FAVORITE_LOAD_SUCCESS, projectModels: res, storeName: flag})
            })
            .catch(e => {
                console.log(e)
                dispatch({type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag})
            })
    }
}
