'use client'
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';


function Invest() {
    const [investments, setInvestments] = useState([]);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        axios.get("/api/investment?status=Pending&withUser=True").then(res => {
            console.log(res)
            setInvestments(res.data?.investments || [])
        }).catch(err => {
            console.log(err)
        })
    }, [])

    async function distribute(){
        try {
            const {data} = await axios.put('/api/investment', {incr:amount})
            toast({
                title:data.msg
            })
        } catch (error) {
            console.log(error);
            toast({
                title:error.response?.data.msg || error.message
            })
        }
    }
    return (
        <>
            <div className='flex justify-between py-4 px-6'>
                <h2 className='font-semibold text-[21px]'>Investments</h2>

                <div className='flex gap-2'>
                    <Input type='number' className=' w-64' name='InvAmount' placeholder='Enter distributing amount' value={amount} onChange={e=>setAmount(e.target.value)} />
                    <Button onClick={distribute}>Distribute</Button>
                    {/* <Button variant='destructive' onClick={sendToOne}>Send to one</Button> */}
                    <PersonalIncome/>
                </div>
            </div>
            <div>
                <DataTable investments={investments}/>
            </div>
        </>
    )
}

function DataTable({ investments }) {
    async function approveInvestment(id,status){
        try {
            const {data} = await axios.patch('/api/investment', {investmentId:id, status})
            toast({
                title:data.msg
            })
        } catch (error) {
            console.log(error);
            toast:({title:error.response.data.msg || error.message})
        }
    }
    return (
        <Table className='bg-white'>
            {/* ====================== table head data ========================= */}
            <TableHeader>
                <TableRow className="bg-slate-200">
                    <TableHead className="w-[210px]">ID</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>UPI</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>

            {/* ================= Table body data ============== */}
            {
                investments?.length > 0 ? (
                    <TableBody>

                        {
                            investments.map((investment, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{investment._id?.toString()}</TableCell>
                                        <TableCell className='underline'>
                                            <Dialog>
                                                <DialogTrigger className='underline text-blue-800'>
                                                    {investment.user._id}
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>
                                                        User Details:
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        <div className='mb-4'>
                                                            <Label>Id:</Label>
                                                            <Input disabled value={investment?.user._id} />
                                                        </div>

                                                        <div className='mb-4'>
                                                            <Label>Name:</Label>
                                                            <Input disabled value={investment?.user.name} />
                                                        </div>

                                                        <div className='mb-4'>
                                                            <Label>Phone:</Label>
                                                            <Input disabled value={investment?.user.phone} />
                                                        </div>

                                                        <div className='mb-4'>
                                                            <Label>Email:</Label>
                                                            <Input disabled value={investment?.user.email} />
                                                        </div>

                                                        <div className='mb-4'>
                                                            <Label>Rank:</Label>
                                                            <Input disabled value={investment?.user.rank} />
                                                        </div>
                                                    </DialogDescription>
                                                </DialogContent>

                                            </Dialog>
                                        </TableCell>
                                        <TableCell>{investment.upi}</TableCell>
                                        <TableCell >{investment.amount}</TableCell>
                                        <TableCell>{investment.status}</TableCell>
                                        <TableCell>{investment.createdAt}</TableCell>
                                        <TableCell className="text-right">
                                            {/* Approve button with alert  */}
                                            <AlertDialog>
                                                <AlertDialogTrigger className='bg-slate-600 mr-1 text-white p-2 px-4 hover:bg-slate-400 font-medium rounded-md'>
                                                    {/* <Button className='bg-slate-600 mr-1'>Approve</Button> */}
                                                    Approve
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will give update the investment of ₹{investment.amount} of {investment.name}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => approveInvestment(investment._id, 'Approved')}>Approve</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            {/* Decline button with alert  */}
                                            <AlertDialog>
                                                <AlertDialogTrigger className='p-2 px-4 rounded-md bg-red-500 hover:bg-red-300 cursor-pointer font-medium text-white'>
                                                    {/* <Button variant='destructive'>Decline</Button> */}
                                                    Decline
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will give permanently delete this request
                                                            even user have enough amount to withdraw.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => approveInvestment(investment._id, 'Declined')}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                ) : (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={7} className='bg-green-50 text-center font-medium text-[20px] h-40' >
                                No investments To Display
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )
            }
        </Table>
    )
}

function PersonalIncome() {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    function sendToOne(){
        axios.post('/api/investment/send', {incr:amount, phone}).then(res=>{
            toast({
                title: res.data?.msg
            })
        }).catch(err=>{
            console.error(err)
            toast({
                title:err.response.data.msg || err.message
            })
        })
    }
  return (
    <Dialog>
    <DialogTrigger className='w-fit font-medium mt-4 px-12 bg-black py-1 text-white rounded-md' >
        Personal Sending
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
  )
}

export default Invest