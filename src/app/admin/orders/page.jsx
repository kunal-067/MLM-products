'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Loader from '@/components/common/Loader'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { toast } from '@/components/ui/use-toast'
import { MoreHorizontal } from 'lucide-react'


function OrderPage() {
    const [orders, setOrders] = useState([{ _id: "3rej5", product: { name: "hello js", image: "vercel.png" }, payableAmount: 1500, quantity: 5, upi: '890008@upi', paymentMode: "online", phone: 987001, paymentStatus: "Pending" }]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/product/order?size=30').then(res => {
            setOrders(res.data.orders)
        }).catch(err => {
            console.log(err);
        })
    }, [])
    return (
        <div className='h-full p-4 bg-white'>
            {
                orders ? <DataTable orders={orders} /> : (
                    <div className='w-full h-40 flex justify-center items-center'>
                        <Loader />
                    </div>
                )
            }
            <div className='py-4 flex justify-between'>
                <Select>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="20" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>

                <PaginationCard className='w-fit m-0' />
            </div>
        </div>
    )
}

function PaginationCard({ className }) {
    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationPrevious />
                <PaginationLink className={'border-[2px] mr-1'}>1</PaginationLink>
                <PaginationLink className={'border-[2px]'}>2</PaginationLink>
                <PaginationEllipsis />
                <PaginationNext />
            </PaginationContent>
        </Pagination>
    )
}
function DataTable({ orders }) {
    // const removeorder = (id)=>{
    //     axios.delete('/api/orders', {orderId:id}).then(res=>{
    //         toast({
    //             title:res.data.message
    //         })
    //     }).catch(err=>{
    //         toast({
    //             title:res.data.message
    //         })
    //     })
    // }
    const verifyPayment = async (id, status) => {
        try {
            const { data } = await axios.patch("/api/product/order", { orderId: id, paymentStatus: status })
            console.log(data)
            toast({
                title: data.message
            })
        } catch (error) {
            toast({
                title: error.response?.data.message || error.message
            })
        }
    }
    const verifyOrder = async (id, status) => {
        try {
            const { data } = await axios.patch("/api/product/order", { orderId: id, status: status })
            toast({
                title: data.message
            })
        } catch (error) {
            toast({
                title: error.response?.data.message || error.message
            })
        }
    }
    return (
        <Table className='bg-white'>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>User Phone</TableHead>
                    <TableHead>Payable</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Payment status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableCell>Address</TableCell>
                    <TableHead>Upi</TableHead>
                    <TableHead className='text-right pr-8'>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    orders.length > 0 ? (
                        orders.map(order => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell><Image className='hover:scale-[3] cursor-pointer' src={order.image} width={26} height={26} alt='img' /></TableCell>
                                <TableCell>{order.product.name}</TableCell>
                                <TableCell>{order.phone}</TableCell>
                                <TableCell>{order.payableAmount}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.paymentMode}</TableCell>
                                <TableCell>{order.paymentStatus}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>  <DropdownMenu>
                                    <DropdownMenuTrigger className='bg-slate-200 px-2 rounded-sm'>Address</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem >Street : {order.shippingAddress?.street}</DropdownMenuItem>
                                        <DropdownMenuItem >City :  {order.shippingAddress?.city}</DropdownMenuItem>
                                        <DropdownMenuItem >Pincode :  {order.shippingAddress?.pincode}</DropdownMenuItem>
                                        <p>State :  {order.shippingAddress?.state}</p>
                                        <p>Address :  {order.shippingAddress?.address}</p>
                                    </DropdownMenuContent>
                                </DropdownMenu></TableCell>
                                <TableCell>{order.upi}</TableCell>
                                <TableCell className='text-center'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger><MoreHorizontal /></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => verifyPayment(order._id, "Completed")}>Verify Payment</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500" onClick={() => verifyPayment(order._id, "Decline")}>Decline Payment</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => verifyOrder(order._id, "Dellivered")}>Delivered</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>))) : (
                        <div className='w-full h-40 flex justify-center items-center'>
                            <h2 className='text-[24px] font-medium'>No orders added yet</h2>
                        </div>
                    )
                }
            </TableBody>
        </Table>
    )
}

export default OrderPage