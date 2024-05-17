
import React, { useState, useEffect } from "react";
import COVER_IMAGE from "../../assets/img/Login/Blue White Minimal Creative Illustration Short Link Application Online Instagram Story (4).png";
import Gogle from "../../assets/img/Login/th.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "components/Header";
import {useForgoutPasswordMutation} from '../../state/api'
import { Email } from "@mui/icons-material";
import tr from "Services/tr";
import Cookies from "js-cookie";
const ForgoutPass = () => {
  
  const [MotpassO , setMotpassO] = useState("Vous avez oublié votre mot de passe.");
  const [Bien , setBien] = useState(" Bienvenue ! S'il vous plaît entrez vos Email.");
  const [EmailPlace , setEmailPlace] = useState("Adresse Email");
  const [Envoyez , setEnvoyez] = useState("Envoyez");

  useEffect(() => {
    const langto = Cookies.get("to");
    console.log(langto);
    // fonction multiThreads
    const translateData = async () => {
     if (langto != "fra" && langto) {
     
      setBien(await tr(Bien , "fra", langto))
      setEmailPlace(await tr(EmailPlace , "fra", langto));
      setMotpassO(await tr(MotpassO , "fra", langto))
      setEnvoyez(await tr(Envoyez , "fra", langto))

     }
    };
    translateData();
  }, []);

// Le composant ForgoutPass est une page de récupération
// de mot de passe qui permet à l'utilisateur d'entrer
// son adresse e-mail pour recevoir des instructions 
// de réinitialisation de mot de passe. Il utilise
// useState pour gérer l'état de l'e-mail entré,
// useEffect pour gérer les effets secondaires,
// et les fonctions handleChangeEmail et handleSubmit 
// pour gérer les événements de modification et de 
// soumission du formulaire. Il importe également
// des éléments tels que Header, des images, et des 
// fonctions de routage
// de react-router-dom pour la navigation.
    const [ForgoutPass] = useForgoutPasswordMutation();
  const [emailEnt, setEmailEnt] = useState("");
  const [succes , setSuccess] = useState("")
  
  const handleChangeEmail = (e) => {
    setEmailEnt(e.target.value);
  };
  const handleSubmit =  async (event)=>{
    event.preventDefault();
    try {
         const Info = await ForgoutPass({
         email: emailEnt,
      });
       setSuccess(Info.data.message)
    } catch (error) {
        console.log(error);
    }
   
  }
  return (
    <>
      <Header />
      <div className=" flex flex-col lg:flex-row mt-8  lg:ml-[285px] lg:mt-[150px] ">
        <div className=" dark:bg-black w-full lg:w-[350px]">
          <img
            src={COVER_IMAGE}
            className="w-full h-auto lg:rounded-l-lg lg:shadow-2xl"
            alt="Cover Image"
          />
        </div>
        <div className="  dark:bg-black w-full lg:w-1/2  bg-[#f5F5F5] p-8 lg:rounded-r-lg lg:shadow-2xl  dark:text-white font-Quicksand font-semibold  ">
          <h2 className="text-4xl font-semibold mb-4 dark:text-white">
          {MotpassO}
          </h2>
          <p className="text-base mb-4 dark:text-white font-Quicksand font-semibold">
          {Bien}
          </p>
          <form method="Post" onSubmit={handleSubmit} className="lg:mt-[100PX]">
            <input
              type="email"
              name="email"
              placeholder={EmailPlace}
              onChange={handleChangeEmail}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white  "
            />
            <button className="w-full bg-[#060606] hover:bg-accent text-white rounded-md py-3 mb-4 font-Quicksand font-semibold dark:border dark:border-accent">
              {Envoyez}
            </button>
          </form>
          <p className="text-red-600" >{succes}</p>
          </div>  
          </div> 
    </>
  );}

export default ForgoutPass;
