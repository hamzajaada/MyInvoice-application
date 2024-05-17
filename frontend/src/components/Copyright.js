import React, { useEffect, useState } from "react";
import { copyright } from "../data";
import tr from "Services/tr";
import Cookies from "js-cookie";

const Copyright = () => {
  const [translatedLink1, setTranslatedLink1] = useState(copyright.link1.name);
  const [translatedCopyText, setTranslatedCopyText] = useState(copyright.copyText);

  const translateText = async () => {
    const langto = Cookies.get("to");
    if (langto && langto !== "fra") {
      setTranslatedLink1(await tr(copyright.link1.name, "fra", langto));
      setTranslatedCopyText(await tr(copyright.copyText, "fra", langto));
    }
  };

  useEffect(() => {
    translateText();
  }, []);

  const { link1, link2, social } = copyright;
  return (
    <div
      className="dark:bg-black flex flex-col items-center gap-y-2 lg:flex-row lg:justify-between"
      data-aos="fade-up"
      data-aos-offset="0"
      data-aos-delay="200"
    >
      {/* links */}
      <div className="flex gap-x-6">
        <a
          className="hover:text-accent transition font-Quicksand font-medium dark:text-white"
          href={link1.href}
        >
          {translatedLink1}
        </a>
      </div>
      {/* copyright text */}
      <div className="font-Quicksand font-medium dark:text-white">
        {translatedCopyText}
      </div>
      {/* social icons */}
      <ul className="flex gap-x-[12px]">
        {social.map((item, index) => {
          const { href, icon } = item;
          return (
            <li key={index}>
              <a href={href}>
                <img src={icon} alt="" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Copyright;
