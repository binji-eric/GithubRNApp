import AsyncStorage from '@react-native-community/async-storage';
import langs from '../../share/data/langs.json';
import keys from '../../share/data/keys.json';

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'}

export default class LanguageDao {
    // 区分popular 或者 trending调用该模块
    constructor(flag) {
        this.flag = flag;
    }

    /**
     * 获取语言或标签
     * @returns {Promise<any> | Promise}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    console.log('asyncStor获取失败，将从json文件中获取')
                    let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
                    this.save(data);
                    resolve(data);
                } else {
                    try {
                        console.log('从asyncStorage获取数据')
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                }
            });
        });
    }

    /**
     * 保存语言或标签
     * @param objectData
     */
    save(objectData) {
        let stringData = JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag, stringData, (error, result) => {

        });
    }
}
