// import images
import LogoImg from '../src/assets/img/header/lgrm.png';
import HeroImg from '../src/assets/img/hero/VM.png';
// import OverviewProductImg from '../src/assets/img/overview/product.svg';
import OverviewProductImg1 from '../src/assets/img/overview/screenA.PNG';
import OverviewProductImg2 from '../src/assets/img/overview/screenB.PNG';
import FacebookImg from '../src/assets/img/overview/brands/facebook.svg';
import GoogleImg from '../src/assets/img/overview/brands/google.svg';
import CocaColaImg from '../src/assets/img/overview/brands/coca-cola.svg';
import LinkedInImg from '../src/assets/img/overview/brands/linkedin.svg';
import SamsungImg from '../src/assets/img/overview/brands/samsung.svg';
import Feature1Img from '../src/assets/img/features/img1.jpg';
import Feature2Img from '../src/assets/img/features/img2.webp';
import Feature3Img from '../src/assets/img/features/imgg3.webp';
import Feature4Img from '../src/assets/img/features/img4.webp';
import ArrowRightImg from '../src/assets/img/features/arrow-right.svg';
import CardIconImg1 from '../src/assets/img/product/cards/temps.webp';
import CardIconImg2 from '../src/assets/img/product/cards/dolars.webp';
import CardIconImg3 from "../src/assets/img/product/cards/l'aspt.webp";
import PricingIcon1 from '../src/assets/img/pricing/icon1.svg';
import PricingIcon2 from '../src/assets/img/pricing/icon2.svg';
import PricingIcon3 from '../src/assets/img/pricing/icon3.svg';
import AvatarImg1 from '../src/assets/img/testimonial/avatar1.png';
import AvatarImg2 from '../src/assets/img/testimonial/avatar2.png';
import AvatarImg3 from '../src/assets/img/testimonial/avatar3.png';
import AvatarImg4 from '../src/assets/img/testimonial/avatar4.png';
import AvatarImg5 from '../src/assets/img/testimonial/avatar5.png';
import CtaImg1 from '../src/assets/img/cta/app.png';
import CtaImg2 from '../src/assets/img/cta/image2.svg';
import FacebookIcon from '../src/assets/img/copyright/facebook.svg';
import TwitterIcon from '../src/assets/img/copyright/twitter.svg';
import LinkedinIcon from '../src/assets/img/copyright/linkedin.svg';
import backgroundImage from '../src/assets/img/overview/inv.png';
import ic1 from "../src/assets/img/Modeles/Ic1.png";
import ic2 from "../src/assets/img/Modeles/freelance.webp";
import ic3 from "../src/assets/img/Modeles/printable.webp";
import ic4 from "../src/assets/img/Modeles/graphic.webp";
import ic5 from "../src/assets/img/Modeles/photography.webp";
import ic6 from "../src/assets/img/Modeles/contractor.webp";
import creer from "../src/assets/img/Generator/create.png";
import send from "../src/assets/img/Generator/send.png";
import collecter from "../src/assets/img/Generator/collect.png";
import ImgGenerator from "../src/assets/img/Generator/rm.png";
import F1 from "../src/assets/img/Generator/pink.png";
import { HiOutlineChevronRight } from "react-icons/hi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useGetMessageAccepterQuery } from 'state/api';
import { useState, useEffect } from 'react';
export const header = {
  logo: LogoImg,
  IconeHome: <FontAwesomeIcon icon={faHouse} />,
  btnText: 'Connexion',
  btnTextDec: 'Déconnexion',
  IconSun : <FontAwesomeIcon icon={faSun} />,
  IconMon :<FontAwesomeIcon icon={faMoon} />,
};

export const Mobilnav = [
  { name: 'Accueil', href: '/' },
  { name: 'Tarification', href: '/pack' },
  { name: 'À propos de', href: '/Apropos' },
  { name: 'Modèles', href: '/Modeles' },
  { name: 'Générateur en ligne', href: '/Gener' },
  { name: 'Connexion', href: '/login' },
];
export const nav = [
  { name: 'Accueil', href: '/' },
  { name: 'Tarification', href: '/pack' },
  { name: 'À propos de', href: '/Apropos' },
  { name: 'Modèles', href: '/Modeles' },
  { name: 'Générateur en ligne', href: '/Gener' },
  
];
export const hero = {
  title: 'Une façon simple de gérer votre facturation.',
  subtitle: 'Facturez vos clients en toute simplicité, où que vous soyez, depuis votre téléphone ou votre ordinateur portable.',
  btnText: 'Créer une facture maintenant',
  compText: '— Web, iOS and Android',
  image: HeroImg,
};

