/* eslint-disable no-console */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-alert */
import { MainLayout } from 'common/layout/main';
import { QueryKey, Role } from 'contants';
import { useQuery } from 'react-query';
import { Button, ButtonGroup, Card, Form, ToggleButton } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ILoginResponse, postLoginUser } from 'features/poc/apis/poc';
import { useHistory } from 'react-router';
import { encryptDataWithPasswordWithScrypt } from 'util/password-data-key';
import {
  exportAsymmetricKeyToPEM,
  generateAsymmetricKey,
} from 'util/asymmetric-key';
import { generateIV, generateSalt, arrayBufferToBase64 } from 'util/helper';
import { AppDispatch } from 'store/store';
import { useDispatch } from 'react-redux';
import {
  selectRole,
  setRole,
  setSalt,
  setIV,
  setUserID,
  setPublicKey,
} from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { LoadingClip } from 'components/modal/loading';

export default function Poc() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedPrivateKeyVal, setEncryptedPrivateKeyVal] = useState('');
  const [publicKeyVal, setPublicKeyVal] = useState('');
  const [saltVal, setSaltVal] = useState<Uint8Array>();
  const [ivVal, setIvVal] = useState<Uint8Array>();
  const [loadingModal, setLoadingModal] = useState(false);
  const [goNext, setGoNext] = useState(false);
  const routerHistory = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const role = useAppSelector(selectRole);

  const radios = [
    { name: Role.AGENCY, value: Role.AGENCY },
    { name: Role.PUBLIC, value: Role.PUBLIC },
  ];

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
        salt: arrayBufferToBase64(saltVal!),
        iv: arrayBufferToBase64(ivVal!),
        publicKey: publicKeyVal,
        encryptedPrivateKey: encryptedPrivateKeyVal,
        role,
      }),
    {
      cacheTime: 10,
      enabled: false,
    }
  );
  useEffect(() => {
    if (
      publicKeyVal &&
      encryptedPrivateKeyVal &&
      username &&
      saltVal &&
      role &&
      goNext
    ) {
      refetch()
        .then((res) => {
          setLoadingModal(false);
          setGoNext(false);
          if (res.isError) {
            window.alert('cannot go forward');
          } else if (res.isSuccess) {
            console.log(res.data);
            // simulate login and sync browser data to backend. if the user exist, it will omit whatever keys that are generated on the browser
            dispatch(setSalt(res.data.salt));
            dispatch(setIV(res.data.iv));
            dispatch(setUserID(res.data.id));
            dispatch(setPublicKey(res.data.publicKey));
            routerHistory.push('/dashboard');
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
  }, [publicKeyVal, encryptedPrivateKeyVal, username, saltVal, role, goNext]);

  const validateInput = () => {
    if (!username || !password || !role) {
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
    <div className="w-full flex justify-center my-40">
      <Card style={{ width: '18rem' }}>
        <ButtonGroup toggle>
          {radios.map((radio, index) => (
            <ToggleButton
              key={index}
              type="radio"
              name="radio"
              value={radio.value}
              checked={role === radio.value}
              onChange={(e) => dispatch(setRole(e.currentTarget.value))}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <Card.Body>
          <Card.Title>POC Login </Card.Title>
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>Login ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ID"
                id="username"
                onChange={setInputUserName}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                id="password"
                onChange={setInputPassword}
              />
            </Form.Group>
            {isError && <p className="text-red-500"> Error Login</p>}
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
