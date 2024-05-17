import React, { useState, useEffect } from "react";
import COVER_IMAGE from "../../assets/img/Login/Blue White Minimal Creative Illustration Short Link Application Online Instagram Story (4).png";
import Gogle from "../../assets/img/Login/th.jpg";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "components/Header";
import {
  useLoginEntrepriseMutation,
} from "state/api";
import tr from "Services/tr";
import Cookies from "js-cookie";
const Login = () => {
  //UseState de Translate :

  const [login , setlogin] = useState("Connexion");
  const [Bien , setBien] = useState("Bienvenue ! S'il vous plaît entrez vos coordonnées.");
  const [EmailPlace , setEmailPlace] = useState("Adresse Email");
  const [Motpass , setMotpass] = useState("Mot de passe");
  const [MotpassO , setMotpassO] = useState("Mot de passe oublié");
  const [Connexion , setConnexion] = useState("Connexion");
  const [Inscription , setInscription] = useState("Inscription");
  const [Ou , setOu] = useState("Ou");
  const [ConnexionGoogle , setConnexionGoogle] = useState("Connexion avec Google");
  useEffect(() => {
    const langto = Cookies.get("to");
    console.log(langto);
    // fonction multiThreads
    const translateData = async () => {
     if (langto != "fra" && langto) {
      setlogin(await tr(login , "fra", langto));
      setBien(await tr(Bien , "fra", langto))
      setEmailPlace(await tr(EmailPlace , "fra", langto));
      setMotpass(await tr(Motpass , "fra", langto))
      setMotpassO(await tr(MotpassO , "fra", langto))
      setConnexion(await tr(Connexion , "fra", langto))
      setInscription(await tr(Inscription , "fra", langto))
      setOu(await tr(Ou , "fra", langto))
      setConnexionGoogle(await tr(ConnexionGoogle , "fra", langto))
     }
    };
    translateData();
  }, []);


  
//Le composant Login représente une page
//de connexion où les utilisateurs peuvent 
//saisir leur adresse e-mail et leur mot de passe
//pour accéder à leur compte. Il utilise useState 
//pour gérer l'état de l'e-mail et du mot de passe 
//saisis, et useEffect pour effectuer des actions
//après le rendu initial. Il importe également des
//éléments tels que Header, des images, 
//et des fonctions de routage de react-router-dom
//pour la navigation.
  const location = useLocation();
  const navigate = useNavigate();
  const [loginEntreprise] = useLoginEntrepriseMutation();
  const [emailEnt, setEmailEnt] = useState("");
  const [passwordEnt, setPasswordEnt] = useState("");
  const [userId, setUserId] = useState(null);
  if(userId) {
    localStorage.setItem("userId", userId)
    navigate("/dashboardClient");
  }
  const handleChangeEmail = (e) => {
    setEmailEnt(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPasswordEnt(e.target.value);
  };

  const handleRegisterGoogle = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3001/Api/auth/google/";
  };

  const handleRegisterClick = () => {
    navigate("/Register");
  };

  const hamdelSubmit = async (event) => {
    event.preventDefault();
    try {
      const Info = await loginEntreprise({
        email: emailEnt,
        password: passwordEnt,
      });
      console.log("info user :" + Info.data.user);
      const entrepriseInfo = Info.data.user;
      if (
        entrepriseInfo.role === "admin" &&
        entrepriseInfo.status === "active"
      ) {
        localStorage.setItem("token", Info.data.jsenwebtkn);
        localStorage.setItem("userId", Info.data.user._id);
        localStorage.setItem("userName", Info.data.user.name);
        navigate(`/dashboard`);
      } else if (entrepriseInfo.status === "active") {
        localStorage.setItem("token", Info.data.jsenwebtkn);
        localStorage.setItem("userId", Info.data.user._id);
        localStorage.setItem("packId", Info.data.pack._id);
        localStorage.setItem("userName", Info.data.user.name);
        const userName = localStorage.getItem('userName');
        navigate(`/${userName}/dashboardClient`);
        // navigate(`/dashboardClient`);
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    setUserId(userId);
    if (userId) {
      return;
    }
  }, [location, navigate, userId]);


  return (
    <>
      <Header />
      <div className=" flex flex-col lg:flex-row mt-[130px]  lg:ml-[285px] lg:mt-[150px] ">
        <div className=" dark:bg-black w-full lg:w-[350px]">
          <img
            src={COVER_IMAGE}
            className="w-full h-auto lg:rounded-l-lg lg:shadow-2xl"
            alt="Cover Image"
          />
        </div>
        <div className="  dark:bg-black w-full lg:w-1/2  bg-[#f5F5F5] p-8 lg:rounded-r-lg lg:shadow-2xl  dark:text-white font-Quicksand font-semibold  ">
          <h2 className="text-4xl font-semibold mb-4 dark:text-white">
            {login}
          </h2>
          <p className="text-base mb-4 dark:text-white font-Quicksand font-semibold">
            {Bien}
          </p>
          <form method="Post" onSubmit={hamdelSubmit}>
            <input
              type="email"
              name="email"
              placeholder={EmailPlace}
              onChange={handleChangeEmail}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white  "
            />
            <input
              name="password"
              type="password"
              onChange={handleChangePassword}
              placeholder={Motpass}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
            />
            <div className="flex items-center justify-between mb-4">
              
              <p className="text-sm font-medium cursor-pointer underline dark:text-white font-Quicksand font-semibold ">
               <Link to="/ForgoutPass" >{MotpassO}</Link> 
              </p>
            </div>
            <button className="w-full bg-[#060606] hover:bg-accent text-white rounded-md py-3 mb-4 font-Quicksand font-semibold dark:border dark:border-accent">
              {Connexion}
            </button>
          </form>

          <button
            className="w-full border border-black text-[#060606] bg-white hover:bg-gray-300 rounded-md py-3 mb-4 "
            onClick={handleRegisterClick}
          >
            {Inscription}
          </button>
          <div className="w-full text-center mb-4">
            <div className="w-full h-px bg-black"></div>
            <p className="relative inline-block px-2 bg-gray-200 text-sm dark:bg-black dark:text-accent">
              {Ou}
            </p>
          </div>
          <button
            className="w-full border border-black text-[#060606] bg-white hover:bg-gray-300 rounded-md py-3 flex items-center justify-center"
            onClick={handleRegisterGoogle}
          >
            <img src={Gogle} alt="" className="w-4 mr-2" />
           {ConnexionGoogle}
          </button>
          
        </div>
      </div>
    </>
  );
};

export default Login;