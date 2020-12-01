import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme/index';
import {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} from './popular/index';
import {onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} from './trending/index'
import {onLoadFavoriteData} from './favorite/index'
import {onLoadLanguage} from './language/index'
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
}
