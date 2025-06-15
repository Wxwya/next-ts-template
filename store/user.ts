

import { create,type UseBoundStore,StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "@/utils/createStore";
class UserStore { 
  userInfo: SystemUser.UserInfo | null = null
  defaultOptions: Record<string, DefaultOptions[]> = {}
  menus: MenuStruct[] = []
  globalPath: string[] = []
}
const useUserStore = create<UserStore>()(
  immer(
    () => ({...new UserStore()}),
  )
);
export const onChangeUserInfo = (userInfo: any) => {
  useUserStore.setState((state) => ({
    ...state,
   userInfo:userInfo
  }));
}
export const onChangeDefaultOptions = (defaultOptions: Record<string, DefaultOptions[]>) => {
  useUserStore.setState((state) => ({
    ...state,
   defaultOptions:defaultOptions
  }));
}
export const onChangeMenus = (menus: MenuStruct[]) => {
  useUserStore.setState((state) => ({
    ...state,
   menus:menus
  }));
}
export const onChangeGlobalPath = (globalPath: string[]) => {
  useUserStore.setState((state) => ({
    ...state,
   globalPath:[...state.globalPath,...globalPath]
  }));
}
export default createSelectors(useUserStore) as UseBoundStore<StoreApi<UserStore>>;