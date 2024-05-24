import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export function ProductCard({ img, name, mrp, sp, _id }) {
    const router = useRouter()
    return (
        <div className='h-[220px] sm:h-[270px] min-w-[170px] w-[170px] sm:min-w-[215px] sm:w-[215px] rounded-md overflow-hidden shadow-md bg-blue-400' onClick={()=>router.push(`/products/${_id}`)}>
            <div className='h-[145px] sm:h-[170px] w-full flex justify-center items-center p-2 bg-white rounded-b-xl'>
                <Image src={img || ''} height={100} width={100} alt='prod' className='h-full w-auto' />
            </div>
            <div className='bg-blue-400 h-[80px] sm:h-[100px] w-full rounded-lg text-[13px] sm:text-[15px] sm:font-medium leading-[15px] text-[#fff] px-2 sm:px-4 py-2'>
                <div className='pr-8'>
                    <p className='line-clamp-2 sm:line-clamp-3 leading-4 sm:leading-5 pb-[2.5px]'>
                        {name || 'No name set yet'}</p></div>
                <div className='text-[10px] sm:text-[12px] mt-[5px]'>
                    <del className='opacity-70 mr-2 sm:mr-3'>{mrp || '000'}</del>
                    {(mrp-sp)*100/mrp}% off
                    <span className='text-[#000] text-[15px] sm:text-[19px] font-bold ml-5 sm:ml-8'>{sp || '000'}</span>
                </div>
            </div>
        </div>
    )
}