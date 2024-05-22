import React , { useEffect,  useState } from "react";
import { cta } from '../data';
import { useNavigate } from 'react-router-dom';
import tr from "Services/tr";
import Cookies from "js-cookie";

// import icons ;
import { HiOutlineChevronDoubleRight } from 'react-icons/hi';
const Cta = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    const userId = localStorage.getItem("userId");
    const redirectPath = userId ? "/ajouterFacture" : "/login";
    navigate(redirectPath);
  }
  const { img1 , img2} = cta;
  // title , subtitle, btnText ,
  const [title,settitle] = useState(cta.title);
  const [subtitle,setsubtitle] = useState(cta.subtitle);
  const [btnText,setbtnText] = useState(cta.btnText);
  useEffect(() => {
    const langto = Cookies.get("to");
    // fonction multiThreads
    const translateData = async () => {
     if (langto != "fra" && langto) {
      
       settitle(await tr(title , "fra", langto))
       setsubtitle(await tr(subtitle , "fra", langto))
       setbtnText(await tr(btnText , "fra", langto))
     }
    };

    translateData();
  }, []);
  return (
    <section className='py-[60px] bg-cta bg-cover bg-left-top '>
      <img className='hidden xl:flex lg:w-[46%] lg:absolute lg:mt-[-191px] lg:ml-[-230px]' src={img1} alt=''
          
          />
      <div className='max-w-[1340px] mx-auto px-[25px] lg:ml-[150px]'>
        
        {/* text */}
        <div className='max-w-[920pw] mx-auto text-center'>
          <h2 className='h2 text-white mb-6'
         >
           { title}
          </h2>
          <p className='text-2xl font-Quicksand font-semibold lg:text-4xl text-white'
          >
            {subtitle}
          </p>
        </div>
        {/* btn images */}
        <div className='flex justify-between'>
          {/* <img className='hidden xl:flex lg:w-[46%] lg:absolute lg:mt-[-271px] lg:ml-[-150px]' src={img1} alt=''
          data-aos= 'zoom-out-right'
          data-aos-delay='700'
          /> */}
          <button className='btn btn-md btn-white mt-[40px] lg:text-[22px] gap-x-[10px] mx-auto font-Quicksand font-semibold'
         
          onClick={handleLoginClick}
          >
            {btnText} <HiOutlineChevronDoubleRight/>
          </button>
         
          
        </div>
      </div>
    </section>
  );
};

export default Cta;
