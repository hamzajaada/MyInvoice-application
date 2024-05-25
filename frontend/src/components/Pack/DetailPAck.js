import Header from "components/Header";
import Footer from "components/Footer";
import React, { useState, useEffect } from "react";
import imgPay from "../../assets/img/Pack/pay.png";
import { pack } from "../../data";
import {  useGetOnePackQuery } from "state/api";
import { HiCheck, HiOutlineArrowNarrowRight } from "react-icons/hi";
import tr from "Services/tr";
import Cookies from "js-cookie";
import { useNavigate ,useParams } from "react-router-dom";
import img from "../../assets/img/Pack/pay.png";
// les donnes n'affiche pas dans le cas de fr
const Abonement = () => {
  // const [index, setIndex] = useState(1);
  // const [title, setTitle] = useState(pack.Title);
  // const [subtitle, setSubtitle] = useState(pack.Subtitle);
  // const [Nos, setNos] = useState(pack.Nos);
  // const [abonnements, setabonnements] = useState(pack.abonnements);
  // const { data } = useGetAllPacksThreeServiceQuery();
  // const [btnCom, setBtnCom] = useState("Voir les detail de Pack");
  // const [year, setYear] = useState("Année");
  // const [desc, setDesc] = useState("Jusqu'à 3 factures par mois");
  // const [translatedData, setTranslatedData] = useState([]);

  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     setIndex(0);
  //     translateData();
  //   }
  // }, [data]);

  // const translateData = async () => {
  //   const langto = Cookies.get("to");
  //   if (langto !== "fra" && langto) {
  //     setTitle(await tr(title, "fra", langto));
  //     setSubtitle(await tr(subtitle, "fra", langto));
  //     setBtnCom(await tr(btnCom, "fra", langto));
  //     setYear(await tr(year, "fra", langto));
  //     setDesc(await tr(desc, "fra", langto));
  //     setNos(await tr(Nos, "fra", langto));
  //     setabonnements(await tr(abonnements, "fra", langto));
  //   }
  //   const translatedItems = await Promise.all(
  //     data.map(async (item) => {
  //       let it = { ...item };
  //       if (langto !== "fra" && langto) {
  //         it.name = await tr(item.name, "fra", langto);
  //         // Map over services to translate each service name
  //         it.services = await Promise.all(
  //           item.services.map(async (service) => {
  //             // Create a deep copy of the service
  //             let itSer = JSON.parse(JSON.stringify(service));
  //             // Translate the service name
  //             itSer.serviceId.ServiceName = await tr(
  //               service.serviceId.ServiceName,
  //               "fra",
  //               langto
  //             );
  //             return itSer;
  //           })
  //         );
  //         it.description = await tr(item.description, "fra", langto);
  //       }
  //       return it;
  //     })
  //   );
  //   console.log(translatedItems);
  //   setTranslatedData(translatedItems);
  // };
  // Navigation :
  const navigate = useNavigate();
  const id_user = localStorage.getItem("userId");
  const username = localStorage.getItem("userName");
  function handelPack() {
    const redirectPath = id_user ? `/${username}/add-demande` : "/login";
    navigate(redirectPath);
  }
  const { id } = useParams();
  const { data  } = useGetOnePackQuery(id);
  console.log(data);
  

  return (
    <>
      <Header />

      <div className=" grid  lg:grid-cols-2 w-full mb-50 h-auto dark:bg-black  mt-24 py-10 ">
        {/* image */}
        <div className=" mb-5 lg:mb-0 dark:bg-black my-auto mx-auto ">
          <img src={img} alt="" className="w-96  h-96" />
        </div>
        {/* text */}
        <div className="  dark:bg-black my-auto  ">
          <div>
            <p className=" dark:text-white  text-[25px] px-6 lg:px-0 font-Quicksand font-bold text-center">
              Faciliter l'établissement des factures Commencez gratuitement,
              puis choisissez le meilleur plan pour votre entreprise
            </p>
          </div>
        </div>
      </div>
      <div className="px-5  py-6  w-auto dark:bg-black">
        <p className="text-[35px] font-Quicksand font-bold text-center dark:text-white">
          Detail de {data && data.name}  :
        </p>
        <div className="w-[150px] h-[5px] lg:ml-[520Px] ml-[53px] my-5 bg-accent mb-[20px] lg:mt-[20px] lg:mb-[50px]"></div>
        <p className="text-[25px] font-Quicksand font-bold dark:text-white text-center">
          Services :
        </p>
        {data && data.services.map((service, serviceIndex) => (
                      <div  key={serviceIndex} className="flex   lg:ml-0 justify-center items-center mt-3">
                       <div className="px-3 flex items-center">
                         <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                         <p className="ml-3 font-Quicksand  dark:text-white">
                          {service.serviceId.ServiceName}
                         </p>
                       </div>
                     </div> 
                      ))}
        
       
      
        <p className="text-[25px] font-Quicksand my-6 dark:text-white font-bold text-center">
          Prix :
        </p>
        <p className="ml-3 font-Quicksand font-semibold dark:text-white text-center">
         {data && data.price} <span className="text-accent dark:text-accent">$/mois</span>
        </p>
        <div className="flex justify-center mt-5">
          <button className="bg-accent  font-Quicksand font-bold uppercase rounded-[5px]  w-72 h-10 hover:bg-accentHover text-white"
          onClick={handelPack}
          >
            <span>Commencer Maintenant</span>
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Abonement;
