"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Orders = () => {
    const [orders, setOrders] = useState([])
    useEffect(()=>{
        axios.get('/api/product/order').then(res=>{
            console.log(res, "orders here")
            setOrders(res.data.orders);

        }).catch(err=>{
            console.error(err)
        })
    },[])
    return (
        <div className='px-6'>
            <div className='text-xl font-bold py-[1rem] mx-1 bg-[#fff] -mt-10 pl-4 rounded-sm shadow-md'>
                Orders
            </div>
            <div className='mt-3 mx-1 flex flex-wrap justify-start items-start gap-2 min-h-full h-[100vh]'>
                {
                    orders.map(order => {
                        return (
                            <OrderCard key={order._id} name={order?.product?.name} img={order.img} quantity={order.quantity} orderId={order._id} amount={order.amount} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const OrderCard = ({ quantity, img, name, orderId, amount }) => {
    return (
        <div className='h-28 flex border bg-white w-full p-2 rounded-md items-center gap-4'>
            <div className=" size-24 w-[200px] border p-1">
                <Image src={img} alt='img' width={100} height={100} className='h-full w-auto' />
            </div>
            <div>
                <p className="line-clamp-1">{name || 'Product name goes here Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat veritatis nisi vel?'}</p>
                <div className='flex justify-around'><b>₹{amount}</b> <b>{quantity} qty</b></div>
                <Button variant='destructive' className="h-6 float-right mt-1">Cancel</Button>
            </div>
        </div>
    )
}

export default Orders