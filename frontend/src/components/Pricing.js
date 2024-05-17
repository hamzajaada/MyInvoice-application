import React , { useEffect,  useState } from "react";

import { pricing } from "../data";
import { HiCheck, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useGetThreePacksQuery } from "state/api";
import logoIm from '../assets/img/pricing/icon1.svg'
import tr from "Services/tr";
import Cookies from "js-cookie";
const Pricing = () => {
 
  const [index, setIndex] = useState(0); // Initialize index to 0
  const { title } = pricing;
  const { data } = useGetThreePacksQuery();
  const [translatedData, setTranslatedData] = useState([]);
  const [btnCom, seTbtnComa] = useState("Commencer Maintenant");
  const [year, seTyear] = useState("Année");
  const [voirplus, seTvoirplus] = useState("Voir plus");
  const [Titre, seTtitre] = useState(title);
  useEffect(() => {
    if (data && data.length > 0) {
      setIndex(0);
      translateData();
    }
  }, [data]);
  
  const translateData = async () => {
    const langto = Cookies.get("to");
    if (langto !== "fra" && langto) {
      seTbtnComa(await tr(btnCom, "fra", langto))
      seTyear(await tr(year, "fra", langto))
      seTtitre(await tr(Titre, "fra", langto))
      seTvoirplus(await tr(voirplus, "fra", langto))
    }
    const translatedItems = await Promise.all(
      data.map(async (item) => {
        let it = { ...item };
        if (langto !== "fra" && langto) {
          it.name = await tr(item.name, "fra", langto);
          // Map over services to translate each service name
          it.services = await Promise.all(item.services.map(async (service) => {
            // Create a deep copy of the service
            let itSer = JSON.parse(JSON.stringify(service));
            // Translate the service name
            itSer.serviceId.ServiceName = await tr(service.serviceId.ServiceName, "fra", langto);
            return itSer;
          }));
          it.description = await tr(item.description, "fra", langto);
        }
        return it;
      })
    );
    console.log(translatedItems);
    setTranslatedData(translatedItems);
  };
  
  


  

  return (
    <section className="dark:bg-black section">
      <div className="container mx-auto">
        {/* title */}
        <h2
          className=" dark:text-white h2 mb-10 lg:mb-20 text-center font-Quicksand font-bold"
          data-aos="fade-up"
          data-aos-offset="200"
        >
          {Titre}
        </h2>
        {/* card */}
        <div className="flex flex-col lg:flex-row lg:gap-x-[30px] gap-y-[30px] lg:gap-y-0 justify-center items-center">
          {translatedData && translatedData.map((pack, packIndex) => {
            const { name, services, price ,logo,desc} = pack;
            //card
            return (
              <div
                key={packIndex}
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-offset="300"
              >
                <div
                  onClick={() => setIndex(packIndex)}
                  className={`${
                    packIndex === index
                      ?  "dark:bg-gray-800 bg-white shadow-2xl"
                      : "border border-gray"
                  } w-[350px] h-[550px] rounded-[12px] p-[40px] cursor-pointer transition-all`}
                >
                  {/* card icon */}
                  <div className="mb-8">
                    <img src={`http://localhost:3001/Images/${logo}`} alt=""  />
                  </div>
                  {/* card title */}
                  <div className="dark:text-white text-[32px] font-Quicksand font-semibold mb-8">
                    {name}
                  </div>
                  {/* card services */}
                  <div className="flex flex-col gap-y-2 mb-6">
                    {services.map((service, index) => {
                      const { serviceId } = service;
                      return (
                        <div
                          className="flex items-center gap-x-[10px]"
                          key={index}
                        >
                          <HiCheck className="text-light" />
                          <div className=" dark:text-white font-Quicksand font-semibold">
                            {serviceId.ServiceName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mb-10">
                    <div>
                      <span className="dark:text-white text-2xl font-Quicksand font-semibold">
                       ${price} 
                      </span>
                      <span className=" dark:text-white text-xl text-light font-Quicksand font-semibold">
                        {" "}
                        /{year}
                      </span>
                    </div>
                    <div className=" dark:text-white text-base text-light">{desc}</div>
                  </div>
                  {/* btn */}
                  <button
                    className={`${
                      packIndex === index
                        ? "bg-accent hover:bg-accentHover text-white"
                        : "border border-accent text-accent"
                    } btn btn-sm space-x-[14px]`}
                  >
                    <span>{btnCom}</span>
                    <HiOutlineArrowNarrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Voir plus */}
        <div className="flex justify-center items-center mt-10"
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-offset="300">
          <a
            href="/pack"
            className="inline-flex  items-center mt-[20px] inline-block bg-accent text-white font-Quicksand font-semibold py-2 px-4 rounded-md hover:bg-accentHover "
          >
            {voirplus} <span className="ml-[10px]"> <HiOutlineArrowNarrowRight /></span> 
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
