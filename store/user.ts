

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "@/utils/createStore";
class UserStore { 
  userInfo: SystemUser.UserInfo | null = null
}
const useUserStore = create<UserStore>()(
  immer(
    () => (new UserStore()),
  )
);
export const onChangeUserInfo = (userInfo: any) => {
  useUserStore.setState((state) => {
    state.userInfo = userInfo;
  });
}
export default createSelectors(useUserStore);