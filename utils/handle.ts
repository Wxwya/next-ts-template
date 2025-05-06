import  { FormItemsProps } from '@/components/XwyaForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z} from "zod"
export function loadFormController<T extends z.ZodTypeAny>(items: FormItemsProps[], schema: T) {
  const defaultValues = items.reduce((acc, item) => {
    if (item.type == "input" || item.type == "textarea" || item.type == "select" || item.type === "radio" || item.type ==="date" ) { 
      acc[item.item.name] = ""
    }
    if ( item.type === "checkbox" || item.type === "upload"||item.type==='tree' || item.type==="multiSelect") {
       acc[item.item.name] = []
    }
    if (item.type === "switch") { 
      acc[item.item.name] = false
    }
    if (item.type === "range") { 
      acc[item.item.name] = {
        to: void 0,
        from: void 0
      }
    }
    return acc
  }, {} as Record<string, any>) as z.infer<T>
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues
    })
  return form
}