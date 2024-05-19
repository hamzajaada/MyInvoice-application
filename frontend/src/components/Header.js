import React, { useEffect, useState } from "react";
import { header } from "../data";
import { HiMenuAlt4, HiOutlineX } from "react-icons/hi";
import MobileNav from "../components/MobileNav";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetOneEntrepriseQuery } from "state/api";
import tr from "Services/tr";
import Cookies from "js-cookie";
import { nav } from "../data";
const Header = () => {
  const navigate = useNavigate();
  const { data: entreprise } = useGetOneEntrepriseQuery(
    localStorage.getItem("userId")
  );
  const handleLoginClick = () => {
    // Redirige vers la page de connexion lorsque le bouton est cliqué
    navigate("/Login");
  };
  const [mobileNav, setMobileNav] = useState(false);
  const [isActive, setisActive] = useState(false);
  const { logo, IconSun, IconMon, IconeHome } = header;
  const userName = localStorage.getItem("userName");

  //scrool event
  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 60 ? setisActive(true) : setisActive(false);
    };

    // Écoute le défilement de la fenêtre
    window.addEventListener("scroll", handleScroll);

    // Nettoie l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.scrollY]); // Ajout de window.scrollY comme dépendance

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");
  };

  // DARK MODE :

  const [theme, setTheme] = useState(localStorage.getItem("currentMode"));

  useEffect(() => {
    const storedTheme = localStorage.getItem("currentMode");
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);
  function toggletheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme); // Mettre à jour l'état theme
    localStorage.setItem("currentMode", newTheme); // Mettre à jour le stockage local
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
  function toggleHome() {
    if (entreprise.role === "admin" && entreprise.status === "active") {
      navigate("/dashboard");
    } else if (entreprise.status === "active") {
      navigate(`/${userName}/dashboardClient`);
    }
  }
  // Translate :
  // une UseState pour changer la valleur de lang de option
  const [lang, setLang] = useState();
  // fonction de changeLanguages : qui prend deux parametre (from , to) pour remplie la cookies
  const changeLanguage = (from, to) => {
    Cookies.set("from", from, { expires: 365 });
    Cookies.set("to", to, { expires: 365 });
  };
  // fonction handleLanguageChange qui change la langage prend en consederation la selectedLanguage (Update Cookies)
  const handleLanguageChange = (e) => {
    window.location.reload();
    const selectedLanguage = e.target.value; // la valeur de l'option
    changeLanguage(lang, selectedLanguage); // Update Cookies
  };

  // useState de  translatedData
  const [translatedData, setTranslatedData] = useState([]);

  const [btnText, setBtntext] = useState(header.btnText);
  const [btnTextDec, setBtntextDec] = useState(header.btnTextDec);
  var trText = "";

  useEffect(() => {
    const lang = Cookies.get("from");
    const langto = Cookies.get("to");
    if (lang) {
      // pour tester la premiere demmarage de notre site
      // remplier les cookies
      changeLanguage(lang, langto);
      setLang(langto);
    } else {
      // segnifier la premiere langagues que je trouve apres le demmarage
      setLang("fra");
    }
    // fonction multiThreads

    const translateData = async () => {
      if (langto != "fra" && langto) {
        trText = await tr(btnText, "fra", langto);
        setBtntext(trText);
        trText = await tr(btnTextDec, "fra", langto);
        setBtntextDec(trText);
      }

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
  }, [lang]);

  return (
    <header
    className={`${
      isActive
        ? "lg:top-0 top-0 bg-white shadow-sm z-10"
        : "lg:top-[0px] top-0 bg-white z-10"
    } py-6 lg:py-4 fixed w-full transition-all dark:bg-black`}
  >
    <div className="container mx-auto flex justify-between items-center">
      <a
        href="#"
        data-aos="fade-down"
        data-aos-delay="200"
        className="font-bodyfont inline-block relative mt-3 md:mt-0"
      >
        <Link to="/" data-aos="fade-down" data-aos-delay="100">
          <img className="w-[100px] md:w-[120px] lg:w-[160px] h-auto" src={logo} alt="Logo" />
        </Link>
      </a>
  
      <div className="hidden lg:flex" data-aos="fade-down" data-aos-delay="100">
        <Nav />
      </div>
  
      <div className="flex items-center gap-x-4 ml-auto">
        <button
          className="text-accent"
          data-aos="fade-down"
          data-aos-delay="100"
          onClick={toggletheme}
        >
          {theme === "dark" ? IconSun : IconMon}
        </button>
        {localStorage.getItem("userId") && (
          <button
            className="text-accent"
            data-aos="fade-down"
            data-aos-delay="100"
            onClick={toggleHome}
          >
            {IconeHome}
          </button>
        )}
        <button className="lg:hidden" onClick={() => setMobileNav(!mobileNav)}>
          {mobileNav ? (
            <HiOutlineX className="text-3xl text-accent" />
          ) : (
            <HiMenuAlt4 className="text-3xl text-accent" />
          )}
        </button>
        {!localStorage.getItem("userId") ? (
          <button
            className="btn btn-sm btn-outline hidden lg:flex"
            data-aos="fade-down"
            data-aos-delay="100"
            onClick={handleLoginClick}
          >
            {btnText}
          </button>
        ) : (
          <button
            className="btn btn-sm btn-outline hidden lg:flex"
            data-aos="fade-down"
            data-aos-delay="100"
            onClick={handleLogout}
          >
            {btnTextDec}
          </button>
        )}
        <select
          onChange={handleLanguageChange}
          value={lang}
          className="border border-accent dark:bg-black bg-white text-accent rounded-md py-2 pl-3 focus:outline-none focus:border-accent font-Quicksand cursor-pointer"
        >
          <option value="eng" className="text-accent hover:bg-accentHover">
            English
          </option>
          <option value="fra" className="text-accent hover:bg-accentHover">
            French
          </option>
          <option value="spa" className="text-accent hover:bg-accentHover">
            Espagnol
          </option>
          <option value="chi" className="text-accent hover:bg-accentHover">
            Chinois
          </option>
          <option value="ara" className="text-accent hover:bg-accentHover">
            العربية
          </option>
        </select>
      </div>
    </div>
  
    <div
      className={`${
        mobileNav ? "left-0" : "-left-full"
      } fixed top-0 bottom-0 w-[60vw] lg:hidden transition-all`}
    >
      <MobileNav />
    </div>
  </header>
  
  );
};

export default Header;
