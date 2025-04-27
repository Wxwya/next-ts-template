
import React from 'react'
import Simple from './simple'
import Verify from './verify'
import Dynamics from "./dynamics"
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: '表单示例',
  description: 'next-ts-templte',
}

export default async function Form() {
  // throw new Error('404')
  return (
    <div>
      <Simple />
      <Verify />
      <Dynamics />
    </div>
  )
}
