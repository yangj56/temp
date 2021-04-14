import { arrayBufferToText, textToArrayBuffer } from 'util/helper';

const ALGORITHM = 'AES-GCM';

export const generateSymKeyPair = async (): Promise<CryptoKey | null> => {
  try {
    return await window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (e) {
    console.log(`Error occur while generating sym key ${e}`);
  }
  return null;
};

export const exportSymmtricKey = async (
  key: CryptoKey
): Promise<string | null> => {
  try {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    const exportedKeyBuffer = new Uint8Array(exported);
    return Buffer.from(exportedKeyBuffer).toString('base64');
  } catch (e) {
    console.log(`Error occur while exporting sym key ${e}`);
  }
  return null;
};

export const importSymmtricKey = async (
  keyString: string
): Promise<CryptoKey | null> => {
  try {
    const myBuffer = Buffer.from(keyString, 'base64');
    return await window.crypto.subtle.importKey(
      'raw',
      myBuffer,
      ALGORITHM,
      true,
      ['encrypt', 'decrypt']
    );
  } catch (e) {
    console.log(`Error occur while exporting sym key ${e}`);
  }
  return null;
};

export const encryptWithSymmetricKey = async (
  key: CryptoKey,
  data: string,
  iv: Uint8Array
): Promise<string | null> => {
  try {
    // The iv must never be reused with a given key.
    const dataBuffer = textToArrayBuffer(data);
    const cipherData = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      dataBuffer
    );
    return arrayBufferToText(cipherData);
  } catch (err) {
    console.log(`Error occur while encrypting with sym key ${err}`);
  }
  return null;
};

export const decryptWithSymmetricKey = async (
  key: CryptoKey,
  cipherData: string,
  iv: Uint8Array
) => {
  try {
    const cipherDataBuffer = textToArrayBuffer(cipherData);
    const data = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      cipherDataBuffer
    );
    return arrayBufferToText(data);
  } catch (err) {
    console.log(`Error occur while encrypting with sym key ${err}`);
  }
  return null;
};