export const overview = {
  productImgDark: OverviewProductImg1,
  productImgSombre: OverviewProductImg2,
  brands: [
    {
      image: FacebookImg,
      delay: 300,
    },
    {
      image: GoogleImg,
      delay: 400,
    },
    {
      image: CocaColaImg,
      delay: 500,
    },
    {
      image: LinkedInImg,
      delay: 600,
    },
    {
      image: SamsungImg,
      delay: 700,
    },
    
  ],
};

export const features = {
  feature1: {
    pretitle: 'Facturation Instantanée',
    title: 'Modèles de factures professionnelles',
    subtitle:
      "Vous souhaitez envoyer une facture dès maintenant ? Utilisez notre générateur de factures en ligne ou l'un de nos modèles de factures téléchargeables, imprimables et entièrement personnalisables !",
    btnLink: 'VOIR LES MODÈLES DE FACTURES',
    btnIcon: ArrowRightImg,
    image: Feature1Img,
  },
  feature2: {
    pretitle: 'Facturation sans interruption',
    title: 'Générateur de factures en ligne',
    subtitle:
      "Utilisez notre générateur de factures pour gérer votre facturation depuis n'importe quel appareil, à tout moment. Votre compte est toujours connecté et vos données sont sauvegardées en toute sécurité pour vous.",
    btnLink: 'UTILISER LE GÉNÉRATEUR DE FACTURES',
    btnIcon: ArrowRightImg,
    image: Feature2Img,
  },
  feature3: {
    pretitle: 'Estimation Instantanée',
    title: "Modèles d'estimation faciles à utiliser",
    subtitle:
      "Envoyez immédiatement des devis pour obtenir de nouveaux emplois. Convertissez ces devis en factures d'une simple pression sur un bouton.",
    btnLink: 'VOIR LES MODÈLES DE DEVIS MAINTENANT',
    btnIcon: ArrowRightImg,
    image: Feature3Img,
  },
  feature4: {
    pretitle: 'SimpliGestion',
    title: "Suivi des dépenses de l'entreprise",
    subtitle:
      "Le suivi des dépenses n'a jamais été aussi simple. Notre outil de suivi des dépenses et des reçus vous permet de scanner n'importe quel reçu et de saisir automatiquement les informations clés. Toutes les données relatives à vos dépenses sont prêtes à être exportées dans un rapport récapitulatif chaque fois que vous en avez besoin.",
    btnLink: 'UTILISER BUSINESS EXPENSE TRACKER MAINTENANT',
    btnIcon: ArrowRightImg,
    image: Feature4Img,
  },
};

export const product = {
  title: 'Pourquoi MY INVOICE ? ',
  subtitle:
    "Un logiciel complet, puissant et intégré à tous vos outils métiers , MY INVOICE rassemble tous les outils et toutes les intégrations nécessaires pour gérer l’ensemble de vos dépenses, votre facturation, votre trésorerie ainsi que votre comptabilité.",
  cards: [
    {
      icon: CardIconImg1,
      title: 'Gagner du temps',
      subtitle: 'Facturation mobile et efficace instantanée.',
      delay: 200,
    },
    {
      icon: CardIconImg2,
      title: 'Obtenir un paiement',
      subtitle: 'Facturation par email, SMS, suivi paiement.',
      delay: 400,
    },
    {
      icon: CardIconImg3,
      title: "L'aspect professionnel",
      subtitle: "Modèle facture personnalisable, pro, organisé.",
      delay: 600,
    },
  ],
};

