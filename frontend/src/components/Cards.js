import React , { useEffect, useState } from "react";

import { product } from '../data';
import ArrowImg from '../assets/img/product/cards/arrow.svg';
import tr from "Services/tr";
import Cookies from "js-cookie";
const Cards = () => {
  
  //index store 
  const [index , setIndex] =useState(1);
  //destructure product data
  const {cards} = product;

  const [translatedData, setTranslatedData] = useState([]);
  useEffect(() => {
    const langto = Cookies.get("to");
    // fonction multiThreads
    const translateData = async () => {
      const translatedItems = await Promise.all(
        // pour exécuter plusieurs promesses en parallèle. Cela signifie que toutes les promesses à l'intérieur de Promise.all doivent se terminer avant que la fonction ne continue.
        cards.map(async (item) => {
          const it = item;
          if (langto != "fra" && langto) {
            it.subtitle = await tr(item.subtitle, "fra", langto);
            it.title = await tr(item.title, "fra", langto);
          }
          // Test de premiere fois : (data par default c'est fra)
          return { ...it };
        })
      );
      setTranslatedData(translatedItems);
    };

    translateData();
  }, []);
  return <>
   {/* cards   */}
   <div className='dark:bg-black flex flex-col gap-y-[30px] lg:flex-row lg:gap-x-[30px]'>
    {
      translatedData.map((card , cardIndex)=>{
        const { icon , title , subtitle , delay} = card;
        return (
          <div key={cardIndex}   >
            <div 
            onClick={()=>setIndex(cardIndex)}
            className={`${index === cardIndex &&  'dark:bg-gray-800 bg-white shadow-2xl'} w-[350px] h-[350px] flex flex-col 
            justify-center items-center mx-auto p-[65px] text-center rounded-[12px] cursor-pointer transition-all`}
            >
              {/* card icon */}
              <div className='mb-6'>
                <img src={icon} alt=''/>
              </div>
              {/* card title */}
              <div className='dark:text-white mb-3 text-[30px] font-medium font-Quicksand font-semibold' >{title}</div>
              {/* card subtitle */}
              <div className='dark:text-white mb-6 text-light font-Quicksand font-medium'>{subtitle}</div>
              {/* arrow img */}
              {index === cardIndex && <img src={ArrowImg}/>}

            </div>
          </div>
        )
      })
    }
   </div>
  </>
  return <div>Cards</div>;
};

export default Cards;
