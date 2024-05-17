import React , { useEffect, useState } from "react";
import { features } from '../data';
import { useNavigate } from 'react-router-dom';
import tr from "Services/tr";
import Cookies from "js-cookie";
const Feature1 = () => {
  
  const {feature1} = features;
  const {  btnIcon , image }= feature1;
  //pretitle , title , subtitle , btnLink
  const [pretitle,setpretitle] = useState(feature1.pretitle);
  const [title,settitle] = useState(feature1.title);
  const [subtitle,setsubtitle] = useState(feature1.subtitle);
  const [btnLink,setbtnLink] = useState(feature1.btnLink);
  const navigate = useNavigate();
  
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
  const handleModelClick = () => {
    // Redirige vers la page de connexion lorsque le bouton est cliqué
    navigate('/Modeles');
  };
  return <section className=' dark:bg-black section '>
    <div className='container mx-auto'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:gap-x-[30px]'>
        {/* text */}
        <div className='flex-1' data-aos = "fade-right" data-aos-offset ='400' >
          <div className=' dark:text-white pretitle  '>{pretitle}</div>
          <div className=' dark:text-white title '>{title}</div>
          <div className='dark:text-white lead '>{subtitle}</div>
          <button className=' mt-[10px] mb-[10px]  lg:mt-[0px] lg:mb-[0px] btn-link flex items-center gap-x-3 hover:gap-x-5 transition-all font-Quicksand font-semibold'
           onClick={handleModelClick}>
            {btnLink} <img src={btnIcon} alt=''></img>
          </button>
        </div>
        {/* image */}
        <div className='flex-1'  data-aos = "fade-right" data-aos-offset ='300'>
          <img className ='rounded-lg' src= {image} ></img>
        </div>
      </div>
    </div>
  </section>;
};

export default Feature1;
