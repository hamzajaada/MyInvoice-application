import React , { useEffect, useState } from "react";
import { features } from '../data';
import { useNavigate } from 'react-router-dom';
import tr from "Services/tr";
import Cookies from "js-cookie";
const Feature2 = () => {
  
  const navigate = useNavigate();
  const handleGenerClick = () => {
    // Redirige vers la page de connexion lorsque le bouton est cliqué
    navigate('/Gener');
  };
  const {feature2} = features;

  const {  btnIcon , image }= feature2;
  //pretitle , title , subtitle , btnLink
  const [pretitle,setpretitle] = useState(feature2.pretitle);
  const [title,settitle] = useState(feature2.title);
  const [subtitle,setsubtitle] = useState(feature2.subtitle);
  const [btnLink,setbtnLink] = useState(feature2.btnLink);
 
  
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

  return <section className=' dark:bg-black section  '>
    <div className='container mx-auto'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:gap-x-[30px]'>
          {/* image */}
        <div className='flex-1' >
          <img className =' mb-[10px] lg:mb-[5px] rounded-sm lg:rounded-lg' src= {image} ></img>
        </div>
        {/* text */}
        <div className='flex-1'  >
          <div className=' dark:text-white lg:pretitle font-bold text-[23px] mb-[7px] lg:mb-[0px] text-gray-600  '>{pretitle}</div>
          <div className="w-[150px] h-[5px] my-[10px] bg-accent"></div>
          <div className=' dark:text-white lg:title font-bold text-[17px]  '>{title}</div>
          <div className='dark:text-white lg:lead '>{subtitle}</div>
          <button className=' mt-[10px] mb-[10px]  lg:mt-[0px] lg:mb-[0px] lg:btn-link flex items-center gap-x-3 hover:gap-x-5 transition-all font-Quicksand font-semibold'
           onClick={handleGenerClick}>
            {btnLink} <img className="hidden lg:block" src={btnIcon} alt=''></img>
          </button>
        </div>
      
      </div>
    </div>
  </section>;
};

export default Feature2;
