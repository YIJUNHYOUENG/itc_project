import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

export function encrypt(values) {
  const MI_CRYPT_KEY = "YOUR_PUBLIC_KEY";
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(MI_CRYPT_KEY);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(values), "YOUR_SECRET_KEY");
  return encrypted.toString();
}

export function decrypt(encryptedData) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, "YOUR_SECRET_KEY");
    return decrypted.toString(CryptoJS.enc.Utf8);
}