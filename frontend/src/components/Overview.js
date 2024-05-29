import React, { useEffect, useState ,useContext  } from 'react';
import { overview } from '../data';
import { ThemeContext } from './ThemeContext';

const Overview = () => {
  const { productImgSombre, productImgDark } = overview;

  // Récupérer la valeur de currentMode du localStorage
  // const [theme, setTheme] = useState(localStorage.getItem("currentMode"));
  // console.log(theme);
  const { theme } = useContext(ThemeContext);



  // Choisissez l'image en fonction de currentMode
  const imageSrc =  productImgDark ;

  return (
    <section className='h-auto bg-overview bg-cover bg-left-top pt-[30px] lg:pt-[87px]'>
      <div className='container mx-auto flex justify-end overflow-hidden mb-[-1px]'>
        {/* Afficher l'image en fonction de currentMode */}
        <img
          className='lg:h-[90%] w-[90%]  rounded-t-2xl'
          src={imageSrc}
          alt=''
          data-aos="fade-up"
          data-aos-offset='300'
        />
      </div>
    </section>
  );
};

export default Overview;
