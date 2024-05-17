
import React, { useState, useEffect } from "react";
import COVER_IMAGE from "../../assets/img/Login/Blue White Minimal Creative Illustration Short Link Application Online Instagram Story (4).png";
import Gogle from "../../assets/img/Login/th.jpg";
import { useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import Header from "components/Header";
import {useResetPassMutation} from '../../state/api';
import tr from "Services/tr";
import Cookies from "js-cookie";

const ResetPassword = () => {
  
  const [ ResetPassword , setResetPassword] = useState("réinitialiser votre mot de passe");
  const [Bien , setBien] = useState("Bienvenue ! S'il vous plaît entrez vos nouveau password.");
  const [PassPlace , setPassPlace] = useState("Nouveau mot de passe");
  const [Modifier , setModifier] = useState("Modifier");

  useEffect(() => {
    const langto = Cookies.get("to");
    console.log(langto);
    // fonction multiThreads
    const translateData = async () => {
     if (langto != "fra" && langto) {
     
      setBien(await tr(Bien , "fra", langto))
      setResetPassword(await tr(ResetPassword , "fra", langto));
      setPassPlace(await tr(PassPlace , "fra", langto))
      setModifier(await tr(Modifier , "fra", langto))

     }
    };
    translateData();
  }, []);
  // Le composant ResetPassword est une page permettant 
  // à l'utilisateur de réinitialiser son mot de passe
  // en entrant un nouveau mot de passe. Il utilise
  // useState pour gérer l'état du nouveau mot de passe
  // entré, et useParams pour obtenir les paramètres d'URL,
  // tels que l'identifiant utilisateur (id) et le jeton
  // (token). Le composant utilise également
  // useResetPassMutation pour appeler la mutationds
  // API nécessaire pour réinitialiser le mot de 
  // passe. Une fois le mot de passe réinitialisé 
  // avec succès, l'utilisateur est redirigé
  // vers la page de connexion.
  const navigate = useNavigate();
  const {id,token} = useParams();
  const [ResetPass] = useResetPassMutation();
  const [passEnt, setpassEnt] = useState("");
  
  const handleChangePassword = (e) => {
    setpassEnt(e.target.value);
  };
  const handleSubmit =  async (event)=>{
    event.preventDefault();
    try {
      const res = await ResetPass({password : passEnt , id : id , token : token});
      if(res.data.Status === "Success"){
        navigate("/login")
      }
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
            {ResetPassword}
          </h2>
          <p className="text-base mb-4 dark:text-white font-Quicksand font-semibold">
        {Bien}
          </p>
          <form method="Post" onSubmit={handleSubmit} className="lg:mt-[100PX]">
            <input
              type="password"
              name="password"
              placeholder={PassPlace}
              onChange={handleChangePassword}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white  "
            />
            <button className="w-full bg-[#060606] hover:bg-accent text-white rounded-md py-3 mb-4 font-Quicksand font-semibold dark:border dark:border-accent">
              {Modifier}
            </button>
          </form>
          </div>  
          </div> 
    </>
  );}

export default ResetPassword;
