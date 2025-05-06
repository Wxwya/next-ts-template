export { }
declare global {
  type GlobalOptions<T = string> = {
    label: string;
    value: T;
  };
  interface DefaultOptions  extends GlobalOptions {
    type:string
  }
   type MenuStruct = {
    path: string
    title: string
    icon?: string
    routes?: Omit<MenuStruct,"routes">[] 
  }
  interface TreeOptions {
    title: string;
    value: number;
    children: TreeOptions[];
  }
}
