'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { formattedDateTime } from '@/utils/time';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Investment = () => {
    const [upi, setUpi] = useState('');
    const [msg, setDescription] = useState('');
    const [investments, setInvestments] = useState([]);

    useEffect(() => {
        axios.get('/api/investment').then(res => {
            setInvestments(res.data.investments)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    async function invest() {
        try {
            const res = await axios.post('/api/investment', {upi, msg, amount:2000});
            console.log(res)
            toast({
                title: res.data?.msg
            })

            setTimeout(() => {
                window.location.href = `/payment?amount=${1500}`
            }, 100);

        } catch (error) {
            console.log(error);
            toast({
                title: error.response?.data.msg || error.message
            })
        }
    }
    return (
        <div className='px-6 bg-white'>
            <div className='text-xl font-bold py-[1rem] mx-1 bg-[#fff] pl-4 rounded-sm shadow-md'>
                Investment
            </div>

            <div>
                <div className='flex flex-col py-4 pt-6 gap-2'>
                    <h4 className=' text-lg font-medium'>Total investment : <span>₹ 4000</span></h4>


                    {/* <Button className='w-fit px-12' onClick={invest}>Invest</Button> */}
                    <Dialog>
                        <DialogTrigger className='w-fit font-medium px-12 bg-black py-1 text-white rounded-md' >
                            Invest
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>
                                Investment Form :
                            </DialogTitle>
                            <DialogDescription>
                                <Label>UPI :</Label>
                                <Input placeholder='Enter UPI Id' className='mb-2 mt-1' value={upi} onChange={e => setUpi(e.target.value)} />

                                <Label>Message :</Label><br />
                                <textarea className='border w-full rounded-md p-2 mb-2 mt-1' value={msg} onChange={e => setDescription(e.target.value)} placeholder='Enter a message...' />
                            </DialogDescription>
                            <DialogFooter className='flex justify-between'>
                                <DialogClose className='p-1 px-6 rounded-md border-2'>Close</DialogClose>
                                <DialogClose className='p-1 px-6 rounded-md bg-black text-white' onClick={invest}>Continue</DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div>
                    <p>
                        Please note that you should invest the money at first or fifteenth of the month. and investment amount should be 1,20,000
                        the tenure for investing whole money is 5 years
                    </p>
                </div>

            </div>
            <div className='h-full w-full p-4'>
                <h3 className='text-center text-lg font-bold mt-4 mb-2'>Your Investments</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {
                        investments.length > 0 && investments.map(investment => (
                            <InvestmentCard key={investment._id} amount={investment.amount} date={investment.createdAt} />
                        ))
                    }
                    {/* <InvestmentCard/> */}
                </div>
            </div>
        </div>
    )
}

function InvestmentCard({ amount, date }) {
    return (
        <div className='border p-2 rounded-md'>
            <p>Amount : <span>₹ {amount}</span></p>
            <p>Date of investment : <span>{formattedDateTime(date).date}</span></p>
        </div>
    )
}

export default Investment