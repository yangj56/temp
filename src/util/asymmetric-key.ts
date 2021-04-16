import {
  arrayBufferToBase64,
  arrayBufferToText,
  base64StringToArrayBuffer,
  convertBinaryToPem,
  convertPemToBinary,
  textToArrayBuffer,
} from 'util/helper';

/* eslint-disable no-console */
export type AsymmetricKeyPairBinary = {
  privateKey: ArrayBuffer;
  publicKey: ArrayBuffer;
};

export type AsymmetricKeyPairPEM = {
  privateKey: string;
  publicKey: string;
};

const ALGORITHM = 'RSA-OAEP';
const SHA = 'SHA-256';
const MODULUS_LENGTH = 2048;

export const generateAsymmetricKey = async (): Promise<CryptoKeyPair> => {
  try {
    return await window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        modulusLength: MODULUS_LENGTH,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: SHA },
      },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (err) {
    console.log('error in creating asymmetric key pair ');
    throw err;
  }
};

export const exportAsymmetricKeyToPEM = async (
  keyPair: CryptoKeyPair
): Promise<AsymmetricKeyPairPEM> => {
  const privateKey = await window.crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  );
  const publicKey = await window.crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  );
  return {
    privateKey: convertBinaryToPem(privateKey, 'RSA PRIVATE KEY'),
    publicKey: convertBinaryToPem(publicKey, 'RSA PUBLIC KEY'),
  };
};

export const importPublicKey = async (pemKey: string): Promise<CryptoKey> => {
  try {
    return await crypto.subtle.importKey(
      'spki',
      convertPemToBinary(pemKey),
      {
        name: ALGORITHM,
        hash: { name: SHA }, // or SHA-512
      },
      true,
      ['encrypt']
    );
  } catch (err) {
    console.log('error in importing asymmetric public key');
    throw err;
  }
};

export const importPrivateKey = async (pemKey: string): Promise<CryptoKey> => {
  try {
    return await crypto.subtle.importKey(
      'pkcs8',
      convertPemToBinary(pemKey),
      {
        name: ALGORITHM,
        hash: { name: SHA }, // or SHA-512
      },
      true,
      ['decrypt']
    );
  } catch (err) {
    console.log('error in importing asymmetric private key');
    throw err;
  }
};

export const encryptWithCryptoKey = async (
  key: CryptoKey,
  data: string
): Promise<string> => {
  try {
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
      },
      key,
      textToArrayBuffer(data)
    );
    return arrayBufferToBase64(encryptedBuffer);
  } catch (err) {
    console.log('error in encrypting with asymmetric key');
    throw err;
  }
};

export const decryptWithCryptoKey = async (key: CryptoKey, data: string) => {
  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
      },
      key,
      base64StringToArrayBuffer(data)
    );
    return arrayBufferToText(decryptedBuffer);
  } catch (err) {
    console.log('error in decrypting with asymmetric key');
    throw err;
  }
};
