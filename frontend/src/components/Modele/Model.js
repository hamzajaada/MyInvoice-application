import React, { useEffect, useState } from "react";
import { modelData } from "../../data";
import Header from "components/Header";
import Footer from "components/Footer";
import { useGetAllModelsQuery } from "state/api";
import tr from "Services/tr";
import Cookies from "js-cookie";

const Model = () => {
  const [translatedTitle, setTranslatedTitle] = useState("");
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
      const translatedSections = await Promise.all(
        data.map(async (section) => ({
          ...section,
          name: await tr(section.name, "fra", langto),
          description: await tr(section.description, "fra", langto),
        }))
      );
      setTranslatedTitle(translatedTitle);
      setTranslatedSections(translatedSections);
    } else {
      setTranslatedTitle(modelData[0].title);
      setTranslatedSections(data);
    }
  };

  return (
    <>
      <Header />
      <div className="dark:bg-black lg:flex justify-evenly mt-[90px]">
        <div className="pt-[100px] lg:ml-[140px]">
          <h1 className="dark:text-white mb-[20px] text-4xl font-Quicksand font-bold text-center">
            {translatedTitle}
          </h1>
        </div>
        <div>
          <img
            src={modelData[0].imageDark}
            alt=""
            className="ml-[160px] lg:ml-[0px] w-[50%] lg:w-[25%] lg:mb-[50px] lg:ml-[500px]"
          />
        </div>
      </div>
      <div className="flex bg-slate-100 dark:bg-black flex-wrap justify-evenly w-full h-full pb-[40px]">
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
