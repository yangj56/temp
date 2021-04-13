/* eslint-disable no-alert */
import { QueryKey, Role } from 'contants';
import { useQuery } from 'react-query';
import { Button, ButtonGroup, Card, Form, ToggleButton } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ILoginResponse, postLoginUser } from 'features/poc/apis/poc';
import { useHistory } from 'react-router';
import { encryptDataWithPasswordWithScrypt } from 'util/password-data-key';
import { generateAsymKeyPair, ReturnData } from 'util/asym-key';
import { generateIV, generateSalt, uint8ArrayToString } from 'util/helper';
import { AppDispatch } from 'store/store';
import { useDispatch } from 'react-redux';
import {
  selectRole,
  setRole,
  setSalt,
  setIV,
  setUserID,
} from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { Loading } from 'components/skeleton-loader/loading';

export function FakeLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState('');
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

  const { isLoading, isError, data, refetch } = useQuery<ILoginResponse>(
    QueryKey.LOGIN,
    () =>
      postLoginUser({
        id: username,
        salt: uint8ArrayToString(saltVal!),
        iv: uint8ArrayToString(ivVal!),
        publicKey,
        encryptedPrivateKey,
        role,
      }),
    {
      cacheTime: 10,
      enabled: false,
    }
  );
  useEffect(() => {
    if (
      publicKey &&
      encryptedPrivateKey &&
      username &&
      saltVal &&
      role &&
      goNext
    ) {
      refetch()
        .then((res) => {
          if (res.isError) {
            setGoNext(false);
            window.alert('cannot go forward');
          } else if (res.isSuccess) {
            setGoNext(false);
            console.log(res.data);
            dispatch(setSalt(uint8ArrayToString(saltVal!)));
            dispatch(setIV(uint8ArrayToString(ivVal!)));
            dispatch(setUserID(username));
            routerHistory.push('/dashboard');
          } else {
            setGoNext(false);
            window.alert('cannot go somewhat');
          }
        })
        .catch((err) => {
          setGoNext(false);
          window.alert(`login failed with error ${err}`);
        });
    }
  }, [publicKey, encryptedPrivateKey, username, saltVal, role, goNext]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keys = (await generateAsymKeyPair()) as ReturnData;
    const newSalt = generateSalt();
    const newIV = generateIV();
    setSaltVal(newSalt);
    setIvVal(newIV);
    const encryptedData = await encryptDataWithPasswordWithScrypt(
      password,
      keys.privateKey,
      newSalt!,
      newIV!
    );
    setPublicKey(keys.publicKey);
    setEncryptedPrivateKey(encryptedData);
    setLoadingModal(true);
    setGoNext(true);
  };

  if (isLoading || loadingModal) {
    return <Loading />;
  }

  if (isError) {
    return <div>isError</div>;
  }

  if (data) {
    return <div>done</div>;
  }
  return (
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
        <Card.Title>POC Login</Card.Title>
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
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
