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

function encryptShell(content: string) {
  let aseKey = "ws9ybUMn4F81t5oPKqJrqLKxERaYAS12";
  return CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
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
  encodeShell: encryptShell,
  decode: decrypt
};
