import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { createSelectors } from "@/utils/createStore";

class StoreState  {
  theme:string = "dark" // 默认深色主题
  menuGroupKeys: string[] = [] // 菜单组
  collapsed: boolean = true
}
const useSystemStore = create<StoreState>()(
  immer(
    persist(
      () => (new StoreState()),
      {
        name: "systemSrore",
      }
    )
  )
);

export const onChangeMenuGroupKeys = (path: string,pushFlag?:boolean) => { 
  useSystemStore.setState(state => { 
    let menuGroupKeys = state.menuGroupKeys
    const flag = state.menuGroupKeys.includes(path)
   
    if (path || pushFlag) { 
      menuGroupKeys=[...menuGroupKeys, path]
    }
    if (flag && !pushFlag) {
      return {
        ...state,
        menuGroupKeys:state.menuGroupKeys.filter(item => item !== path)
      }
    } 
    return {
      ...state,
      menuGroupKeys
    }
  })
}
export const onChangeCollapsed = (collapsed:boolean) => {
  useSystemStore.setState(state => {
    return {
      ...state,
      collapsed
    }
  })
}
export default createSelectors(useSystemStore)
/**
 *
 *   一. 初使用 zustand (pnpm add zustand -D)
 *
 *      创建仓库 create()((set,get)=>{})
 *      A.使用单个仓库单个状态或方法
 *        1. 在使用的地方引入仓库
 *        2. navList = NavLableStore(state=>state.navList)
 *
 *      B.直接获取全部状态
 *        const {navList，labelList，initNavList} = NavLabelStore()
 *    备注: set用户更改状态,get用户获取其他状态  不建议直接获取全部状态 (会影响重新渲染)
 *
 *
 *   二. 使用immer中间件更新深层数据 (pnpm add immer -D)
 *        create()(immter((set,get)=>{})) 创建仓库就可以直接使用
 *
 *
 *   三. 使用selector和自动selector
 *      作用比如a组件在使用b组件也在使用一个仓库方式a组件在更改和b组件无关紧要数据的时候重渲染
 *
 *      代码在utils/createStore.ts
 *
 *      使用: createSelectors(NavLabelStore)
 *           NavLabelStore.use.initNavList()
 *
 *   四. 使用了selector如何选中多个状态 shallow
 *      shallow: 是对比第一层的状态是否有改变也可以自己写一个函数放到底下
 *      import {shallow} from "zustand/shallow"
 *      普通写法:
 *      const {initNavList,initlabelList}=NavLabelStore((state)=>{
 *        initNavList:state.initNavList,
 *        initlabelList:state.initlabelList
 *      },shallow)
 *
 *      简写: const [initNavList,initlabelList]=NavLabelStore((state)=>[
 *        state.initNavList,
 *        state.initlabelList
 *      ],shallow)
 *
 *
 *    五. 持久化保存到本地persist
 *         排除不想要的状态
 *        partialize:(state)=>Object.fromEntries(
 *          Object.entries(state).filter(([key])=>!["仓库中数据的名称",...].includes(key))
 *        )
 *
 *        // 清除本地数据 NavLabelStore.persist.clearStorage
 *
 *     六. 清除仓库状态
 *      reset:()=>set(state=>({...storeState}))
 *
 *     七. subscribe()  监听仓库状态
 *
 *        写在useEffect的声明周期里
 *        useEffect(()=>{
 *          const unsub = NavLabelStore.subscribe((state,prevState)=>{
 *               console.log(state,prevState)
 *          })
 *
 *          // 离开时取消监听
 *           return unsub
 *        })
 *
 *      八.  subscribeWithSelector() 监听部分状态
 *            使用: NavLabelStore.subscribe(state=>state.属性名,(val,oddVal)=>{
 *                    log(vak,oddVal)
 *                  })
 *
 *
 *      九. setState() 和 getState()
 *          NavLabelStore.setState(state=>({属性名:属性值})) 用于动态更改仓库属性值
 *          NavLabelStore.getState().属性名  同于获取仓库的属性值或方法 (不是响应式的)
 *
 *      十. 顺序
 *       createSelectors>immer> subscribeWithSelector>persist
 * */
