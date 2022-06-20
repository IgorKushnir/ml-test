// import {Ref} from 'vue';

export const useFavCount = () => useState<number>('favCount', () => 0);
export const useMenuData = () => useState<object>('menuData', () => []);
export const useIsMobile = () => useState<boolean>('isMobile', () => false);

export const useGoogle = () => useState<any>('google');




export const useFiltersData = () => useState<object>('filtersData', () => []);
export const useTypesData = () => useState<object>('typesData', () => []);

export const usePreviousRoute = () => useState<object>('previousRoute', () => []);

