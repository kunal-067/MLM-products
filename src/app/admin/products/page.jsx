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
import { toast } from '@/components/ui/use-toast'


function ProductPage() {
    const [products, setProducts] = useState('');
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/product?size=30').then(res => {
            setProducts(res.data.products)
        }).catch(err => {
            console.log(err);
        })
    }, [])
    return (
        <div className='h-full p-4 bg-white'>
            <div className='flex justify-between'>
                <h2 className='font-medium text-[22px]'>Products</h2>

                <form action="#">
                    <Button type={'button'} className='mr-5' onClick={() => router.push('/admin/products/new')}>Add Product</Button>
                    {/* <Link href='/admin/products/new'>Add</Link> */}
                    <Input placeHolder="Search" className='w-[210px] float-right mb-4' />
                </form>
            </div>
            {
                products ? <DataTable products={products} /> : (
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
function DataTable({ products }) {
    const removeProduct = (id)=>{
        axios.delete('/api/products', {productId:id}).then(res=>{
            toast({
                title:res.data.message
            })
        }).catch(err=>{
            toast({
                title:res.data.message
            })
        })
    }
    return (
        <Table className='bg-white'>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Sp</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className='text-right pr-8'>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    products.length > 0 ? (
                        products.map(product => (
                            <TableRow key={product._id}>
                                <TableCell>{product._id}</TableCell>
                                <TableCell><Image className='hover:scale-[3] cursor-pointer' src={product.image} width={26} height={26} alt='img' /></TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.mrp}</TableCell>
                                <TableCell>{product.sp}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell className='text-right'>
                                    <Button variant='destructive' className='mr-2' onClick={()=>removeProduct(product._id)}>Remove</Button>
                                    <Button>Edit</Button>
                                </TableCell>
                            </TableRow>))) : (
                        <div className='w-full h-40 flex justify-center items-center'>
                            <h2 className='text-[24px] font-medium'>No products added yet</h2>
                        </div>
                    )
                }
            </TableBody>
        </Table>
    )
}

export default ProductPage