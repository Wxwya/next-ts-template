'use client'
import React, { useEffect } from 'react'
import XwyaTable, { type TableColumns} from '@/components/XwyaTable';
import usePage, { PageType } from '@/hooks/use-page';
import useUserStore from '@/store/user';
import {generateRandomId} from "@/utils"
type Invoice = {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: number | string;
}
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];
const columns: TableColumns<Invoice>[] = [
  {
    key: "invoice",
    header: "Invoice",
  },
  {
    key: "paymentStatus",
    header: "Payment Status",
  },
  {
    key: "totalAmount",
    header: "Total Amount",
  },
  {
    key: "paymentMethod",
    header: "Payment Method",
    cell: (item) => (<div data-auth={item.paymentMethod===0?"admin":"66" }>{item.paymentMethod}</div>)
  }
]
const returnData =  () => { 
  return new Promise((resolve) => {
    setTimeout(() => {
      // 随机生成十条不一样的用户数据
      const data = invoices.map((item) => ({ ...item, key: generateRandomId(),invoice:generateRandomId(),paymentMethod:Math.floor(Math.random() * 2) }));
      resolve(data);
    }, 1000);
  })
}
const TablePage = () => {
  const { data, loading, page, total, setData, setLoading, setPage, setTotal } = usePage()
  const userInfo = useUserStore(state=> state.userInfo)
  const getData = async (page:PageType ={pageNum:1,pageSize:10}) => {
    setLoading(true)
    const res = await returnData() as any[]
    setData(res)
    setTotal(100)
    setPage(page)
    setLoading(false)
  }

  const onChange = (pageNum: number, pageSize: number) => {
    getData({ pageNum, pageSize })
  }

  useEffect(() => { 
    getData()
  },[])
  return (
    <>
      <XwyaTable  data={data} page={page} total={total} loading={loading}  onChange={onChange} columns={columns} />
    </>
  )
}

export default TablePage