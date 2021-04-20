/* eslint-disable no-alert */
import { Card, Form, Button } from 'react-bootstrap';

import fileSGLogo from 'assets/filesg.svg';
import AppStateList from 'features/poc/components/appstate-list';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export function LoginFileShare() {
  const [otp, setOtp] = useState('');

  const routerHistory = useHistory();

  const { search } = window.location;
  const searchParam = new URLSearchParams(search);
  const transaction = searchParam.get('transactionId');
  const agency = searchParam.get('agencyId');

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (otp.length !== 6) {
      window.alert('Please enter a valid OTP');
      setOtp('');
    }
    // Proceed to next page to view files
    routerHistory.push(
      `/file-share/?transactionId=${transaction}&agencyId=${agency}`
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            height: '130px',
            justifyContent: 'center',
            marginBottom: '50px',
            marginTop: '80px',
          }}
        >
          <img src={fileSGLogo} alt="fileSG" />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#ffffff',
          }}
        >
          <div style={{ fontFamily: 'Source Sans Pro', fontSize: '24px' }}>
            {' '}
            You have been shared file by <b>{agency}</b> with transaction id of{' '}
            <b>{transaction}</b>
          </div>
          <p>Please complete the verification process to proceed</p>
          <Card style={{ width: '30rem', marginTop: '50px' }}>
            <Card.Body>
              <Form onSubmit={handleOnSubmit}>
                <Form.Group>
                  <Form.Label>Verify Mobile Number</Form.Label>
                  <Form.Text
                    id="OTPHelpInline"
                    style={{ cursor: 'pointer', marginBottom: '10px' }}
                    onClick={() => console.log('send OTP')}
                  >
                    Click here to send OTP
                  </Form.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter OTP"
                    id="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>
                <Button variant="danger" type="submit">
                  Verify
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
      <AppStateList />
    </div>
  );
}
