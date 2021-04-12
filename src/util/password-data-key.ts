import { keyToString } from 'util/helper';

const getKeyMaterial = async (password: string) => {
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
};

const getKey = async (keyMaterial, salt) => {
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

const iv = window.crypto.getRandomValues(new Uint8Array(12));

export const encryptDataWithPassword = async (
  password: string,
  data: string,
  salt: Uint8Array
): Promise<string> => {
  try {
    const enc = new TextEncoder();
    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, salt);
    const encodedData = enc.encode(data);
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encodedData
    );
    return Buffer.from(ciphertext).toString('base64');
  } catch (e) {
    console.log(`Error occur while encryting data ${e}`);
  }
  return 'error';
};

export const decryptDataWithPassword = async (
  ciphertext: string,
  password = 'test',
  salt: Uint8Array
): Promise<string> => {
  try {
    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, salt);
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertextBuffer
    );
    console.log(keyToString(key));
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (e) {
    console.log(`Error occur while decrypting data ${e}`);
  }
  return 'error';
};
