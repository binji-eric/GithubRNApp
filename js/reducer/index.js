import {combineReducers} from 'redux'
import theme from './theme/index'
import popular from './popular/index'
import trending from './trending/index'
import favorite from './favorite/index'
import language from './language/index'
import search from './search/index'
/**
 * 创建reducer
 */
const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
    language: language,
    search: search
});

export default index;