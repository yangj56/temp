import { Role } from 'contants';
import { Login } from 'features/poc/components/login';
import icaLogo from 'assets/ica_mobile_logo.svg';
import AppStateList from 'features/poc/components/appstate-list';

export function LoginAgency() {
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
            height: '150px',
            justifyContent: 'center',
            marginBottom: '50px',
            marginTop: '80px',
          }}
        >
          <img src={icaLogo} alt="ica" />
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
            ICA E-Service - Death Certificate{' '}
          </div>
        </div>
        <Login
          role={Role.AGENCY}
          title="Login with AED"
          placeholder="Enter AED ID"
        />
      </div>
      <AppStateList />
    </div>
  );
}
