'use client'
import Loader from '@/components/common/Loader'
import { ProductCard } from '@/components/main/Product.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function Product() {
    const [products, setProducts] = useState('');
    useEffect(() => {
        axios.get('/api/product?size-30').then(res => {
            setProducts(res.data.products)
        }).catch(err => {
            console.error(err)
        })
    }, [])
    return (
        <div className='mx-2 sm:mx-6'>
            <div className='text-xl font-bold py-[1rem] mx-1 bg-[#fff] -mt-10 pl-4 rounded-sm shadow-md'>
                <form action="#" className='flex'>
                    <Input placeholder='Search products here' className='max-w-[360px] w-[80%] border-black' />
                    <Button className='bg-blue-500 hover:bg-blue-400 ml-2 mr-4'><Search className='text-white' /></Button>
                </form>
            </div>

            <section className='mt-4 px-1'>
                <div className='flex flex-wrap justify-evenly gap-x-2 gap-y-4 sm:gap-4'>
                    {
                        products ? (
                            products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard img={product.image} name={product.name} mrp={product.mrp} sp={product.sp} key={product._id} _id={product._id} />
                                ))) : (
                                <div className='w-full h-40 flex justify-center items-center'>
                                    <h2 className='text-[24px] font-medium'>No products added yet</h2>
                                </div>
                            )
                        ) : (
                            <div className='w-full h-40 flex justify-center items-center'>
                                <Loader />
                            </div>
                        )
                    }
                    {/* <ProductCard img={'/next.svg'} />
                    <ProductCard img={'/vercel.svg'} />
                    <ProductCard img={'/next.svg'} />
                    <ProductCard img={'/vercel.svg'} />
                    <ProductCard img={'/next.svg'} />
                    <ProductCard img={'/vercel.svg'} /> */}
                </div>
            </section>
        </div>
    )
}

export default Product