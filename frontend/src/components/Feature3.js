import React , { useEffect, useState } from "react";
import { features } from '../data';
import tr from "Services/tr";
import Cookies from "js-cookie";
const Feature3 = () => {
  
  const {feature3} = features;

  const {  btnIcon , image }= feature3;
  //pretitle , title , subtitle , btnLink
  const [pretitle,setpretitle] = useState(feature3.pretitle);
  const [title,settitle] = useState(feature3.title);
  const [subtitle,setsubtitle] = useState(feature3.subtitle);
  const [btnLink,setbtnLink] = useState(feature3.btnLink);
 
  
   useEffect(() => {
     const langto = Cookies.get("to");
     // fonction multiThreads
     const translateData = async () => {
      if (langto != "fra" && langto) {
        setpretitle(await tr(pretitle , "fra", langto))
        settitle(await tr(title , "fra", langto))
        setsubtitle(await tr(subtitle , "fra", langto))
        setbtnLink(await tr(btnLink , "fra", langto))
      }
     };
 
     translateData();
   }, []);
  


  return <section className=' dark:bg-black section   ' >
    <div className='container mx-auto'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:gap-x-[30px]'>
        {/* text */}
        <div className='flex-1'  >
          <div className=' dark:text-white lg:pretitle font-bold text-[23px] mb-[7px] lg:mb-[0px] text-gray-600  '>{pretitle}</div>
          <div className="w-[150px] h-[5px] my-[10px] bg-accent"></div>
          <div className=' dark:text-white lg:title font-bold text-[17px]  '>{title}</div>
          <div className='dark:text-white lg:lead '>{subtitle}</div>
         
        </div>
        {/* image */}
        <div className='flex-1' >
          <img className =' rounded-sm lg:rounded-lg' src= {image} ></img>
        </div>
      </div>
    </div>
  </section>;
};

export default Feature3;
