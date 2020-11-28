export default class NavigationUtil {
    /*
    @params params 传递的参数
    @param page 要跳转的页面
     */
    static goPage(params, page) {
        console.log('in the NavigationUtil goPage', params, page)
        const navigation = NavigationUtil.navigation
        if(!navigation) {
            console.log('NavigationUtil.navigation can not be empty')
            return;
        }
        console.log('goPage')
        navigation.navigate(
            page, 
            {
                ...params
            }
        )
    }
    /**
     * 重置到首页
     * @params params
     */
    static resetToHomePage(params) {
        const { navigation } = params;
        navigation.navigate('Main');
    }
    /**
     * 返回上一页
     * @param {*} navigation 
     */
    static goBack(navigation) {
        navigation.goBack();
    }
}