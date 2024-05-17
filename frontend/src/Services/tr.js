import axios from 'axios';

const tr = async (input, from, to) => { // la fonction tr prend trois parametre : input + from +
    // declaration d'un varaible :
    // Request contient : headers + jsonData
  const headers = {
    'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  };

  const jsonData = {
    'format': 'text', //le type format recu
    'from': from, // languages d'origine (toujours frA)
    'to': to, // langagues a traduire 
    'input': input, // le text a  traduire 
    'options': { // des option important de l'api .
      'sentenceSplitter': true,
      'origin': 'translation.web',
      'contextResults': true,
      'languageDetection': true
    }
  };
   // j'ai utiliser l'api gratuit reverso.net  : https://api.reverso.net/translate/v1/translation
   
  try {
    const response = await axios.post('https://api.reverso.net/translate/v1/translation', jsonData, {
      headers: headers
    // j'ai envoyer les donnes (jsonData + headers ) avec la methode post
    });
    
    return response.data.translation[0]; // Return the translation (translation est un tableau d'un seul element)
  } catch (error) {
    console.error('Error translating text:', error);
    return 'Error translating text';
  }
};

export default tr;