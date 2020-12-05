import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme/index';
import {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} from './popular/index';
import {onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} from './trending/index'
import {onLoadFavoriteData} from './favorite/index'
import {onLoadLanguage} from './language/index'
import {onSearch, onLoadMoreSearch, onSearchCancel} from './search/index'
export default {
    onThemeChange,
    onLoadPopularData,
    onLoadMorePopular,
    onFlushPopularFavorite,
    onLoadTrendingData,
    onLoadMoreTrending,
    onFlushTrendingFavorite,
    onLoadFavoriteData,
    onLoadLanguage,
    onShowCustomThemeView,
    onThemeInit,
    onSearch, 
    onLoadMoreSearch, 
    onSearchCancel
}
