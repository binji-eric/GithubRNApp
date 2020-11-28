import ProjectModel from '../model/ProjectModel'
import Util from '../util/Util'
/**
 * 
 * @param {*} actionType 
 * @param {*} dispatch 
 * @param {*} storeName 
 * @param {*} data 
 * @param {*} pageSize 
 */
export function handleData (actionType, dispatch, storeName, data, pageSize, favoriteDao) {
    let fixItems = [];
     if(data  && data.data) {
         if(Array.isArray(data.data)){
             fixItems = data.data;
         } else if(Array.isArray(data.data.items)) {
            fixItems = data.data.items
         }
     }
    // 第一次要加载的数据
    let showItems = pageSize > fixItems.length ? fixItems: fixItems.slice(0, pageSize)
    _projectModels(showItems, favoriteDao, projectModels => {
        dispatch({
            type: actionType,
            items: fixItems,
            projectModels: projectModels,
            storeName,
            pageIndex: 1
        })
    })
}
/**
 * 根据收藏的状态来包装item
 * @param {*} showItems 
 * @param {*} favoriteDao 
 * @param {*} callback
 */
export async function _projectModels (showItems, favoriteDao, callback) {
    let keys = [];
    try {
        keys = await favoriteDao.getFavoriteKeys();
        // console.log('action util', favoriteDao, keys)
    } catch (e) {
        console.log(e)
    }
    let projectModels = [];
    for(let i = 0, len = showItems.length; i < len ; i++) {
        projectModels.push(new ProjectModel(showItems[i], Util.checkFavorite(showItems[i], keys)))
        // console.log('actionutil',showItems[i].id, projectModels[i].isFavorite, projectModels[i].item.fullName)
    }
    if(typeof callback === 'function') {
        callback(projectModels)
    }
}