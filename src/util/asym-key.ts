function arrayBufferToBase64(arrayBuffer: any) {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return window.btoa(byteString);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addNewLines(str: string) {
  let finalString = '';
  while (str.length > 0) {
    // eslint-disable-next-line prefer-template
    finalString += str.substring(0, 64) + '\n';
    // eslint-disable-next-line no-param-reassign
    str = str.substring(64);
  }

  return finalString;
}

function toPublicPem(privateKey: any) {
  const b64 = arrayBufferToBase64(privateKey);
  const newline = addNewLines(b64);
  return `-----BEGIN PUBLIC KEY-----\n${newline}-----END PUBLIC KEY-----`;
}

function toPrivatePem(privateKey: any) {
  const b64 = arrayBufferToBase64(privateKey);
  console.log(b64);
  const newline = addNewLines(b64);
  const datas = `-----BEGIN PRIVATE KEY-----\n${newline}-----END PRIVATE KEY-----`;
  console.log(datas);
  return datas;
}

export type ReturnData = {
  privateKey: any;
  publicKey: any;
};

const ALGORITHM = 'RSA-OAEP';

export const generateAsymKeyPair = async (): Promise<ReturnData | string> => {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        modulusLength: 2048, // can be 1024, 2048 or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' }, // or SHA-512
      },
      true,
      ['encrypt', 'decrypt']
    );
    const privateKey = await window.crypto.subtle.exportKey(
      'pkcs8',
      keyPair.privateKey
    );
    const publicKey = await window.crypto.subtle.exportKey(
      'spki',
      keyPair.publicKey
    );
    return {
      privateKey: toPrivatePem(privateKey),
      publicKey: toPublicPem(publicKey),
    };
  } catch (err) {
    return 'error';
  }
};

function str2ab(str: any) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  // eslint-disable-next-line no-plusplus
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function getSpkiDer(spkiPem: any) {
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = spkiPem.substring(
    pemHeader.length,
    spkiPem.length - pemFooter.length
  );
  const binaryDerString = window.atob(pemContents);
  return str2ab(binaryDerString);
}

function getPkcs8Der(pkcs8Pem: any) {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = pkcs8Pem.substring(
    pemHeader.length,
    pkcs8Pem.length - pemFooter.length
  );
  const binaryDerString = window.atob(pemContents);
  return str2ab(binaryDerString);
}

export const encrypt = async (key: any, data: any) => {
  try {
    const result = await crypto.subtle.importKey(
      'spki',
      getSpkiDer(key),
      {
        name: ALGORITHM,
        hash: { name: 'SHA-256' }, // or SHA-512
      },
      true,
      ['encrypt']
    );
    return await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
      },
      result,
      new TextEncoder().encode(data)
    );
  } catch (err) {
    return null;
  }
};

export const decrypt = async (key: any, data: any) => {
  try {
    const result = await crypto.subtle.importKey(
      'pkcs8',
      getPkcs8Der(key),
      {
        name: ALGORITHM,
        hash: { name: 'SHA-256' }, // or SHA-512
      },
      true,
      ['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
      },
      result,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    return null;
  }
};
