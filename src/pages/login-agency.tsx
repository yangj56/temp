import { Role } from 'contants';
import { Login } from 'features/poc/components/login';

export function LoginAgency() {
  return (
    <div>
      <Login role={Role.AGENCY} />
    </div>
  );
}