export const pricing = {
  title: "Faciliter l'établissement des factures",
  // cards: [
  //   {
  //     icon: PricingIcon1,
  //     title: "L'ESSENTIEL",
  //     services: [
  //       { name: "Automatisation des données." },
  //       { name: 'Paiements en ligne' },
  //       { name: 'Reçus de lecture en temps réel' },
        
  //     ],
  //     price: '$9.99',
  //     year : 'Annee',
  //     userAmount: "Jusqu'à 3 factures par mois",
  //     btnText: 'COMMENCER MAINTENANT',
  //     delay: 300,
  //   },
  //   {
  //     icon: PricingIcon2,
  //     title: 'PLUS',
  //     services: [
  //       { name: 'Ajouter des photos' },
  //       { name: "Propriétaire signe." },
  //       { name: "Rapports de synthèse" },
       
        
  //     ],
  //     price: '$13.99',
  //     year : 'Annee',
  //     userAmount: "Jusqu'à 10 factures par mois",
  //     btnText: 'COMMENCER MAINTENANT',
  //     delay: 600,
  //   },
  //   {
  //     icon: PricingIcon3,
  //     title: 'PRIME',
  //     services: [
  //       { name: 'Réactivité clientèle primordiale' },
  //       { name: 'Signatures des clients' },
  //       { name: 'Modèles Premium' },
     
  //     ],
  //     price: '$29.99',
  //     year : 'Annee',
  //     userAmount: 'up to 3 user + 1.99 per user',
  //     btnText: 'COMMENCER MAINTENANT',
  //     delay: 900,
  //   },
  // ],
};

// export const testimonials = {
//   title: 'De quoi les gens parlent.',
//   clients: [
//     {
//       message:
//        "Je suis simplement RAVI de mon expérience MYINVOICE. Je crois que c'est une des applis les plus ergonomiques et agréables à utiliser que j'ai jamais vu.",
//       image: AvatarImg1,
//       name: 'Cameron Williamson',
//       position: 'CEO',
//       borderColor: '#FF7235',
//     },
//     {
//       message:
//         "Très fonctionnel et pratique service client au top.Je recommande !",
//       image: AvatarImg2,
//       name: 'Shirley Hand',
//       position: 'CEO',
//       borderColor: '#FFBE21',
//     },
//     {
//       message:
//         "Un logiciel juste parfait !!!! Après en avoir essayé plusieurs, il est vraiment simple d'utilisation, complet et efficace.... Je le recommande.",
//       image: AvatarImg3,
//       name: 'Dr. Olivia Hansen',
//       position: 'CEO',
//       borderColor: '#4756DF',
//     },
//     {
//       message: "En tant que CEO, j'apprécie la simplicité et l'efficacité de MYINVOICE. Cela me permet de me concentrer sur des aspects plus stratégiques de mon entreprise.",
//       image: AvatarImg4,
//       name: 'Alexandre Dupont',
//       position: 'CEO',
//       borderColor: '#FF9800',
//     },
//     {
//       message: "MYINVOICE a été un ajout précieux à notre suite d'outils de gestion. En tant que CEO, je suis impressionné par son impact positif sur notre efficacité opérationnelle.",
//       image: AvatarImg5,
//       name: 'Isabelle Martin',
//       position: 'CEO',
//       borderColor: '#795548',
//     },
//     {
//       message: "La convivialité de MYINVOICE est incomparable. En tant que CEO, je valorise les outils qui simplifient nos processus et permettent à mon équipe de se concentrer sur l'essentiel.",
//       image: AvatarImg1,
//       name: 'Jean-Luc Moreau',
//       position: 'CEO',
//       borderColor: '#FFC107',
//     },
//     {
//       message: "Je suis constamment impressionné par les mises à jour et les améliorations continues de MYINVOICE. En tant que CEO, je suis confiant dans notre choix de cette application.",
//       image: AvatarImg3,
//       name: 'Sophie Durand',
//       position: 'CEO',
//       borderColor: '#03A9F4',
//     },
//     {
//       message: "MYINVOICE a vraiment dépassé nos attentes en tant que solution de facturation. En tant que CEO, je suis ravi de l'impact positif qu'il a eu sur notre entreprise.",
//       image: AvatarImg5,
//       name: 'Martin Leclerc',
//       position: 'CEO',
//       borderColor: '#4CAF50',
//     }
    
//   ],
// };

export const TestimonialsData = () => {

  const { data: messagesData } = useGetMessageAccepterQuery();

  const [testimonialsData, setTestimonialsData] = useState({ title: 'De quoi les gens parlent.', clients: [] });
  useEffect(() => {
    if (messagesData) {
      console.log(messagesData)
      const clients = messagesData.map(message => {
        return {
          message: message.message,
          image: message.enterpriseLogo,
          name: message.enterpriseName,
          position: 'CEO',
          borderColor: '#' + Math.floor(Math.random()*16777215).toString(16),
        };
      });
      setTestimonialsData(prevData => ({ ...prevData, clients }));
    }
    console.log(testimonialsData);
  }, [messagesData]);
  return testimonialsData;
};

