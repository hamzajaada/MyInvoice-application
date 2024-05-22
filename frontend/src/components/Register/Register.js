import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import COVER_IMAGE from "../../assets/img/Login/Blue White Minimal Creative Illustration Short Link Application Online Instagram Story (4).png";
import { toast } from "react-toastify";import Header from "components/Header";
import { useRegisterEntrepriseMutation } from "state/api";
import tr from "Services/tr";
import Cookies from "js-cookie";
const SignUp = () => {
  const [logo, setLogo] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmaile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("standard");
  const [subscription, setSubscription] = useState("active");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  const [register] = useRegisterEntrepriseMutation();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setLogo(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entreprise = {
      name,
      email,
      password,
      confirmPassword,
      role,
      subscription,
      phone,
      address,
      logo,
    };
    try {
      const { data } = await register(entreprise);
      if (data.success) {
        toast.success("Le registre se passe correctement");
        navigate("/login");
      } else {
        toast.error(
          "Le registre ne s'est pas passé correctement : " + data.message
        );
      }
    } catch (err) {
      toast.error("Erreur lors de l'inscription : " + err.message);
      console.log(err);
    }
  };

 
  const [Inscrire , setInscrire] = useState("Inscription");
  const [Entreprisename , setEntreprisename] = useState("Entreprise name");
  const [Email , setEmail] = useState("Email");
  const [Motdepasse , setMotdepasse] = useState("Mot de passe");
  const [Confirmezlemotdepasse , setConfirmezlemotdepasse] = useState("Confirmez le mot de passe");
  const [Téléphone , setTéléphone] = useState("Téléphone");
  const [Adresse , setAdresse] = useState("Adresse");
  const [Sinscrire , setSinscrire] = useState("S'inscrire");
  const [dejaCompte , setdejaCompte] = useState("  Vous avez déjà un compte");
  const [Ou , setOu] = useState("Ou bien");
  const [ Connectezvous , setConnectezvous] = useState(" Connectez-vous");
  useEffect(() => {
    const langto = Cookies.get("to");
    console.log(langto);
    // fonction multiThreads
    const translateData = async () => {
     if (langto !== "fra" && langto) {
      setInscrire(await tr(Inscrire , "fra", langto));
      setEntreprisename(await tr(Entreprisename , "fra", langto))
      setEmail(await tr(Email , "fra", langto));
      setMotdepasse(await tr(Motdepasse , "fra", langto))
      setConfirmezlemotdepasse(await tr(Confirmezlemotdepasse , "fra", langto))
      setTéléphone(await tr(Téléphone , "fra", langto))
      setAdresse(await tr(Adresse , "fra", langto))
      setOu(await tr(Ou , "fra", langto))
      setSinscrire(await tr(Sinscrire , "fra", langto))
      setdejaCompte(await tr(dejaCompte , "fra", langto))
      setConnectezvous(await tr(Connectezvous , "fra", langto))

     }
    };
    translateData();
  }, []);

  return (
    <>
      <Header />
      <div className=" mx-auto max-w-screen-lg flex flex-col lg:flex-row mt-[130px] lg:ml-[285px] lg:mt-[150px] lg:mb-[100px] ">
        <div className=" w-full lg:w-[350px] ">
          <img
            src={COVER_IMAGE}
            className=" lg:h-[800px] w-full  lg:rounded-l-lg lg:shadow-2xl"
            alt="Cover Image"
          />
        </div>
        <div className="dark:bg-black w-full lg:w-1/2 bg-[#f5F5F5] p-8 lg:rounded-r-lg lg:shadow-2xl">
          <h2 className="text-4xl font-Quicksand font-semibold mb-4 dark:text-white">
          {Inscrire}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={Entreprisename}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-black py-2 my-2 font-Quicksand font-semibold bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
              required
            />
            <input
              type="email"
              name="email"
              placeholder={Email}
              value={email}
              onChange={(e) => setEmaile(e.target.value)}
              className="w-full text-black py-2 my-2 font-Quicksand font-semibold bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
              required
            />
            <input
              type="password"
              name="password"
              placeholder={Motdepasse}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black py-2 my-2 font-Quicksand font-semibold bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder={Confirmezlemotdepasse}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-black py-2 my-2 font-Quicksand font-semibold bg-transparent border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder={Téléphone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-black py-2 my-2 bg-transparent font-Quicksand font-semibold border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
              required
            />
            <input
              type="text"
              name="address"
              placeholder={Adresse}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-black py-2 my-2 bg-transparent font-Quicksand font-semibold border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
              required
            />
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-black py-2 my-2 bg-transparent font-Quicksand font-semibold border-b border-black outline-none focus:outline-none dark:border dark:border-b-accent dark:text-white"
            />
            <button
              type="submit"
              className="w-full bg-[#060606] hover:bg-accent font-Quicksand font-semibold text-white rounded-md py-3 mb-4 dark:border dark:border-accent  "
            >
            {Sinscrire}
            </button>
          </form>
          <div className="w-full text-center mb-4">
            <div className="w-full h-px bg-black"></div>
            <p className="relative inline-block px-2 bg-gray-200 text-sm font-Quicksand font-semibold dark:bg-black dark:text-accent">
              {Ou}
            </p>
          </div>

          <Link to="/login">
            <p className="mt-4 text-sm font-normal dark:text-white font-Quicksand font-semibold ">
              {dejaCompte} ?{" "}
              <span className="font-semibold underline cursor-pointer font-Quicksand font-semibold dark:text-white">
              {Connectezvous}
              </span>
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
