import { MainLayout } from 'common/layout/main';
import { FakeLogin } from 'features/poc/fake-login';

export default function Poc() {
  return (
    <MainLayout>
      <div className="w-full flex justify-center my-40">
        <FakeLogin />
      </div>
    </MainLayout>
  );
}
