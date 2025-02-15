import CryptoJS from "crypto-js";

function encrypt(word: string, keyStr: string) {
  keyStr = keyStr ? keyStr : "Welcome Superred";
  const key = CryptoJS.enc.Latin1.parse(keyStr);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return encrypted.toString();
}

function decrypt(word: string, keyStr: string) {
  keyStr = keyStr ? keyStr : "Welcome Superred";
  const key = CryptoJS.enc.Latin1.parse(keyStr);
  const decrypted = CryptoJS.AES.decrypt(word, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return CryptoJS.enc.Utf8.stringify(decrypted).toString();
}

export default {
  encode: encrypt,
  decode: decrypt
};
