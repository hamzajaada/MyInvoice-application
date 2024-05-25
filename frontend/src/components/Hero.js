/* eslint-disable react-hooks/exhaustive-deps */
import React , { useEffect, useState } from "react";
import { hero } from '../data';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import tr from "Services/tr";
import Cookies from "js-cookie";


const Hero = () => {
   // useState de  translatedData
  const [title,setTitle] = useState(hero.title);
  const [subtitle,setSubtitle] = useState(hero.subtitle);
  const [btnText,setBtnText] = useState(hero.btnText);
  // const [translatedData, setTranslatedData] = useState([]);
   var trText = "";
   useEffect(() => {
     const langto = Cookies.get("to");
     // fonction multiThreads
     const translateData = async () => {
      if (langto !== "fra" && langto) {
        trText = await tr(title , "fra", langto);
        setTitle(trText);
        trText = await tr(subtitle , "fra", langto);
        setSubtitle(trText)
        trText = await tr(btnText , "fra", langto);
        setBtnText(trText)
      }
     };
 
     translateData();
   }, []);
  const { image } = hero;
  
  const navigate = useNavigate();
  const handleLoginClick = () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const redirectPath = userId ? `${userName}/ajouterFacture` : "/login";
    navigate(redirectPath);
  }
  return (
    // margin-top: 82px;
    // padding-top: 147Px;
    <section className=' block mt-[-205px] lg:mt-[0px]  lg:flex lg:justify-evenly  dark:bg-black    h-[1000px] lg:h-auto ' id="hero">

        
          {/* text */}
          <div className=' p-[20px] lg:p-[0px] h-auto w-auto lg:w-[50%]   '>
            <h1
              className='dark:text-white lg:text-[37px] text-center lg:text-left text-[27px] mt-[320Px]    lg:mt-[280Px]   font-Quicksand  title mb-2 lg:mb-5  font-bold'
            
            >
              {title}
            </h1>
           
            <p
              className=' dark:text-gray-300 text-md text-center lg:text-left  font-Quicksand lead mb-5 lg:mb-10'
              // data-aos='fade-down'
              // data-aos-delay='1200' // Correction ici
            >
              {subtitle}
            </p>
                <div
                  className=" md:ml-[220px] lg:ml-[0px] m mx-auto ml-0 gap-x-2 lg:gap-x-6"
                >
                  <button className='btn btn-md lg:btn-lg btn-accent px-[40px] ] flex justify-center items-center lg:gap-x-4 md:ml-0'
                  onClick={handleLoginClick}>
                    {btnText}
                    <HiOutlineChevronDown />
                  </button>
                </div>
          </div>  

            <img  className='  md:ml-[160Px] mt-[-192px]  lg:mt-[0px] ml-[12px] lg:ml-[0px] h-[800px]  ' src={image} alt="hero" /> 
        
             
     
   
    </section>
  )
};

export default Hero;
