export default class Utils {
    static checkFavorite(item, keys = []) {
        if(!keys) 
            return false
            // trending对应有fullName， 但是popular没有fullName，所以popular对应id
        let id = item.fullName ? item.fullName : item.id
        for(let i = 0, len = keys.length; i < len; i++) {
            if(id.toString() === keys[i]) {
                return true
            }
        }
        return false
    }
     /**
     * 检查key是否存在于keys中
     * @param keys
     * @param key
     */
    static checkKeyIsExist(keys, key) {
        for (let i = 0, l = keys.length; i < l; i++) {
            if (key.toLowerCase() === keys[i].name.toLowerCase()) return true;
        }
        return false;
    }
}