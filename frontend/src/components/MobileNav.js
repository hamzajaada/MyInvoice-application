import React from 'react';
//import data 
import {Mobilnav} from '../data'
const MobileNav = () => {
  const userId = localStorage.getItem("userId");
  return <div className='bg-accent/95 w-full h-full'>
    <ul className='h-full flex flex-col justify-center items-center
    gap-y-8'>
      {Mobilnav.map((item , index)=>{
        // destructure item 
        const {href , name } = item;
        return (
          <li key={index}>
            <a className='link text-white text-xl font-Quicksand font-semibold hover:text-black'
            href={href}>
              {name}
            </a>
          </li>
        );
      })}
    </ul>
  </div>;
};

export default MobileNav;
