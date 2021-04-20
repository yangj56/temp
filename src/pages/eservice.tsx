import lifesg from 'assets/lifesg.png';
import mylegacy from 'assets/mylegacy.png';
import { Secondary } from 'common/layout/secondary';
import { Eservice } from 'contants';
import { setEservice } from 'features/poc/slices/user';
import { Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { AppDispatch } from 'store/store';

export function EService() {
  const searchParam = new URLSearchParams(window.location.search);
  const userId = searchParam.get('userid')!;

  const routerHistory = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Secondary>
      <div className="flex flex-row flex-wrap justify-start px-4 py-2">
        <Card
          style={{
            width: '18rem',
            marginTop: 10,
            marginBottom: 10,
            marginRight: 10,
          }}
        >
          <Card.Body>
            <Card.Text>{Eservice.BIRTH_REG}</Card.Text>
            <Button
              variant="primary"
              onClick={() => {
                dispatch(setEservice(Eservice.BIRTH_REG));
                routerHistory.push(`/dashboard?userid=${userId}`);
              }}
            >
              Enter
            </Button>
          </Card.Body>
        </Card>
        <Card style={{ width: '18rem', marginTop: 10, marginBottom: 10 }}>
          <Card.Body>
            <Card.Text>{Eservice.DEATH_CERT}</Card.Text>
            <Button
              variant="primary"
              onClick={() => {
                dispatch(setEservice(Eservice.DEATH_CERT));
                routerHistory.push(`/dashboard?userid=${userId}`);
              }}
            >
              Enter
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Secondary>
  );
}
