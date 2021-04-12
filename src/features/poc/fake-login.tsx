import { Listing } from 'components/skeleton-loader/listing';
import { QueryKey, Role } from 'contants';
import { useQuery } from 'react-query';
import { Button, ButtonGroup, Card, Form, ToggleButton } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ILoginResponse, postLoginUser } from 'features/user/apis/login';
import { useHistory } from 'react-router';
import { encryptDataWithPassword } from 'util/password-data-key';
import { generateAsymKeyPair, ReturnData } from 'util/asym-key';
import { stringTouint8Array, uint8ArrayToString } from 'util/helper';
import { AppDispatch } from 'store/store';
import { useDispatch } from 'react-redux';
import { selectRole, setRole } from 'features/poc/slices/role';
import { useAppSelector } from 'hooks/useSlice';

export function FakeLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState('');
  const [salt, setSalt] = useState<Uint8Array>();
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
        salt: uint8ArrayToString(salt!),
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
    if (publicKey && encryptedPrivateKey && username && salt && role) {
      console.log('go next');
      refetch()
        .then(() => {
          routerHistory.push('/dashboard');
        })
        .catch((err) => {
          console.log(`login failed with error ${err}`);
        });
    }
  }, [publicKey, encryptedPrivateKey, username, salt, role]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Login with username:${username} password:${password}`);

    const keys = (await generateAsymKeyPair()) as ReturnData;
    const saltVal = crypto.getRandomValues(new Uint8Array(16));
    setSalt(saltVal);
    const encryptedData = await encryptDataWithPassword(
      password,
      keys.privateKey,
      saltVal!
    );
    setPublicKey(keys.publicKey);
    setEncryptedPrivateKey(encryptedData);
  };

  if (isLoading) {
    return <Listing />;
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
