import React from 'react'

const DictPage = () => {
  return (
    <div>
       {Array.from({ length: 1000 }).map((_, index:number) => (<div key={index}>{ index}</div>))}
    </div>
  )
}

export default DictPage