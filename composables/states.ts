// import {Ref} from 'vue';

export const useFavCount = () => useState<number>('favCount', () => 0);
export const useIsMobile = () => useState<boolean>('isMobile', () => false);

export const useGoogle = () => useState<any>('google');



export const useMenuData = () => useState<object>('menuData', () => []);
export const useFiltersData = () => useState<object>('filtersData', () => []);
export const useTypesData = () => useState<object>('typesData', () => []);
export const useTranslationsData = () => useState<object>('translationsData', () => []);

export const usePreviousRoute = () => useState<object>('previousRoute', () => []);


export const useViewedProductIds = () => useState<object>('viewedProductIds', () => []);




