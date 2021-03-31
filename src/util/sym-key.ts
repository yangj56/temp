const ALGORITHM = 'AES-GCM';

export const generateSymKeyPair = async (): Promise<any> => {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
    const exported = await window.crypto.subtle.exportKey('raw', key);
    console.log('exported');
    console.log(exported);
    const exportedKeyBuffer = new Uint8Array(exported);
    return Buffer.from(exportedKeyBuffer).toString('base64');
  } catch (err) {
    console.log(err);
    return 'error';
  }
};

const iv = window.crypto.getRandomValues(new Uint8Array(12));
export const encrypt = async (bufferString: any, data: any) => {
  try {
    const myBuffer = Buffer.from(bufferString, 'base64');
    const keyImported = await window.crypto.subtle.importKey(
      'raw',
      myBuffer,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
    // The iv must never be reused with a given key.
    return await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      keyImported,
      data
    );
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const decrypt = async (bufferString: any, ciphertext: any) => {
  try {
    const myBuffer = Buffer.from(bufferString, 'base64');
    const keyImported = await window.crypto.subtle.importKey(
      'raw',
      myBuffer,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      keyImported,
      ciphertext
    );
    return decrypted;
  } catch (err) {
    console.log(err);
    return null;
  }
};
