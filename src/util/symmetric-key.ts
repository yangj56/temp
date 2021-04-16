/* eslint-disable no-console */
import {
  arrayBufferToBase64,
  arrayBufferToText,
  base64StringToArrayBuffer,
} from 'util/helper';

const ALGORITHM = 'AES-GCM';

export const generateSymKeyPair = async (): Promise<CryptoKey> => {
  try {
    return await window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (err) {
    console.log(`Error occur while generating sym key ${err}`);
    throw err;
  }
};

export const exportSymmtricKey = async (key: CryptoKey): Promise<string> => {
  try {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    const exportedKeyBuffer = new Uint8Array(exported);
    return Buffer.from(exportedKeyBuffer).toString('base64');
  } catch (err) {
    console.log(`Error occur while exporting sym key ${err}`);
    throw err;
  }
};

export const importSymmtricKey = async (
  keyString: string
): Promise<CryptoKey> => {
  try {
    const myBuffer = Buffer.from(keyString, 'base64');
    return await window.crypto.subtle.importKey(
      'raw',
      myBuffer,
      ALGORITHM,
      true,
      ['encrypt', 'decrypt']
    );
  } catch (err) {
    console.log(`Error occur while exporting sym key ${err}`);
    throw err;
  }
};

export const encryptWithSymmetricKey = async (
  key: CryptoKey,
  data: ArrayBuffer,
  iv: Uint8Array
): Promise<string> => {
  try {
    // The iv must never be reused with a given key.
    const cipherData = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      data
    );
    return arrayBufferToBase64(cipherData);
  } catch (err) {
    console.log(`Error occur while encrypting with sym key ${err}`);
    throw err;
  }
};

export const decryptWithSymmetricKey = async (
  key: CryptoKey,
  cipherData: ArrayBuffer,
  iv: Uint8Array
): Promise<ArrayBuffer> => {
  try {
    // const cipherDataBuffer = base64StringToArrayBuffer(cipherData);
    return await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      cipherData
    );
  } catch (err) {
    console.log(`Error occur while encrypting with sym key ${err}`);
    throw err;
  }
};
