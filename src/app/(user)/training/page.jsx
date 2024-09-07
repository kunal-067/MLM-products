'use client'
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const Training = () => {
    const [activeCards, setActiveCards] = useState('');
    const [decativeCards, setDeactiveCards] = useState('');
    const [pendingCards, setPendingCards] = useState('');

    useEffect(() => {
        axios.get('/api/training').then(res => {
            const cards = res.data?.trainings;
            if (!cards || cards.length < 1) {
                setActiveCards([]);
                setDeactiveCards([]);
                setPendingCards([]);
                return;
            }

            const actCard = cards.filter(card => card.status == 'Activated');
            setActiveCards(actCard);

            const dectCard = cards.filter(card => card.status == 'Dactivated');
            setDeactiveCards(dectCard);

            const pendCard = cards.filter(card => card.status == 'Pending');
            setPendingCards(pendCard);

        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <div className='mx-2 sm:mx-6'>
            <div className='text-xl font-bold py-[1rem] mx-1 bg-[#fff] -mt-10 pl-4 rounded-sm shadow-md'>
                Training
            </div>

            <section className='mt-4 pt-0 p-4'>
                {
                    (pendingCards && pendingCards.length > 0)&&(
                        pendingCards.map(card => (
                            <TrainingCard key={card._id} np={true} amount={card.amount} status={'Processing'} />
                        ))
                    )
                }
                {
                    activeCards && activeCards.length > 0&&(
                        activeCards.map(card => (
                            <TrainingCard key={card._id} np={true} amount={card.amount} status={'Active'} />
                        ))
                    )
                }
                {
                    decativeCards && decativeCards.length > 0&&(
                        decativeCards.map(card => (
                            <TrainingCard key={card._id} np={true} amount={card.amount} status={'Deactivated'} />
                        ))
                    )
                }

                <TrainingCard amount={2019} status={'lo'}/>
            </section>
        </div>
    )
}

function TrainingCard({ amount, status, np }) {
    // const [quantity, setQuantity] = useState(1);
    const [upi, setUpi] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('/api/training', { upi, amount }).then(res => {
            toast({
                title: 'Request submitted successfully ! Now pay to proceed.'
            })

            setTimeout(() => {
                window.location.href = `/payment?amount=${amount}`
            }, 100);
        }).catch(err => {
            console.log(err)
            toast({
                title: err.response?.data.msg || err.message
            })
        })
    }
    return (
        <div className='m-1 flex flex-1 bg-[#fff] rounded-sm p-2'>
            <div className='flex size-[100px] w-[120px] justify-center items-center bg-gray-200 mr-2 p-2'>
                {/* <img src="omilogo.png" alt="kl" className='w-full' /> */}
                <h2 className='font-bold'>Richtrek</h2>
            </div>
            <div className='w-full'>
                <b>Training</b>
                <p>₹{amount}</p>
                <div className='flex items-center justify-end w-full'>
                    <AlertDialog open={np && false} >
                        <AlertDialogTrigger className={`${status == 'Active' ? 'bg-blue-600' : ''} ${status == 'Dactivated' ? 'bg-red-600' : ''} ${status == 'Processing' ? 'bg-yellow-600' : ''} ${status == 'lo'?'bg-green-700':''} rounded-sm flex justify-center items-center text-white px-3 py-[5px]`}>
                            {
                                status == 'lo' ? 'Activate' : status
                            }
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogTitle className='text-center'>Training Payout</AlertDialogTitle>
                            <form onSubmit={handleSubmit}>
                                <div className='flex flex-col mb-2'>
                                    <label htmlFor="upi" className='float-left text-gray-700'>Upi:</label>
                                    <input className='bg-gray-100 font-medium p-2 rounded-sm' placeholder='Enter Upi through which you will do payment' required type="text" value={upi} onChange={(e) => setUpi(e.target.value)} />
                                </div>

                                <div className='flex flex-col mb-4'>
                                    <label htmlFor="price" className='float-left text-gray-700'>Price</label>
                                    <input disabled={true} className='bg-gray-100 font-medium p-2 rounded-sm' placeholder='amount' type="text" value={`₹${amount}`} />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction type='submit'>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </div>
        </div>
    )
}

export default Training