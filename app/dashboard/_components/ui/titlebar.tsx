import React from 'react'

function Titlebar({title} : {title:string}) {
  return (
    <div className='w-full h-fit  px-4 py-2  rounded-sm border-l-6 border-primary bg-white'>
        <div className='w-full h-fit p-l-2 m-l-12 '>
          <h1 className='font-medium text-xl text-primary'>{title}</h1>
        </div>
    </div>
  )
}

export default Titlebar