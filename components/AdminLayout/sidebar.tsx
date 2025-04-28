"use client";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarGroupContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar'
import MenuItem from './menuItem'
import SubMenuItem from '@/components/AdminLayout/subMenuItem'
import AppSidebarHeader from './sidebarHeader'
import AppSidebarFooter from '@/components/AdminLayout/sidebarFooter'
import { sidebarHead, sidebarFoot } from '@/utils/settings'
import useUserStore from '@/store/user'
import { menu } from './menu'
import { useMemo } from 'react';
const AppSidebar = () => {
  const menus = useUserStore(state => state.menus)
  const resultMenus = useMemo(()=>([...menu,...menus]),[menus])
  return (
    <Sidebar collapsible="icon"  variant="sidebar">
      {sidebarHead?<SidebarHeader  ><AppSidebarHeader /></SidebarHeader>:null} 
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {resultMenus.map((item) =>
                item.routes && item.routes.length ? (
                  <SubMenuItem key={item.path}  {...item} />
                ) : (
                  <MenuItem key={item.path}  {...item} />
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {sidebarFoot ? <SidebarFooter><AppSidebarFooter /></SidebarFooter>:null} 
    </Sidebar>
  )
}
export default AppSidebar
/***
 * useSidebar (hooks)
 * 这是一个自定义 Hook，允许任何子组件访问 SidebarContext 中的数据。如果当前组件不在 SidebarProvider 内部，调用此 hook 将抛出错误。
 * 
 * 
 * SidebarProvider 组件
 * defaultOpen: 默认的侧边栏状态（展开或折叠）。
 * open: 外部控制侧边栏的打开/关闭状态。
 * onOpenChange: 外部传入的回调，用于响应侧边栏状态变化。
 * className 和 style: 用于自定义样式的属性。
 * children: 侧边栏内部的内容。
 * 
 * 
 * Sidebar 组件
 * side: 用于指定侧边栏显示在左侧（left）还是右侧（right）。
 * variant: 控制侧边栏的外观类型（sidebar、floating 或 inset）。
 * collapsible: 控制折叠方式（offcanvas、icon 或 none）。
 * className 和 children: 用于自定义样式和提供侧边栏内部的内容。
 * 
 * 
 * SidebarTrigger 组件
 * 功能：该组件用于触发侧边栏的显示或隐藏。它是一个按钮，点击后会调用 toggleSidebar 来切换侧边栏的状态。
 * 传参：
 * className：自定义的样式类名，传递给 Button 组件。
 * onClick：点击按钮时的回调函数，组件内部会先调用 onClick（如果存在），然后调用 toggleSidebar。
 * props：Button 组件的其他所有属性都会传递到 Button 元素。
 * 
 * 
 * 
 * SidebarRail组件(可用)
 * 功能：该组件是一个按钮元素，用于显示侧边栏的 rail（轨道）部分。点击时会触发 toggleSidebar 函数来控制侧边栏的显示或隐藏。
 * 传参：
 * className：自定义的样式类名，传递给按钮元素。
 * props：该按钮元素的其他所有属性，如 aria-label、tabIndex 等。
 * 
 * 
 * 
 * SidebarInset 组件(用不到)
 * 功能：这是一个 main 元素，用作侧边栏的内容区域。通过传递不同的类名，可以控制它的样式和布局。
 * 传参：
 * className：自定义的样式类名，传递给 main 元素。
 * props：传递给 main 元素的其他属性。
 * 
 * 
 * SidebarInput组件(可用)
 * 功能：该组件包装了一个 Input 组件，用于在侧边栏中放置输入框。可以传递 className 来定制样式。
 * 传参：
 * className：自定义的样式类名，传递给 Input 元素。
 * props：传递给 Input 元素的其他属性，如 value、onChange 等。
 * 
 * 
 * SidebarHeader组件(可用)
 * 功能：该组件包装一个 div 元素，用于侧边栏的头部部分。可以传递 className 来定制样式。
 * 传参：
 * className：自定义的样式类名，传递给 div 元素。
 * props：传递给 div 元素的其他属性，如子元素或事件处理器。
 * 
 * 
 * SidebarFooter组件(可用)
 * 功能：该组件包装一个 div 元素，用于侧边栏的底部部分。可以传递 className 来定制样式。
 * 传参：
 * className：自定义的样式类名，传递给 div 元素。
 * props：传递给 div 元素的其他属性，如子元素或事件处理器。
 * 
 * 
 * SidebarSeparator组件(可用)
 * 功能：这是一个分隔符组件，用于在侧边栏中分割内容区域，通常是视觉上的分界线。
 * 
 * 
 * SidebarContent组件(可用)
 * 功能：这是侧边栏的主要内容容器，用于放置主要布局和功能组件。
 * 
 * 
 * 
 * SidebarGroup组件(可用)
 * 功能：这是一个分组容器，用于将侧边栏的相关内容归类，比如导航菜单分组。
 * 支持嵌套其他组件，如 SidebarGroupLabel 和 SidebarGroupContent。
 * 
 * 
 * SidebarGroupLabel组件(可用)
 * 功能：用于显示分组的标题或标签。
 * 
 *  SidebarGroupAction组件(可用)
 * 功能：这是一个分组操作按钮，通常用于折叠/展开分组，或者显示其他操作。
 * 
 * 
 * SidebarGroupContent组件(可用)
 * 功能：分组的主要内容区域，用于放置导航项或其他子内容
 * 
 * SidebarMenu组件(可用)
 * 功能：一个菜单组件，用于放置导航项。
 * 
 * 
 * SidebarMenuItem组件(可用)
 * 功能:定义了一个侧边栏菜单项（<li>），提供基础的样式和类名管理。
 * 
 * 
 * SidebarMenuButton组件(可用)
 * 功能:渲染一个侧边栏的菜单按钮，支持自定义样式、状态管理、以及可选的 Tooltip（工具提示）
 * 参数:
 * asChild: 是否将按钮包装为子组件（用 Slot 替代默认的 <button>）。
 * isActive: 按钮是否处于激活状态（data-active=true 用于添加激活样式）。
 * variant / size: 调用 sidebarMenuButtonVariants，决定按钮的样式和大小。
 * tooltip: 可选的 Tooltip 内容，可为字符串或对象（TooltipContent 的参数）。
 * className: 自定义类名。
 * ref: ref 用于引用此按钮。
 * 
 * 
 * SidebarMenuAction组件(可用)
 * 功能:渲染菜单项右上角的动作按钮，通常用于附加操作（例如删除、设置等）。
 * 参数:
 * asChild: 是否将按钮包装为子组件。
 * showOnHover: 是否在鼠标悬停时显示该按钮。
 * className: 自定义类名。
 * 其余 props: 支持 <button> 元素的所有原生属性。
 * 
 * 
 * SidebarMenuBadge组件(可用)
 * 功能:在菜单项右上角显示一个标记（通常是通知数或状态标签）。
 * 参数:
 * className: 自定义类名。
 * ref: 用于引用此标记元素。
 * 其余 props: 支持 <div> 元素的所有原生属性。
 * 
 * 
 * SidebarMenuSkeleton组件(可用)
 * 功能:骨架屏，用于在数据加载时展示占位符。
 * 参数:
 * showIcon: 是否显示骨架屏中的图标。
 * className: 自定义类名。
 * ref: 用于引用此骨架屏。
 * 其余 props: 支持 <div> 元素的所有原生属性。
 * 
 * SidebarMenuSub
 * 功能:侧边栏菜单子项，用于嵌套子菜单。
 * 
 * 
 * SidebarMenuSubItem
 * 功能:侧边栏菜单子项，用于嵌套子菜单。
 * 
 * SidebarMenuSubButton
 * 功能:侧边栏菜单子项按钮，用于嵌套子菜单。



 */