export const cta = {
  title: 'Commencez gratuitement',
  subtitle: "Envoyez votre première facture dès maintenant (c'est gratuit !)",
  btnText: 'COMMENCER',
  img1: CtaImg1,
  img2: CtaImg2,
};
export const GeneratorData ={
    imageDark: backgroundImage,
    title: "Modèles de factures à usage spécifique",};
export const footer = {
  logo: LogoImg,
  lien :"Links",
  legale : "Legal",
  links: [

    { name: 'Accueil', href: '/' },
    { name: 'Tarification', href: '/pack' },
    { name: 'À propos de', href: '/Apropos' },
    { name: 'Modèles', href: '/Modeles' },
    { name: 'Générateur en ligne', href: '/Gener' },
  ],
  legal: [
    { name: 'Accueil', href: '/' },
    { name: 'Tarification', href: '/pack' },
    { name: 'À propos de', href: '/Apropos' },
    { name: 'Modèles', href: '/Modeles' },
    { name: 'Générateur en ligne', href: '/Gener' },
  ],
  newsletter: {
    title: "Plus de 5 ans d'expérience",
    subtitle: 'Envoyez un message',
  },
  form: {
    placeholder: 'Envoyez votre message',
    btnText: 'Envoyer',
    smallText: 'We don’t sell your email and spam',
  },
};

export const copyright = {
  link1: {
    name: 'Privacy & Terms',
    href: '/',
  },
  link2: {
    name: 'Contact us',
    href: '/',
  },
  copyText: 'Copyright @ 2024 hamzajaada',
  social: [
    { icon: FacebookIcon, href: '/' },
    { icon: TwitterIcon, href: '/' },
    { icon: LinkedinIcon, href: '/' },
  ],
};
export const modelData = [
  {
    imageDark: backgroundImage,
    title: "Modèles de factures à usage spécifique",
    subtitle : " Vous cherchez le bon modèle de facture ? Téléchargez l'un de nos modèles de facture gratuits et faciles à utiliser pour commencer. Si vous avez besoin d'une facture plus personnalisée pour votre entreprise, consultez notre générateur de factures en ligne pour créer facilement des factures professionnelles personnalisées.",
   
  },
];
export const generatorData = {
  headerText: "Générateur de factures en ligne",
  headerDescription:
    "Utilisez notre générateur de factures pour gérer votre facturation depuis n'importe quel appareil, à tout moment. Votre compte est toujours connecté et vos données sont sauvegardées en toute sécurité.",
  createButtonText: "Créer une facture maintenant",
  createButtonIcon: HiOutlineChevronRight,
  imgGenerator: ImgGenerator,
  f1Img: F1,
  sectitle : "Qu'est-ce que le générateur de factures en ligne ?",
  sectext :"Contrairement aux modèles préétablis, vous pouvez personnaliser les factures en fonction de votre activité. Vous manquez de temps ? Créez votre première facture et vos données seront stockées en toute sécurité et remplies automatiquement pour les projets futurs. Vous travaillez en déplacement ? C'est aussi le cas. Utilisez votre appareil mobile pour créer et partager des factures.",
  howItWorksTitle: "Comment ça marche",
  howItWorksDescription:
    "Le générateur de factures en ligne rend la facturation aussi simple que 1, 2, 3.",
  steps: [
    {
      image: creer,
      title: "Créer",
      description:
        "Ajoutez les informations sur votre entreprise, votre logo et les coordonnées de vos clients, puis complétez les rubriques et les prix. Nous stockerons ces informations en toute sécurité pour une facturation rapide et répétée.",
    },
    {
      image: send,
      title: "Envoyer",
      description:
        "La livraison est facile. Envoyez un PDF par courriel, partagez le lien de la facture ou imprimez une copie. Nos factures sont formatées de manière à avoir une belle apparence, quelle que soit la manière dont elles sont envoyées.",
    },
    {
      image: collecter,
      title: "Collecter",
      description:
        "Nous vous informons lorsque votre facture est consultée. Si ce n'est pas le cas, nous le rappellerons poliment à votre client. Inscrivez-vous au service Paiements et nous traiterons également le paiement.",
    },
  ],
};
export const pack = {
  Title: "Faciliter l'établissement des factures",
  Subtitle: 'Commencez gratuitement, puis choisissez le meilleur plan pour votre entreprise',
  Nos : "Nos",
  abonnements : "abonnements",
};