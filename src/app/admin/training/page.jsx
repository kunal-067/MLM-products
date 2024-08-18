'use client'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';


function Training() {
  const [activeTrainings, setActiveTrainings] = useState('');
  const [pendingTrainings, setPendingTrainings] = useState('');
  const [dactiveTrainings, setDactiveTrainings] = useState('');

  useEffect(() => {
    axios.get('/api/training?isAdmin=true&status=Active').then(res => setActiveTrainings(res.data?.trainings)).catch(err => console.log(err))
    axios.get('/api/training?isAdmin=true&status=Pending').then(res => setPendingTrainings(res.data?.trainings)).catch(err => console.log(err))
    axios.get('/api/training?isAdmin=true&status=Dactive').then(res => setDactiveTrainings(res.data?.trainings)).catch(err => console.log(err))

  }, [])
  return (
    <div className='p-2'>
      <div className="flex">
        <h2 className="text-3xl font-bold my-2">Trainings</h2>
      </div>
      <section>
        <DataTable trainings={pendingTrainings} />
      </section>
    </div>
  )
}

function DataTable({ trainings }) {
  function activate(id, status) {
    axios.put('/api/training', { status, trainingId: id }).then(res => {
      toast({
        title: res.data?.msg
      })
    }).catch(err => {
      console.log(err);
      toast({
        title: err.response?.data.msg || err.message
      })
    })
  }
  if (trainings?.length > 0) {
    return (
      <Table className='bg-white'>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>UPI</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>User</TableHead>
            <TableHead className='text-right pr-8'>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {
            trainings.map(training => (
              <TableRow key={training._id}>
                <TableCell>{training._id}</TableCell>
                <TableCell>{training.upi}</TableCell>
                <TableCell>{training.amount}</TableCell>
                <TableCell>{training.user}</TableCell>

                <TableCell>
                  <Button onClick={() => activate(training._id, 'Dactivated')}>Decline</Button>
                  <Button onClick={() => activate(training._id, 'Activated')}>Activate</Button>
                </TableCell>
              </TableRow>))
          }

        </TableBody>
      </Table>

    )
  } else {
    return (
      <div className='w-full h-40 flex justify-center items-center'>
        <h2 className='text-[24px] font-medium'>No training request yet</h2>
      </div>
    )
  }

}


export default Training