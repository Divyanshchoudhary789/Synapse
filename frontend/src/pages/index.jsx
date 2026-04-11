import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";


export default function Home() {
  const router = useRouter();


  return (
    <UserLayout>
      <div className="flex flex-col justify-center items-center my-10 md:my-15 px-4 text-center">
        <div className="text-3xl md:text-5xl font-medium my-4">Stay <span className="relative">connected <span className="absolute left-0 top-[40px] md:top-[60px] h-1 md:h-2 w-full bg-yellow-500 rounded-full"></span></span> with the people</div>
        <div className="text-3xl md:text-5xl font-medium mb-3">around you.</div>
        <p className="text-base md:text-lg max-w-md">keeps you connected with the people and helps</p>
        <p className="text-lg">in building a professional network</p>
        <div className="bg-blue-500 text-white py-3 md:py-4 rounded-3xl px-6 my-4 cursor-pointer hover:scale-95" onClick={() => { router.push("/auth") }}>
          Get Started
        </div>
      </div>


      <div className="flex justify-center px-4">
        <img className="h-auto max-h-[400px] md:h-200 bg-transparent object-contain" src="/hero_image.png" alt="hero-image" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center my-10 md:my-20 px-6 md:px-20 lg:px-80 gap-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-3xl md:text-4xl font-medium my-1">Socializing is now</div>
          <div className="text-3xl md:text-4xl font-medium my-1 mb-5">in your hands</div>
          <p>Socialize and connect with people and build useful</p>
          <p>professional connections that really helps.</p>
        </div>
        <div className="w-full md:w-100 flex justify-center">
          <img className="h-60 md:h-80 object-contain" src="/image.svg" alt="connections-image" />
        </div>
      </div>


      <div className="mx-6 md:mx-20 lg:mx-60 mt-20 md:mt-40 mb-20 md:mb-30 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="w-full md:w-1/2 order-2 md:order-1" >
          <img className="h-auto md:h-100 mx-auto" src="/final_image.png" alt="image" />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 order-1 md:order-2">
          <div className="text-3xl md:text-4xl font-medium my-1">Connect and Discuss</div>
          <div className="text-3xl md:text-4xl font-medium my-2">with thousands of people</div>
          <p className="my-3">Connect and Discuss with people about latest and new emerging technologies and build a strong professional network in your field.</p>
          <div className="bg-blue-500 text-white py-4 rounded-3xl px-6 my-4 cursor-pointer hover:scale-95" onClick={() => { router.push("/auth") }}>
            Get Started
          </div>
        </div>
      </div>


      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-30 pb-20 justify-center px-6" >
        <div className="text-center md:text-left order-2 md:order-1">
          <div className="text-3xl md:text-4xl font-medium my-4">Connect and Discuss</div>
          <div className="text-3xl md:text-4xl mb-3">with thousands of people</div>
          <p className="text-base md:text-lg">Join your colleagues, classmates, and friends on Synapse</p>
          <div className="bg-blue-500 text-white py-4 rounded-3xl px-6 my-4 cursor-pointer mx-auto md:mx-0 w-full max-w-[320px]" onClick={() => { router.push("/auth") }}>
            Get Started
          </div>
        </div>
        <div className="order-1 md:order-2">
          <img className="h-60 md:h-110 object-contain" src="/about_image02.jpg" alt="about-image" />
        </div>
      </div>


    </UserLayout>
  );
}
