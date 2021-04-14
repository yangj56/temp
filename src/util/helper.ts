/* eslint-disable prefer-template */
/* eslint-disable security/detect-object-injection */
export function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  for (let i = 0; i < byteArray.byteLength; i += 1) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return window.btoa(byteString);
}

export const base64StringToArrayBuffer = (b64str: string): ArrayBuffer => {
  return new Uint8Array(Buffer.from(b64str, 'base64'));
};

// similar to const enc = new TextEncoder(); const encodedData = enc.encode(data);
export const textToArrayBuffer = (str: string): ArrayBuffer => {
  const buf = unescape(encodeURIComponent(str)); // 2 bytes for each char
  const bufView = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length; i += 1) {
    bufView[i] = buf.charCodeAt(i);
  }
  return bufView;
};

export const arrayBufferToText = (arrayBuffer: ArrayBuffer): string => {
  const byteArray = new Uint8Array(arrayBuffer);
  let str = '';
  for (let i = 0; i < byteArray.byteLength; i += 1) {
    str += String.fromCharCode(byteArray[i]);
  }
  return str;
};
export const convertBinaryToPem = (
  binaryData: ArrayBuffer,
  label: string
): string => {
  const base64Cert = arrayBufferToBase64(binaryData);
  let pemCert = '-----BEGIN ' + label + '-----\r\n';
  let nextIndex = 0;
  while (nextIndex < base64Cert.length) {
    if (nextIndex + 64 <= base64Cert.length) {
      pemCert += base64Cert.substr(nextIndex, 64) + '\r\n';
    } else {
      pemCert += base64Cert.substr(nextIndex) + '\r\n';
    }
    nextIndex += 64;
  }
  pemCert += '-----END ' + label + '-----\r\n';
  return pemCert;
};

export const convertPemToBinary = (pem: string): ArrayBuffer => {
  const lines = pem.split('\n');
  let encoded = '';
  for (let i = 0; i < lines.length; i += 1) {
    if (
      lines[i].trim().length > 0 &&
      lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
      lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-END RSA PUBLIC KEY-') < 0
    ) {
      encoded += lines[i].trim();
    }
  }
  return base64StringToArrayBuffer(encoded);
};

export const generateSalt = () => {
  return crypto.getRandomValues(new Uint8Array(16));
};

export const generateIV = () => {
  return crypto.getRandomValues(new Uint8Array(12));
};
