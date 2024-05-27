// import { BUY_PRODUCT } from "@/utils/apiroutes";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

function PayNow({ payNow = {l:'k', p:'p'}, setPayNow }) {
  const { toast } = useToast();
  const router = useRouter()
  const [shippingAddress, setShippingAddress] = useState({});
  const [location, setLocation] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [phone, setPhone] = useState("");

  const [upi, setUpi] = useState('');

  const [openPage, setUpiPage] = useState(false);

  const placeOrder = async (e) => {
    e.preventDefault()
    const token = JSON.parse(localStorage.getItem('token'))
    // try {
    //   const { data } = await axios.post(BUY_PRODUCT, {
    //     productType: payNow.productType,
    //     productId: payNow.productId,
    //     shopId: payNow.shopId,
    //     quantity: payNow.quantity,
    //     size: payNow.size,
    //     discount50: payNow.discount50,
    //     discount10: payNow.discount10,
    //     balance: payNow.balance,
    //     shippingAddress,
    //     location,
    //     paymentMode,
    //     phone,
    //     upi
    //   }, {
    //     withCredentials: true, headers: { 'authorization': token }
    //   });
    //   if (data.msg === "order placed successfully") {
    //     if(paymentMode == 'online'){
    //         return router.push('/pay-amount')
    //     }
    //     toast({
    //       title: data.msg,
    //     });
    //     router.push(`/orderdetails/${data.id}`)
    //   }
    // } catch (err) {
    //   console.log("Something went wrong", err);
    // }
  };

  useEffect(() => {
    if (Object.keys(payNow).length === 0) {
      setPayNow(undefined);
    }
  }, [payNow, setPayNow]);

  
  return (
    // <div className="fixed">
    // inset-0

    <div className="inset-0 p-4 w-[100vw] min-h-[100vh] flex justify-center items-center bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-lg overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[95%] md:w-[50%] lg:min-w-[50%]">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <form preventDefault>
          {!openPage ? (
            <>
              <label className="block mb-2" htmlFor="phone">Phone</label>
              <input
                className="border rounded px-3 py-2 w-full mb-4"
                type="tel"
                id="phone"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <label className="block mb-2" htmlFor="phone">Street:</label>
              <input
                className="border rounded px-3 py-2 w-full mb-4"
                type="text"
                placeholder="Enter the street address"
                value={shippingAddress?.street || ''}
                onChange={(e) => setShippingAddress(prev => ({...prev, street:e.target.value}) )}
                required
              />
              <label className="block mb-2" htmlFor="phone">City:</label>
              <input
                className="border rounded px-3 py-2 w-full mb-4"
                type="text"
                placeholder="Enter the street address"
                value={shippingAddress?.city || ''}
                onChange={(e) => setShippingAddress(prev => ({...prev, city:e.target.value}) )}
                required
              />
              <label className="block mb-2" htmlFor="phone">Pin Code</label>
              <input
                className="border rounded px-3 py-2 w-full mb-4"
                type="number"
                id="phone"
                placeholder="Phone"
                value={shippingAddress?.pincode || ''}
                onChange={(e) => setShippingAddress(prev =>({...prev, pincode:e.target.value}))}
                required
              />
              <label className="block mb-2" htmlFor="phone">State:</label>
              <input
                className="border rounded px-3 py-2 w-full mb-4"
                type="text"
                placeholder="Enter the street address"
                value={shippingAddress?.state || ''}
                onChange={(e) => setShippingAddress(prev =>({...prev, state:e.target.value}) )}
                required
              />
              <label className="block mb-2" htmlFor="address">Address</label>
              <textarea
                className="border rounded px-3 py-2 w-full mb-4"
                id="address"
                placeholder="Address"
                value={shippingAddress?.address || ''}
                onChange={(e) => setShippingAddress(prev => ({...prev, address: e.target.value}) )}
                required
              />


              <label className="block mb-2">Payment Method</label>
              <div className="mb-4">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    onChange={(e) => setPaymentMode(e.target.value)}
                  />
                  <span className="ml-2">Cash on Delivery</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    onChange={(e) => setPaymentMode(e.target.value)}
                  />
                  <span className="ml-2">UPI</span>
                </label>
              </div>
            </>) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-800"
                >
                  UPI ID
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder='Please enter your UPI'
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                />
                {/* {errors.email && <p className='text-red-700 text-sm'>{errors.email}</p>} */}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Amount
                </label>
                <input
                  type="number"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder='Please enter amount'
                  value={payNow.amount}
                // onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </>
          )
          }
          <button
            onClick={() => setPayNow(false)}
            type="button"
            className="bg-red-500 mr-5 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Cancel
          </button>
          {paymentMode != 'online' || openPage ?
            <button
            type="button"
              onClick={placeOrder}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Place Order
            </button> : <button
            type="button"
              onClick={()=>setUpiPage(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Continue
            </button>
          }

        </form>
      </div>
    </div>

    // </div>
  );
}

export default PayNow;
