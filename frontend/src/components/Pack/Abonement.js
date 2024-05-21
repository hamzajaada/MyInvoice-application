import Header from "components/Header";
import Footer from "components/Footer";
import React, { useState, useEffect } from "react";
import imgPay from "../../assets/img/Pack/pay.png";
import { pack } from "../../data";
import { useGetAllPacksThreeServiceQuery } from "state/api";
import { HiCheck, HiOutlineArrowNarrowRight } from "react-icons/hi";
import tr from "Services/tr";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
// les donnes n'affiche pas dans le cas de fr
const Abonement = () => {
  const [index, setIndex] = useState(1);
  const [title, setTitle] = useState(pack.Title);
  const [subtitle, setSubtitle] = useState(pack.Subtitle);
  const [Nos, setNos] = useState(pack.Nos);
  const [abonnements, setabonnements] = useState(pack.abonnements);
  const { data } = useGetAllPacksThreeServiceQuery();
  const [btnCom, setBtnCom] = useState("Commencer Maintenant");
  const [year, setYear] = useState("Année");
  const [desc, setDesc] = useState("Jusqu'à 3 factures par mois");
  const [translatedData, setTranslatedData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setIndex(0);
      translateData();
    }
  }, [data]);
  
  const translateData = async () => {
    const langto = Cookies.get("to");
    if (langto !== "fra" && langto) {
      setTitle(await tr(title, "fra", langto))
      setSubtitle(await tr(subtitle, "fra", langto))
      setBtnCom(await tr(btnCom, "fra", langto))
      setYear(await tr(year, "fra", langto))
      setDesc(await tr(desc, "fra", langto))
      setNos(await tr(Nos, "fra", langto))
      setabonnements(await tr(abonnements, "fra", langto))
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
   // Navigation :
   const navigate = useNavigate();
   const id = localStorage.getItem("userId")
   const username = localStorage.getItem("userName")
   function handelPack() {
 
     const redirectPath = id ? `${username}/add-demande` : "/login";
     navigate(redirectPath);
     
   } 

  return (
    <>
      <Header />
      <div className="dark:bg-black lg:flex justify-between lg:mt-[90px]">
        <div
          className="lg:w-[50%] w-[100%] pt-[100px]"
         
        >
          <h1 className="dark:text-white text-3xl font-Quicksand font-bold text-center">
            {title}
          </h1>
          <p className="dark:text-white text-center font-Quicksand font-medium">
            {subtitle}
          </p>
        </div>
        <div
          className="lg:w-[50%] w-[100%] flex justify-center items-center"
          
        >
          <img
            src={imgPay}
            className="lg:w-[50%] w-[100%] rounded-xl mt-[10px]"
            alt="Payment"
          />
        </div>
      </div>
      <div className="dark:bg-black pt-[20px]">
        <h1
          className="mb-[20px] text-3xl font-Quicksand font-bold text-center dark:text-white"
         
        >
          {Nos} <span className="text-accent">{abonnements}</span>
        </h1>
        <div className="dark:bg-black flex flex-wrap justify-center lg:justify-evenly gap-y-[30px] lg:gap-y-[30px] lg:gap-x-[40px] lg:w-full items-center">
          {translatedData.length > 0 &&
            translatedData.map((pack, packIndex) => {
              const { name, services, price, logo } = pack;
              return (
                <div
                  key={packIndex}
                  
                >
                  <div
                    onClick={() => setIndex(packIndex)}
                    className={`${
                      packIndex === index
                        ? "dark:bg-slate-800 bg-white shadow-2xl"
                        : "border border-gray"
                    } w-[350px] h-[550px] rounded-[12px] p-[40px] cursor-pointer transition-all`}
                  >
                    <div className="mb-8">
                      <img src={`http://localhost:3001/Images/${logo}`} alt={name} />
                    </div>
                    <div className="dark:text-white text-[32px] font-Quicksand font-semibold mb-8">
                      {name}
                    </div>
                    <div className="flex flex-col gap-y-2 mb-6">
                      {services.map((service, serviceIndex) => {
                        const { serviceId } = service;
                        return (
                          <div
                            className="flex items-center gap-x-[10px]"
                            key={serviceIndex}
                          >
                            <HiCheck className="text-light" />
                            <div className="dark:text-white font-Quicksand font-semibold">
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
                        <span className="dark:text-white text-xl text-light font-Quicksand font-semibold">
                          {" "}
                          /{year}
                        </span>
                      </div>
                      <div className="dark:text-white text-base text-light">
                        {desc}
                      </div>
                    </div>
                    <button
                      className={`${
                        packIndex === index
                          ? "bg-accent hover:bg-accentHover text-white"
                          : "border border-accent text-accent"
                      } btn btn-sm space-x-[14px]`}
                      onClick={handelPack}
                    >
                      <span>{btnCom}</span>
                      <HiOutlineArrowNarrowRight />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Abonement;
