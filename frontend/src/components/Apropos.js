import React , { useEffect,  useState } from "react";
import { product } from '../data';
import Cards from './Cards';  
import Header from './Header';
import Footer from './Footer';
import tr from "Services/tr";
import Cookies from "js-cookie";
const Apropos = () => {
  // destructure product data
 
  const [title,settitle] = useState(product.title);
  const [subtitle,setsubtitle] = useState(product.subtitle);
  useEffect(() => {
    const langto = Cookies.get("to");
    // fonction multiThreads
    const translateData = async () => {
     if (langto != "fra" && langto) {
      
       settitle(await tr(title , "fra", langto))
       setsubtitle(await tr(subtitle , "fra", langto))
     
     }
    };

    translateData();
  }, []);
  return <section className=' dark:bg-black  mt-52 lg:mt-[-20PX] section'>
    <Header/>
    <div className='container mx-auto  '>
      {/* title subtitle */}
      <div className='flex flex-col items-center
       lg:flex-row mb-10 lg:mb-20 lg:ml-[90px]'>
        <h2 className='dark:text-white lg:section-title text-[25px] font-bold mb-[10px] mr-[25px] lg:mr-[0px] lg:mb-[0px] '
        
        > {title}
        </h2>
        <p className=' dark:text-white lead lg:max-w-[350px] lg:ml-[80px] lg:mt-[100px] '
        
        >{subtitle}
        </p>
      </div>
      {/* card */}
      <Cards />
    </div>
    <Footer/>
  </section>;
};

export default Apropos;
