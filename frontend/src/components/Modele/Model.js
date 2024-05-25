import React, { useEffect, useState } from "react";
import { modelData } from "../../data";
import Header from "components/Header";
import Footer from "components/Footer";
import { useGetAllModelsQuery } from "state/api";
import { HiOutlineChevronRight } from "react-icons/hi";
import tr from "Services/tr";
import Cookies from "js-cookie";

const Model = () => {
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [translatedsubtitle, settranslatedsubtitle] = useState("");
  const [translatedSections, setTranslatedSections] = useState([]);
  const { data } = useGetAllModelsQuery();

  useEffect(() => {
    if (data) {
      translateTexts();
    }
  }, [data]);

  const translateTexts = async () => {
    const langto = Cookies.get("to");
    if (langto && langto !== "fra") {
      const translatedTitle = await tr(modelData[0].title, "fra", langto);
      const translatedsubtitle = await tr(modelData[0].subtitle, "fra", langto);
      const translatedSections = await Promise.all(
        data.map(async (section) => ({
          ...section,
          name: await tr(section.name, "fra", langto),
          description: await tr(section.description, "fra", langto),
        }))
      );
      setTranslatedTitle(translatedTitle);
      settranslatedsubtitle(translatedsubtitle);
      setTranslatedSections(translatedSections);
    } else {
      setTranslatedTitle(modelData[0].title);
      settranslatedsubtitle(modelData[0].subtitle);
      setTranslatedSections(data);
    }
  };
  const id = localStorage.getItem("userId");
  const username = localStorage.getItem("userName");

  return (
    <>
      <Header />
      <div className="dark:bg-black lg:grid grid-cols-2  mt-24 ">
        <div className="lg:mt-14 lg:ml-20 py-6  ">
          <h1 className="dark:text-white mb-[20px] text-4xl font-Quicksand font-bold text-center">
            {translatedTitle}
          </h1>
          <p className="text-[14px] dark:text-white font-semibold font-Quicksand  text-center">
            {translatedsubtitle}
          </p>
          <div className="flex justify-center items-center">
             <a
          //   si il ya id la redirection de href sera a ajouterFacture sinon login  /:userName/ajouterFacture
            href={id ? `/${username}/ajouterFacture` : "/login"}
            className="inline-flex items-center mt-[20px]  bg-accent text-white font-Quicksand font-semibold py-2 px-4 rounded-md hover:bg-accentHover "
          >
            Creer un facture maintenant
            <span className="ml-2"> 
              <HiOutlineChevronRight />
            </span>
          </a>
          </div>
         
        </div>
        <div className="  ml-32 lg:mx-auto lg:my-auto  ">
          <img
            src={modelData[0].imageDark}
            alt=""
            className=" rounded-[5px] block  w-52 "
          />
        </div>
      </div>
      <div className="flex bg-slate-100 dark:bg-black flex-wrap  justify-evenly w-full h-full pb-[40px]">
        {translatedSections && translatedSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="m-[10px] w-[430px] h-[250px] p-[30px]"
          >
            <img
              src={`http://localhost:3001/Images/${section.icon}`}
              alt=""
              className="mb-[20px] w-[14%] ml-[100px]"
            />
            <h1 className="hover:text-accentHover dark:text-white font-Quicksand font-bold">
              {section.name}
            </h1>
            <p className="font-Quicksand font-medium dark:text-white text-sm">
              {section.description}
            </p>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Model;
