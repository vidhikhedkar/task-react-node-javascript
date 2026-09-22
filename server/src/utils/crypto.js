const CryptoJS = require("crypto-js");

const FRONTEND_SECRET_KEY = process.env.FRONTEND_SECRET_KEY;
const BACKEND_SECRET_KEY = process.env.BACKEND_SECRET_KEY;

if (!FRONTEND_SECRET_KEY) {
  throw new Error("FRONTEND_SECRET_KEY is missing in server .env");
}

if (!BACKEND_SECRET_KEY) {
  throw new Error("BACKEND_SECRET_KEY is missing in server .env");
}

// Layer 1
const encryptFrontend = (data) => {
  if (data === undefined || data === null) return "";

  return CryptoJS.AES.encrypt(
    String(data),
    FRONTEND_SECRET_KEY
  ).toString();
};

const decryptFrontend = (ciphertext) => {
  if (!ciphertext) return "";

  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    FRONTEND_SECRET_KEY
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};

// Layer 2
const encryptBackend = (data) => {
  if (data === undefined || data === null) return "";

  return CryptoJS.AES.encrypt(
    String(data),
    BACKEND_SECRET_KEY
  ).toString();
};

const decryptBackend = (ciphertext) => {
  if (!ciphertext) return "";

  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    BACKEND_SECRET_KEY
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptFrontend,
  decryptFrontend,
  encryptBackend,
  decryptBackend,
};