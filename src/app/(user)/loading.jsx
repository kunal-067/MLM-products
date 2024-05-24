import Loader from '@/components/common/Loader'
import React from 'react'

function Loading() {
  return (
    <div className='w-[100vw] h-[100px] flex justify-center items-center'>
        <Loader/>
    </div>
  )
}

export default Loading