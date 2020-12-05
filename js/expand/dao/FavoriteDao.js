import AsyncStorage from "@react-native-community/async-storage"
const FAVORITE_KEY_PREFIX = 'favorite_'

export default class FavoriteDao {
    // flag标志是来区分最热模块的收藏，还是趋势模块的收藏
    constructor(flag) {
        this.favoriteKey = FAVORITE_KEY_PREFIX +  flag
    }
    /**
     * 收藏项目
     * @param {*} key   项目id
     * @param {*} value  收藏的项目
     * @param {*} callback 
     */
    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error, result) => {
            if(!error) {
                // 更新favorite的key
                this.updateFavoriteKeys(key, true);
            }
        })
    }

    /**
     * 更新Favorite key集合
     * @param {*} key  
     * @param {*} isAdd true 添加， false 删除
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, res) => {
            if(!error) {
                let favoriteKeys = [];
                if(res) {
                    favoriteKeys = JSON.parse(res)
                } 
                let index = favoriteKeys.indexOf(key)
                // 如果是添加，并且keys中原来不存
                if(isAdd && index === -1) {
                    console.log('save---->>>>', key)
                    favoriteKeys.push(key)
                // 如果是删除，并且keys中原来存在
                } else if(isAdd === false && index != -1){
                     console.log('delete---->>>>', key)
                    favoriteKeys.splice(index, 1)
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
            }
        })
    }
    /**
     * 获取收藏的所有的key值，用来在popular或者trending页面显示被收藏的项目
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if(!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch(e) {
                        reject(e)
                    }
                } else {
                    reject(error)
                }
            })
        })
    }
    /**
     * 取消收藏，移除已收藏的项目
     * @param {*} key 项目的id
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (err, res) => {
            if(!err) {
                // 顺便删除key在keys中的内容
                this.updateFavoriteKeys(key, false)
            }
        })
    }

    /**
     * 用于收藏页获得所有的表项
     */
    getAllItems() {
        return new Promise((resolve, reject) => {
            // 获得popular或者trending页面的所有key
            this.getFavoriteKeys().then((keys) => {
                let items = [];
                if(keys) {
                    // 将所有key对象的items取出
                    AsyncStorage.multiGet(keys, (err, res) => {
                        try {
                           res.map((item) => {
                               let value = item[1]
                               if(value) {
                                   items.push(JSON.parse(value))
                               }
                           }) 
                           resolve(items)
                        } catch (e) {
                            reject(e)
                        }
                    } )
                } else {
                    resolve(items)
                }
            }).catch(e => {
                reject(e)
            })
        })
    }
}