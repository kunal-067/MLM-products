"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'

function Dashboard() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  function sendToOne(){
    axios.post('/api/income-incr', {phone, amount}).then(res=>{
      console.log(res)
      toast({
        title : res.data?.msg
      })
    }).catch(err=>{
      console.error(err);
      toast({
        title : err.response?.data.msg || err.message
      })
    })
  }
  return (
    <>
    <h2 className='text-center font-bold text-[24px]'>Dashboard</h2>

    <div className='p-4'>

    <Dialog>
    <DialogTrigger className='w-fit font-medium mt-4 px-12 bg-black py-1 text-white rounded-md' >
        Send Money
    </DialogTrigger>
    <DialogContent>
        <DialogTitle>
            Income Form :
        </DialogTitle>
        <DialogDescription>

            <Label>Phone :</Label>
            <Input placeholder="Enter users's phone no." className='mb-2 mt-1' value={phone} onChange={e => setPhone(e.target.value)} />

            <Label>Amount :</Label>
            <Input placeholder='Enter Amount to send' className='mb-2 mt-1' value={amount} onChange={e => setAmount(e.target.value)} />

        </DialogDescription>
        <DialogFooter className='flex justify-between'>
            <DialogClose className='p-1 px-6 rounded-md border-2'>Close</DialogClose>
            <DialogClose className='p-1 px-6 rounded-md bg-black text-white' onClick={sendToOne}>Send</DialogClose>
        </DialogFooter>
    </DialogContent>
</Dialog>

</div>
</>
  )
}

export default Dashboard