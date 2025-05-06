declare namespace Dict {
  interface DictTypeInfo {
    id?: number;
    type_name: string;     
    username: string;      
    dict_name: string;    
    comment: string;
    is_default: string;
    create_time: string;  
  }
  interface DictInfo {
    id?: number;
    dict_type_id: number;
    dict_label: string;
    order_num?: number;
    status: boolean 
    dict_value: string;
    username: string;
    create_time?: string; 
  }
  interface GetDictListStructApi { 
    list: DictInfoInfo[];
    total: numberl;
  }
  interface GetDictTypeListStructApi { 
    list: DictTypeInfo[];
    total: numberl;
  }
  
}