/* eslint-disable no-console */
import { syncScrypt } from 'scrypt-js';
import {
  arrayBufferToBase64,
  arrayBufferToText,
  base64StringToArrayBuffer,
  textToArrayBuffer,
} from 'util/helper';

const N = 1024;
const r = 8;
const p = 1;
const dkLen = 32;

const ALGORITHM = 'AES-GCM';
const SHA = 'SHA-256';

export const encryptDataWithPasswordWithScrypt = async (
  password: string,
  data: string,
  salt: Uint8Array,
  iv: Uint8Array
): Promise<string> => {
  try {
    const dataBuffer = textToArrayBuffer(data);
    const passwordBuffer = textToArrayBuffer(password) as Uint8Array;
    console.log('old salt');
    console.log(salt);
    const scryptKeyString = syncScrypt(passwordBuffer, salt, N, r, p, dkLen);
    const key = await crypto.subtle.importKey(
      'raw',
      scryptKeyString,
      {
        name: ALGORITHM,
      },
      true,
      ['encrypt', 'decrypt']
    );
    const cipherData = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      dataBuffer
    );
    return arrayBufferToBase64(cipherData);
  } catch (e) {
    console.log(`Error occur while encryting data ${e}`);
  }
  return 'error';
};

export const decryptDataWithPasswordWithScrypt = async (
  password: string,
  cipherData: string,
  salt: Uint8Array,
  iv: Uint8Array
): Promise<string> => {
  try {
    const passwordBuffer = textToArrayBuffer(password) as Uint8Array;
    const cipherDataBuffer = base64StringToArrayBuffer(cipherData);
    console.log('cipherDataBuffer');
    console.log(cipherData);
    const scryptKeyString = syncScrypt(passwordBuffer, salt, N, r, p, dkLen);
    const key = await crypto.subtle.importKey(
      'raw',
      scryptKeyString,
      {
        name: ALGORITHM,
      },
      true,
      ['encrypt', 'decrypt']
    );
    console.log('--------------decrypting---------');
    const data = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      cipherDataBuffer
    );
    return arrayBufferToText(data);
  } catch (e) {
    console.log(`Error occur while decrypting data ${e}`);
  }
  return 'error';
};
