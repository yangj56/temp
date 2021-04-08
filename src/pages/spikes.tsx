/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/dot-notation */
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { MainLayout } from 'common/layout/main';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import {
  decrypt,
  encrypt,
  generateAsymKeyPair,
  ReturnData,
} from 'util/asym-key';
import {
  generateSymKeyPair,
  encrypt as encryptS,
  decrypt as decryptS,
} from 'util/sym-key';
import { CustomIframe } from 'components/iframe/custom-site';

const pdf = require('../dummy/sample2.pdf');

export const paramStringToObj = (params) => {
  const paramsArr = params?.split('?')[1]?.split('&');
  const obj = {};
  paramsArr?.forEach((p) => {
    const [key, val] = p.split('=');
    obj[key] = val;
  });
  return obj;
};

export function Spikes(): JSX.Element {
  const [newNumPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [asymPubKey, setAsymPubKey] = useState('');
  const [asymPriKey, setAsymPriKey] = useState('');
  const [symKey, setSymKey] = useState('');
  const [symEncryptedKey, setSymEncryptedKey] = useState<string | null>('');
  const [encryptedFile, setEncryptedFile] = useState<any>('');
  const [file, setFile] = useState<any>('../dummy/sample.pdf');

  const onMessageReceived = (event) => {
    if (window.location.origin !== event.origin) {
      return;
    }
    const params = event.data;
    if (typeof params === 'string') {
      const obj = paramStringToObj(params);
      console.log(obj);
      setAsymPriKey(decodeURIComponent(obj['privateKey']));
      setAsymPubKey(decodeURIComponent(obj['publicKey']));
    }
    console.log('Message from iframe', event);
  };

  useEffect(() => {
    window.addEventListener('message', onMessageReceived);
    return () => window.removeEventListener('message', onMessageReceived);
  }, []);

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    // setFile(inputFile);

    const reader = new FileReader();

    reader.readAsArrayBuffer(inputFile);

    reader.onload = async function () {
      const arrayBuffer =
        symEncryptedKey && Buffer.from(symEncryptedKey, 'base64');
      const decryptedSymKey = await decrypt(asymPriKey, arrayBuffer);
      const encryptedData = await encryptS(decryptedSymKey, reader.result);
      console.log('encryptedData');
      console.log(encryptedData);
      const decryptedData = await decryptS(decryptedSymKey, encryptedData);
      console.log('onload here again');
      console.log(reader.result);
      console.log(encryptedData);

      setFile(decryptedData);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  const generateAsymKey = async () => {
    const keys = (await generateAsymKeyPair()) as ReturnData;
    setAsymPriKey(keys.privateKey);
    setAsymPubKey(keys.publicKey);
  };
  const generateSymKey = async () => {
    const key = await generateSymKeyPair();
    setSymKey(key);
    // const data = 'final message is the same hello';
    console.log(asymPubKey);
    const encryptedSymKey = await encrypt(asymPubKey, key);
    console.log(encryptedSymKey);
    const base64String =
      encryptedSymKey && Buffer.from(encryptedSymKey).toString('base64');
    setSymEncryptedKey(base64String);
    // const arrayBuffer = base64String && Buffer.from(base64String, 'base64');
    // const decryptedSymKey = await decrypt(asymPriKey, arrayBuffer);
    // const encryptedData = await encryptS(decryptedSymKey, data);
    // const decryptedData = await decryptS(decryptedSymKey, encryptedData);
    // if (decryptedData) {
    //   console.log(new TextDecoder().decode(decryptedData));
    // }
  };

  return (
    <MainLayout>
      {/* <Button variant="outline-primary" onClick={generateAsymKey}>
        Generate Asym keys
      </Button> */}
      <Button variant="outline-primary" onClick={generateSymKey}>
        Generate Sym keys
      </Button>
      <div className="container mx-auto whitespace-pre-line">
        <p className="text-purple-600">Asymmetric public key</p>
        <br />
        {asymPubKey}
      </div>
      <div className="container mx-auto whitespace-pre-line">
        <p className="text-purple-600">Asymmetric private key</p>
        <br />
        {asymPriKey}
      </div>
      <div className="container mx-auto whitespace-pre-line">
        <p className="text-purple-600">Symmetric key</p>
        <br />
        {symKey}
      </div>
      <div className="container mx-auto whitespace-pre-line">
        <p className="text-purple-600">Encrypted Symmetric key</p>
        <br />
        {symEncryptedKey}
      </div>
      <input onChange={onFileChange} type="file" />
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {newNumPages}
      </p>
      <div className="container">
        <CustomIframe
          src="http://localhost:8000/" // MyInfo origin
          title="MyInfo Page"
        />
      </div>
    </MainLayout>
  );
}
