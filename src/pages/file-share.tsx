import React, { useState } from 'react';

import { LayoutDiv } from 'common/style';
import { Footer } from 'components/footer';
import { useQuery } from 'react-query';
import {
  getEncryptedFile,
  getTransaction,
  IFile,
  ITransactionFile,
} from 'features/poc/apis/poc';
import { LoadingSpinner } from 'components/modal/loading';
import { FileCard } from 'components/file-card';
import { Role } from 'contants';
import { base64StringToArrayBuffer } from 'util/helper';
import { decryptDataWithPasswordWithScrypt } from 'util/password-data-key';
import { decryptWithSymmetricKey, importSymmtricKey } from 'util/symmetric-key';
import { TextModal } from 'components/text-modal';
import PdfViewer from 'components/pdf-viewer';

export const FileShare = () => {
  const [pinSalt, setPinSalt] = useState<Uint8Array>();
  const [pinIv, setPinIv] = useState<Uint8Array>();
  const [error, setError] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);

  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const transactionId = searchParams.get('transactionId');
  const agencyId = searchParams.get('agencyId');

  // Get all shared files based on transactionId
  const { isLoading, isError, data } = useQuery(
    'transaction',
    () => getTransaction(transactionId!),
    {
      onSuccess: (result) => {
        if (result) {
          setPinSalt(base64StringToArrayBuffer(result.salt) as Uint8Array);
          setPinIv(base64StringToArrayBuffer(result.iv) as Uint8Array);
        }
      },
    }
  );

  // TODO: Download button prompt password to generate password key for decryption
  const handleDownload = async (transactionFile: ITransactionFile) => {
    if (data) {
      const { tempDataKey, tempDataIv } = transactionFile;
      const {
        id: fileId,
        name: filename,
        type: filetype,
      } = transactionFile.file;

      console.log('Start download');
      const password = window.prompt('Enter your PIN');
      if (typeof password === 'object') return;

      let dataKeyString: string = '';
      try {
        // Enter PIN to generate password key with scrypt and decrypt the encrypted data key key with password key
        dataKeyString = await decryptDataWithPasswordWithScrypt(
          password!,
          tempDataKey,
          pinSalt!,
          pinIv!
        );
      } catch (err) {
        console.log('err in file-share', err.message);
        setError(err);
        return;
      }

      // Get encrypted file
      const responseData = await getEncryptedFile(fileId);
      const fileIv = base64StringToArrayBuffer(tempDataIv) as Uint8Array;

      // Import the base64 data key into CryptoKey
      const importedDataKey = await importSymmtricKey(dataKeyString);

      // Convert the file back to array buffer
      const dataInBuffer: ArrayBuffer = await responseData.data.arrayBuffer();

      // Decrypt the file with the data key and iv
      const decryptedFile = await decryptWithSymmetricKey(
        importedDataKey,
        dataInBuffer,
        fileIv
      );

      // Convert the file string back to Blob
      const dataFile = new File([decryptedFile!], filename, {
        type: filetype,
      });

      // setPdf(dataFile);

      console.log('datafile', dataFile);
      const url = window.URL.createObjectURL(dataFile);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <LayoutDiv>
      <div>File Share</div>
      {data &&
        data.transactionFiles.map((transactionFile, index) => {
          const { name, thumbnailPath } = transactionFile.file;
          return (
            <FileCard
              name={name}
              thumbnailPath={thumbnailPath}
              onDownload={() => handleDownload(transactionFile)}
              onShare={() => console.log('Share')}
              onImageClick={() => console.log('on image click')}
              role={Role.PUBLIC}
              key={`file-share-${index}`}
            />
          );
        })}
      {isError && <div>Error getting transaction</div>}
      {isLoading && <LoadingSpinner loading />}
      {error && (
        <TextModal show title="File Download" onClose={() => setError('')}>
          <p>Please provide a valid PIN.</p>
        </TextModal>
      )}
      <Footer />
      {/* {pdf && <PdfViewer file={pdf} onClose={() => setPdf(null)} />} */}
    </LayoutDiv>
  );
};
