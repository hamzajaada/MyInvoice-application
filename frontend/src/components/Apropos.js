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
  return <section className=' dark:bg-black mt-[130PX] lg:mt-[-80PX] section'>
    <Header/>
    <div className='container mx-auto  '>
      {/* title subtitle */}
      <div className='flex flex-col items-center
       lg:flex-row mb-10 lg:mb-20 lg:ml-[90px]'>
        <h2 className='dark:text-white section-title '
         data-aos="fade-up"
         data-aos-offset='400'
         data-aos-delay='300'
        > {title}
        </h2>
        <p className=' dark:text-white lead lg:max-w-[350px] lg:ml-[80px] lg:mt-[100px] '
         data-aos="fade-up"
         data-aos-offset='400'
         data-aos-delay='300'
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
