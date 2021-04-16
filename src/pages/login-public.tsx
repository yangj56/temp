import { Role } from 'contants';
import { Login } from 'features/poc/components/login';

export function LoginPublic() {
  return (
    <div>
      <Login role={Role.PUBLIC} />
    </div>
  );
}
