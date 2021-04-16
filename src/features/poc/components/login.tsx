/* eslint-disable no-console */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-alert */
import { LoadingClip } from 'components/modal/loading';
import { QueryKey, Role } from 'contants';
import {
  checkUserExit,
  ILoginResponse,
  postLoginUser,
} from 'features/poc/apis/poc';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  FormControl,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import {
  exportAsymmetricKeyToPEM,
  generateAsymmetricKey,
} from 'util/asymmetric-key';
import { arrayBufferToBase64, generateIV, generateSalt } from 'util/helper';
import { encryptDataWithPasswordWithScrypt } from 'util/password-data-key';

type Props = {
  role: Role;
  title: string;
  placeholder: string;
};

export function Login({ role, title, placeholder }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedPrivateKeyVal, setEncryptedPrivateKeyVal] = useState('');
  const [publicKeyVal, setPublicKeyVal] = useState('');
  const [saltVal, setSaltVal] = useState<Uint8Array>();
  const [ivVal, setIvVal] = useState<Uint8Array>();
  const [loadingModal, setLoadingModal] = useState(false);
  const [goNext, setGoNext] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);

  const routerHistory = useHistory();

  const setInputPassword = (e: any) => {
    setPassword(e.currentTarget.value);
  };

  const setInputUserName = (e: any) => {
    setUsername(e.currentTarget.value);
  };

  const { isLoading, isError, refetch } = useQuery<ILoginResponse>(
    QueryKey.LOGIN,
    () =>
      postLoginUser({
        id: username,
        salt: saltVal ? arrayBufferToBase64(saltVal!) : '',
        iv: ivVal ? arrayBufferToBase64(ivVal!) : '',
        publicKey: publicKeyVal || '',
        encryptedPrivateKey: encryptedPrivateKeyVal || '',
        role,
      }),
    {
      cacheTime: 10,
      enabled: false,
    }
  );
  useEffect(() => {
    if (goNext) {
      refetch()
        .then((res) => {
          setLoadingModal(false);
          setGoNext(false);
          if (res.isError) {
            window.alert('cannot go forward');
          } else if (res.isSuccess) {
            console.log(res.data);
            routerHistory.push(`/dashboard?userid=${username}`);
          } else {
            window.alert('cannot go somewhat');
          }
        })
        .catch((err) => {
          setLoadingModal(false);
          setGoNext(false);
          window.alert(`login failed with error ${err}`);
        });
    }
  }, [goNext]);

  const validateInput = () => {
    if (!username || !role) {
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInput()) {
      window.alert(`Enter required files`);
      return;
    }

    /*
    check if user exist
    if yes we can just retrieve all the items from the backend without regenerating a new set of sets
    if no we will proceed with onboarding (generation of keys and request for master password)
    */
    const checkUserExist = await checkUserExit(username);
    if (checkUserExist) {
      routerHistory.push(`/dashboard?userid=${username}`);
      return;
    }
    setShowPassphrase(true);
  };

  const generateKeys = async () => {
    const asymmetricKeyPair = await generateAsymmetricKey();
    const newSalt = generateSalt();
    const newIV = generateIV();

    setSaltVal(newSalt);
    setIvVal(newIV);
    const asymmetricKeyPEM = await exportAsymmetricKeyToPEM(asymmetricKeyPair!);
    console.log('asymmetricKeyPEM');
    console.log(asymmetricKeyPEM.privateKey);
    const encryptedData = await encryptDataWithPasswordWithScrypt(
      password,
      asymmetricKeyPEM.privateKey,
      newSalt!,
      newIV!
    );
    console.log('encryptedData');
    console.log(encryptedData);
    setPublicKeyVal(asymmetricKeyPEM.publicKey);
    setEncryptedPrivateKeyVal(encryptedData);
    setLoadingModal(true);
    setGoNext(true);
  };

  if (isLoading || loadingModal) {
    return <LoadingClip loading />;
  }

  return (
    <div className="w-full flex justify-center my-20">
      <Card style={{ width: '30rem' }}>
        <Card.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>{title}</Form.Label>
              <Form.Control
                type="text"
                placeholder={placeholder}
                id="username"
                onChange={setInputUserName}
              />
            </Form.Group>
            {isError && <p className="text-red-500"> Error Login</p>}
            <Button variant="danger" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Modal
        show={showPassphrase}
        onHide={() => {
          setShowPassphrase(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Please enter the master password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          <InputGroup>
            <FormControl
              id="password"
              aria-describedby="basic-password"
              onChange={setInputPassword}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowPassphrase(false);
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={generateKeys}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
