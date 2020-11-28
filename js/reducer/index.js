import {combineReducers} from 'redux'
import theme from './theme/index'
import popular from './popular/index'
import trending from './trending/index'
import favorite from './favorite/index'
import language from './language/index'
/**
 * 创建reducer
 */
const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
    language: language
});

export default index;