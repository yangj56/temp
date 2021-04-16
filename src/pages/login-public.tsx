import { Role } from 'contants';
import { Login } from 'features/poc/components/login';
import fileSGLogo from 'assets/filesg.svg';
import AppStateList from 'features/poc/components/appstate-list';

export function LoginPublic() {
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
            In any problem situation, there is always a solution{' '}
          </div>
        </div>
        <Login
          role={Role.PUBLIC}
          title="Login with Singpass"
          placeholder="Enter NRIC"
        />
      </div>
      <AppStateList />
    </div>
  );
}
