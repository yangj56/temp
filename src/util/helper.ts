import { arrayBufferToBase64 } from 'util/asym-key';

export const keyToString = async (key: CryptoKey) => {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  const exportedKeyBuffer = new Uint8Array(exported);
  return Buffer.from(exportedKeyBuffer).toString('base64');
};

export const uint8ArrayToString = (val: Uint8Array): string => {
  return arrayBufferToBase64(val);
};

export const stringTouint8Array = (val: string): Uint8Array => {
  return new Uint8Array(Buffer.from(val, 'base64'));
};

export const generateSalt = () => {
  return crypto.getRandomValues(new Uint8Array(16));
};

export const generateIV = () => {
  return crypto.getRandomValues(new Uint8Array(12));
};
