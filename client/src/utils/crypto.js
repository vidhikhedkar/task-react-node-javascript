import CryptoJS from 'crypto-js';

const FRONTEND_SECRET_KEY =
  import.meta.env.VITE_FRONTEND_SECRET_KEY;


export const encryptFrontend = (data) => {
  if (!data) return '';

  return CryptoJS.AES.encrypt(
    String(data),
    FRONTEND_SECRET_KEY
  ).toString();
};


export const decryptFrontend = (ciphertext) => {
  if (!ciphertext) return '';

  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    FRONTEND_SECRET_KEY
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};