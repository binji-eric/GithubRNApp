import AsyncStorage from '@react-native-community/async-storage'
import Trending from 'GitHubTrending'
export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}
const AUTH_TOKEN = 'fd82d1e882462e23b8e88aa82198f166';

export default class DataStorage {
    saveData(url, data, callback) {
        if(!data || !url) 
            return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }
    // 包装数据
    _wrapData (data) {
        return {data: data, timeStamp: new Date().getTime()};
    }

    // 获取本地数据
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error,result) => {
                if(!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch(e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    // 获取网络数据
    fetchNetData(url, flag) {
        return new Promise((resolve, reject) => {
            if(flag !== FLAG_STORAGE.flag_trending) {
                // 获取popular的内容
                fetch(url) 
                    .then((response) => {
                        if(response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok');
                    })
                    .then(responseData => {
                        // 获取数据后保存到本地
                        this.saveData(url, responseData)
                        resolve(responseData)
                    }) 
                    .catch(error => {
                        reject(error)
                    })
            } else {
                console.log('get data from trending github')
                // 获取trending的内容
                new Trending(AUTH_TOKEN).fetchTrending(url)
                    .then( items => {
                        if(!items) {
                            throw new Error('responseData from githubTrending is null')
                        }
                        this.saveData(url, items)
                        resolve(items)
                    })
                    .catch(error => {
                        console.log('githubTrending reject')
                        reject(error)
                    })
            }
        })
    }
 
    // 获取数据
    /**
     * 优先获取本地数据，如果没有本地数据，从网络上获取数据
     * @param {url} url 
     * @param {flag} flag
     * @return {Promise}
     */
    fetchData(url, flag) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                // 先从本地获取数据
                if(wrapData && DataStorage.checkTimestampValid(wrapData.timeStamp)) {
                    // console.log('get data from local', wrapData.timeStamp)
                    resolve(wrapData);
                    // 否则从网络获取数据
                } else {
                    // console.log('into fetchNetData', url)
                    this.fetchNetData(url, flag).then( (data) => {
                        resolve(this._wrapData(data));
                    }).catch( error => {
                        reject(error);
                    })
                }
            }).catch((error) => {
                this.fetchNetData(url, flag).then(data => {
                    resolve(this._wrapData(data));
                }).catch( error => {
                    reject(error)
                })
            })
        })
    }

    // 验证timeStamp的有效性
    static checkTimestampValid(timeStamp) {
        const currentDate = new Date();
        const previousDate = new Date(timeStamp);
        if(currentDate.getMonth() != previousDate.getMonth())
            return false;
        if(currentDate.getDate() != previousDate.getDate())
            return false;
        // 超过4个小时，需要重新从网络获取数据
        if(currentDate.getHours() - previousDate.getHours() > 4) 
            return false;
        return true;
    }
}