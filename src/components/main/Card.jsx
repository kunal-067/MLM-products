import React, { useState } from 'react'
import { Button } from '../ui/button'
import Loader from '../common/Loader';
import axios from 'axios';
import { toast } from '../ui/use-toast';
// import {} from 'react-lucide'

function Card({ title, value, className }) {
  const [using, setUsing] = useState(false)

  async function useCoin(){
    setUsing(true)
    try {
      const {data} = await axios.post('/api/coins/use');
      toast({
        title:data.message
      })
      setUsing(false);
    } catch (error) {
      console.log(error)
      toast({
        title:error.response.data.message || error.message
      });
      setUsing(false);
    }
  }
  return (
    <div className={'flex shadow-sm bg-[#fff] p-2 rounded-sm m-1 min-w-[260px] flex-1' + ' ' + className}>
      <div className='bg-blue-200 size-20 flex justify-center items-center mr-2 rounded-sm'>
        @
      </div>

      <div className='pt-2 w-full'>
        <p className='text-gray-500 font-medium'>{title || 'None'}</p>
        <b className='font-medium text-xl pr-10'>{value}
          {
            title == 'Royal Coins' && (
              <Button disabled={using} className='float-right' onClick={useCoin}>{using ? <Loader size='small'/> :'Use'}</Button>
            )
          }
        </b>
      </div>

    </div>
  )
}

export default Card