"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel.jsx";
import Image from "next/image";;
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
// import PayNow from "@/components/common/PayNow";
import { Minus, Plus } from "lucide-react";
import Loader from "@/components/common/Loader";
import { UserContext } from "@/app/context/Context";
import PayNow from "@/components/main/PayNow";

function Page({ params, searchParams }) {
  const { user } = useContext(UserContext);

  const [api, setApi] = useState(0);
  const [current, setCurrent] = useState(0);

  const [coupon, setcoupon] = useState("none");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [count, setCount] = useState(0);
  const [product, setProduct] = useState(undefined);
  const [payNow, setPayNow] = useState({});
  const [loading, setLoading] = useState(true);

  const [coupDiscount, setCoupDiscount] = useState('');
  useEffect(() => {
    axios.get(`/api/product/v/${params._id}`).then(res => {
      setProduct(res.data.product);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    })
  }, [params])

  const buyNow = async () => {
    try {
      if (!user) {
        return toast({
          title: "You haven't logged in yet please login firstly"
        })
      }

      toast({
        title:"Feature comming soon ..."
      })
      // if (product) {
      //   setPayNow({
      //     shopId: product.shops[0].shop || product.addedBy,
      //     productType: params.categroy,
      //     productId: product._id,
      //     quantity: quantity,
      //     amount: product.shops[0]?.price || product.price,
      //     size,
      //     discount50: coupon === "balance50",
      //     discount10: coupon === "balance2",
      //     balance: coupon === "earning",
      //   });
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const addtocart = async () => {
    try {
      toast({
        title: 'Feature comming soon...'
      })
      console.log(coupon);
    } catch (err) {
      console.log(err);
    }
  };

  //for automatic scrolling caresol
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [count, current, api]);


  if (payNow) {
    // return <PayNow payNow={payNow} setPayNow={setPayNow} />
  }
  if (loading) {
    return (
      <div className='w-full h-40 flex justify-center items-center'>
        <Loader />
      </div>
    )
  }

  return <>
  { product ? (
    <>
      <PayNow/>
      <div className=" bg-gray-200 shadow-md mb-4 pb-10">

        <div className="flex bg-white flex-wrap">
          <div className="md:flex flex-col p-2 pt-1 hidden">
            {product &&
              product.images.map((img, i) => (
                <div
                  key={i}
                  className="size-24 flex justify-center items-center bg-slate-100 mt-1"
                >
                  <Image
                    src={img}
                    width={100}
                    height={100}
                    alt="img"
                    className="w-full"
                  />
                </div>
              ))}
          </div>

          <Carousel
            setApi={setApi}
            className="w-full bg-white max-w-[650px] mt-2"
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent>
              {product.images.map((img, i) => (
                <CarouselItem key={i}>
                  <div className="size-full h-[60vh] flex justify-center items-center">
                    <img src={img} alt="" className="h-full" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex w-full justify-center p-1">
              {product.images.map((img, i) => (
                <p
                  key={i}
                  className={`size-[10px] border-[1px] border-slate-700 rounded-full m-1 ${current == i + 1 ? "bg-gray-500" : ""
                    }`}
                ></p>
              ))}
            </div>
          </Carousel>

          <div className="relative lg:ml-4 lg:shadow-md lg:p-4 lg:w-[45vw]">
            <p className="px-2 text-lg bg-white">{product.name}</p>

            <p className="p-2 pt-4 text-3xl font-mono font-bold bg-white w-full">
              <del className="mr-4 text-gray-500 opacity-80 font-thin font-serif">
                {product.mrp}
              </del>
              ₹{product.sp}

              {coupDiscount && (
                <span className="text-green-500 text-2xl mb-2 font-medium">
                  {" "}
                  -₹{coupDiscount}
                </span>)}
            </p>

            <div className="p-2 bg-white mt-1 pb-6">
              <h2 className=" text-lg font-bold mb-2">
                Offers & Coupons{" "}
                <Link
                  href={"/user/wallet"}
                  className="float-right mr-2 underline text-blue-600 font-medium font-mono px-3"
                >
                  info
                </Link>
              </h2>

              {user && (
                <RadioGroup
                  defaultValue="none"
                  className="ml-3"
                  // onValueChange={handleCoup}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balance2" />
                    <Label htmlFor="balance2" className="opacity-70">
                      Use 2% Wallet(₹{user.balance2})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 text-2xl">
                    <RadioGroupItem value="balance50" />
                    <Label htmlFor="balance50" className="opacity-70">
                      Use 50% Wallet(₹{user.balance50})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balance" />
                    <Label htmlFor="earning" className="opacity-70">
                      Use Earnings(₹{user.balance})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" />
                    <Label htmlFor="none" className="opacity-70">
                      None
                    </Label>
                  </div>
                </RadioGroup>)}
            </div>
            <span className="ml-5 font-bold">Quantity</span>
            <div className=" select-none flex items-center justify-start p-2">
              <Minus
                onClick={() =>
                  setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))
                }
                className="text-2xl hover:text-blue-500 cursor-pointer mr-5"
              />
              {quantity}
              <Plus
                onClick={() => setQuantity(quantity + 1)}
                className="text-2xl hover:text-blue-500 cursor-pointer ml-5"
              />
            </div>

            <div className="p-2 fixed md:relative lg:mt-32 bottom-0 right-0 w-full flex justify-between border-t-[1px] border-gray-300 bg-white">
              <Button
                onClick={addtocart}
                className="w-[48%] bg-transparent text-black text-lg h-12 hover:bg-green-300"
              >
                Add to cart
              </Button>
              <Button
                onClick={buyNow}
                className="w-[48%] bg-blue-800 text-lg h-12"
              >
                Buy
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-2 mt-[4px] ">
        <div className="w-full flex justify-center items-center bg-white">
          <div className="border-2 w-[95%] rounded">
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className='w-[100vw] h-40 flex justify-center items-center'>
      <h2 className='text-[24px] font-medium'>No product found</h2>
    </div>
  ) }
  </>
}

export default Page;
