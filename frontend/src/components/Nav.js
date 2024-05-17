// import React from 'react';
// //import data
// import {nav} from '../data'

// const Nav = () => {
//   return <nav>
//     <ul className='flex gap-x-10'>
//       {nav.map((item,index)=>{
//         //destructure item
//         const {href , name} =item;
//         return(
//           <li key={index}>
//             <a className= ' dark:text-white text-sm font-bodyfont hover:text-accent transition'
//              href={href}>
//               {name}
//             </a>
//           </li>
//         );
//       })}

//     </ul>
//   </nav>;
// };

// export default Nav;
import React, { useState, useEffect } from "react";
//import data
import { nav } from "../data";
import tr from "Services/tr";
import Cookies from "js-cookie";

const Nav = () => {
  // useState de  translatedData
  const [translatedData, setTranslatedData] = useState([]);
  useEffect(() => {
    const langto = Cookies.get("to");
    // fonction multiThreads
    const translateData = async () => {
      const translatedItems = await Promise.all(
        // pour exécuter plusieurs promesses en parallèle. Cela signifie que toutes les promesses à l'intérieur de Promise.all doivent se terminer avant que la fonction ne continue.
        nav.map(async (item) => {
          const it = item;
          if (langto != "fra" && langto) {
            it.name = await tr(item.name, "fra", langto);
          }
          // Test de premiere fois : (data par default c'est fra)
          return { ...it };
        })
      );
      setTranslatedData(translatedItems);
    };

    translateData();
  }, []);

  return (
    <nav className="flex justify-evenly ">
      <ul className="flex gap-x-10">
        {translatedData.map((item) => {
          //destructure item
          return (
            <li key={item.key}>
              <a
                className=" dark:text-white text-sm font-bodyfont hover:text-accent transition"
                href={item.href}
              >
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
      {/* <select
        onChange={handleLanguageChange}
        value={lang}
        className="block appearance-none bg-transparent border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500 text-accent font-Quicksand"
      >
        <option value="eng">English</option>
        <option value="fra">French</option>
        <option value="ara">Arabic</option>
        {/* Ajoutez d'autres options de langues au besoin */}
      {/* </select> */} 
    </nav>
  );
};

export default Nav;
