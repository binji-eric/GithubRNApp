export default class Utils {
    static checkFavorite(item, keys = []) {
        if(!keys) 
            return false
            // trending对应有fullName， 但是popular没有fullName
        let id = item.fullName ? item.fullName : item.id
        for(let i = 0, len = keys.length; i < len; i++) {
            if(id.toString() === keys[i]) {
                return true
            }
        }
        return false
    }
}