import type { AxiosInstance } from "axios";
import CryptoJS from "crypto-js";

// 与后端一致的密钥和偏移量
const AES_KEY = CryptoJS.enc.Utf8.parse("ALLEN67890cdefgh");
const AES_IV = CryptoJS.enc.Utf8.parse("cdefgh67890ALLEN");

/**
 * AES解密方法（对应后端的加密逻辑）
 * @param {string} encryptedStr 后端返回的加密字符串（Base64格式）
 * @returns {string} 解密后的原始字符串
 */
export function aesDecrypt(encryptedStr) {
  try {
    // 1. Base64解码（后端加密后转了Base64，前端需先解码）
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedStr);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedData,
    });

    // 2. AES解密（模式、填充方式与后端一致）
    const decrypted = CryptoJS.AES.decrypt(cipherParams, AES_KEY, {
      iv: AES_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7, // 对应后端的PKCS5Padding（Java的PKCS5=JS的PKCS7）
    });

    // 3. 转UTF8字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  catch (error) {
    console.error("AES解密失败：", error);
    throw new Error("数据解密失败，请重试");
    // return null;
  }
}

// 响应数据解密
export function responseDecodeData(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => {
      const code = response.status;
      if ((code >= 200 && code < 300) || code === 304) {
        const data = response.data;
        const resultData = data?.resultData;
        if (resultData && typeof resultData === "string") {
          const decryptedData = aesDecrypt(resultData);
          response.data.resultData = JSON.parse(decryptedData);
        }
      }
      return response;
    },
    error => Promise.reject(error),
  );
}
