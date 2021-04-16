/* eslint-disable security/detect-possible-timing-attacks */
/* eslint-disable no-console */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-alert */
import { LoadingSpinner } from 'components/modal/loading';
import { AppState, QueryKey, Role } from 'contants';
import {
  getExistingUser,
  ILoginResponse,
  IUserResponse,
  postLoginUser,
} from 'features/poc/apis/poc';
import { insertAppState, selectAppState } from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
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
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { AppDispatch } from 'store/store';
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
  const [password2, setPassword2] = useState('');
  const [encryptedPrivateKeyVal, setEncryptedPrivateKeyVal] = useState('');
  const [publicKeyVal, setPublicKeyVal] = useState('');
  const [saltVal, setSaltVal] = useState<Uint8Array>();
  const [ivVal, setIvVal] = useState<Uint8Array>();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [goNext, setGoNext] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const appStateVal = useAppSelector(selectAppState);

  const routerHistory = useHistory();

  const setInputPassword = (e: any) => {
    setPassword(e.currentTarget.value);
  };

  const setInputPassword2 = (e: any) => {
    setPassword2(e.currentTarget.value);
  };

  const setInputUserName = (e: any) => {
    setUsername(e.currentTarget.value);
  };

  const dispatchAppState = (appState: string) => {
    dispatch(insertAppState(appState));
  };

  const {
    isLoading: isCreateLoginUserLoading,
    isError: isCreateLoginUserError,
    refetch: createLoginUser,
  } = useQuery<ILoginResponse>(
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

  const {
    isLoading: isCheckUserExistLoading,
    isError: isCheckUserExistError,
    refetch: checkUserExist,
  } = useQuery<IUserResponse | null>(
    QueryKey.USER_EXIST,
    () => getExistingUser(username),
    {
      cacheTime: 10,
      enabled: false,
    }
  );

  useEffect(() => {
    if (goNext) {
      dispatchAppState(AppState.UPLOADING_ENCRYPTED_PRIVATE_KEY);
      createLoginUser({})
        .then((res) => {
          setShowLoadingModal(false);
          setGoNext(false);
          if (res.isError) {
            window.alert('Error in creating user');
          } else if (res.isSuccess) {
            console.log(res.data);
            routerHistory.push(`/dashboard?userid=${username}`);
          } else {
            window.alert('Error in creating user');
          }
        })
        .catch((err) => {
          setShowLoadingModal(false);
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

    await checkUserExist().then((response) => {
      if (response.data) {
        if (response.data.role !== role) {
          window.alert(
            `Role error: your current role is ${response.data.role}`
          );
          return;
        }
        routerHistory.push(`/dashboard?userid=${username}`);
        return;
      }
      setShowPassphrase(true);
    });
  };

  const generateKeys = async () => {
    try {
      setShowPassphrase(false);
      if (password !== password2) {
        window.alert('password does not match');
        return;
      }
      setShowLoadingModal(true);
      dispatchAppState(AppState.GENERATE_ASYM_KEY);
      const asymmetricKeyPair = await generateAsymmetricKey();
      const newSalt = generateSalt();
      const newIV = generateIV();

      setSaltVal(newSalt);
      setIvVal(newIV);
      const asymmetricKeyPEM = await exportAsymmetricKeyToPEM(
        asymmetricKeyPair!
      );
      dispatchAppState(asymmetricKeyPEM.privateKey);
      dispatchAppState(AppState.ENCRYPT_PRIVATE_KEY_WITH_PASSWORD);
      const encryptedPrivateKey = await encryptDataWithPasswordWithScrypt(
        password,
        asymmetricKeyPEM.privateKey,
        newSalt!,
        newIV!
      );
      dispatchAppState(encryptedPrivateKey);
      setPublicKeyVal(asymmetricKeyPEM.publicKey);
      setEncryptedPrivateKeyVal(encryptedPrivateKey);
      setGoNext(true);
    } catch (err) {
      setShowLoadingModal(false);
      console.log('Error while generating keys');
      dispatchAppState(`Error while generating keys ${err.message}`);
    }
  };

  return (
    <div className="w-full flex justify-center my-20">
      <LoadingSpinner
        loading={
          isCheckUserExistLoading ||
          isCreateLoginUserLoading ||
          showLoadingModal
        }
        text={appStateVal[appStateVal.length - 1]}
      />
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
            {(isCheckUserExistError || isCreateLoginUserError) && (
              <p className="text-red-500"> Error Login</p>
            )}
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
              placeholder="Enter the password"
              type="password"
            />
          </InputGroup>
          <InputGroup style={{ marginTop: 10 }}>
            <FormControl
              id="password2"
              aria-describedby="basic-password"
              onChange={setInputPassword2}
              placeholder="Renter the password"
              type="password"
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
