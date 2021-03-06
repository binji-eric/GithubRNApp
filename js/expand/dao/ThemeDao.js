import AsyncStorage from '@react-native-community/async-storage';
import ThemeFactory, {ThemeFlags} from "../../share/styles/ThemeFactory";

const THEME_KEY = 'theme_key'
export default class ThemeDao {

    /**
     * 获取当前主题
     * @returns {Promise<any> | Promise}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                // 如果没结果，设置为default值
                if (!result) {
                    this.save(ThemeFlags.Default);
                    result = ThemeFlags.Default;
                }
                resolve(ThemeFactory.createTheme(result))
            });
        });
    }

    /**
     * 保存主题标识
     * @param themeFlag
     */
    save(themeFlag) {
        console.log('save them->>', themeFlag)
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error => {
        }))
    }
}
