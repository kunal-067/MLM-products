'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { UploadIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function AddProduct() {
    const router = useRouter();
    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sp, setSp] = useState('');
    const [mrp, setMrp] = useState('');
    const [cv, setCv] = useState(0);
    const [cvDiscount, setCvDiscount] = useState(0);
    const [quantity, setQuantity] = useState(1);


    function handleImage(e) {
        const files = Array.from(e.target.files);
        setImages(files);
        console.log(files, e.target.files)
    }
    function removImg(i) {
        const v = images;
        v.splice(i, 1)
        setImages([...v])
    }

    const formSubmit = async () => {

        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });
        formData.append('name', name);
        formData.append('description', description);
        formData.append('sp', sp);
        formData.append('mrp', mrp);
        formData.append('cv', cv);
        formData.append('cvDiscount', cvDiscount);
        formData.append('quantity', quantity);

        axios.post('/api/product', formData).then(res => {
            toast({
                title: res.data.message
            })
        }).catch(err => {
            console.error(err);
            toast({
                title: err.response.data.message || err.message
            })
        })
    };

    return (

        <div className='shadow-md min-h-full p-4 bg-white'>
            <div className='flex w-full justify-between border-b-[1px] py-2'>
                <h2 className='font-medium text-[22px]'>AddProduct</h2>
                <div className='flex gap-4'>
                    <Button variant='destructive' className='text-[16px] font-medium' onClick={() => router.push('/admin/products')}>Cancel</Button>
                    <Button variant='secondary' className='bg-blue-500 text-[16px] font-medium text-white hover:bg-blue-600' onClick={formSubmit}>Create</Button>
                </div>
            </div>
            <form action="#" className='mt-6 bg-white mx-4 p-4 rounded-md' onSubmit={formSubmit}>
                <div className='flex'>
                    <div className='flex-1'>
                        <div className='mb-4'>
                            <Label>Name:</Label>
                            <Input placeholder='Enter product name' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='mb-4'>
                            <Label>Listed Price:</Label>
                            <Input type='number' placeholder='Enter product listed price' value={mrp} onChange={(e) => setMrp(e.target.value)} />
                        </div>
                        <div className='mb-4'>
                            <Label>Selling Price:</Label>
                            <Input type='number' placeholder='Enter product selling price' value={sp} onChange={e => setSp(e.target.value)} />
                        </div>
                    </div>

                    {/* image section */}
                    <div className='flex flex-wrap justify-between gap-2 flex-1 px-8 shadow-sm border-l ml-4'>
                        <div className='relative rounded-sm size-24 border-[2px] flex justify-center items-center bg-gray-200'>
                            <Input type='file' placeholder='Select a file' className='w-full h-full opacity-5 absolute z-10 cursor-pointer' multiple onChange={handleImage} />
                            <div className='absolute text-center opacity-40'>
                                <UploadIcon className='size-10 ml-1' />
                                <p className=' opacity-40'>Upload</p>
                            </div>
                        </div>
                        {
                            images.map((img, i) => (
                                <div key={i}>
                                    <div className='rounded-sm size-24 border-[2px] '>
                                        <Image src={URL.createObjectURL(img)} width={100} height={100} alt='img' className='h-full w-auto' />
                                    </div>
                                    <X className='text-red-600 cursor-pointer mx-auto mt-2 hover:scale-125 hover:text-red-500 hover:rotate-90 transition-all duration-500' onClick={() => removImg(i)} />
                                </div>
                            ))
                        }

                    </div>
                </div>


                {/* bottom section  */}
                <div>
                    <div className='mb-4'>
                        <Label>Description:</Label><br />
                        <textarea placeholder='Enter a description' className='rounded-md border-[2px] w-full p-2' value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className='mb-4'>
                        <Label>Quantity:</Label>
                        <Input placeholder='Enter quantity of product avaliable' value={quantity} onChange={e => setQuantity(e.target.value)} />
                    </div>
                    <div className='mb-4'>
                        <Label>CV:</Label>
                        <Input placeholder='Enter cv which user will get' type='number' value={cv} onChange={e => setCv(e.target.value)} />
                    </div>
                    <div className='mb-4'>
                        <Label>CV discount:</Label>
                        <Input placeholder='Enter CV coupon discount' value={cvDiscount} onChange={e => setCvDiscount(e.target.value)} />
                    </div>

                </div>
            </form>
        </div>

    )
}

export default AddProduct