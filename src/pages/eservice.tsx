import { Secondary } from 'common/layout/secondary';
import { Button, Card } from 'react-bootstrap';
import { useHistory } from 'react-router';
import mylegacy from 'assets/mylegacy.png';
import lifesg from 'assets/lifesg.png';

export function EService() {
  const searchParam = new URLSearchParams(window.location.search);
  const userId = searchParam.get('userid')!;

  const routerHistory = useHistory();

  return (
    <Secondary>
      <div className="flex flex-row flex-wrap justify-between px-4 py-2">
        <Card style={{ width: '18rem', marginTop: 10, marginBottom: 10 }}>
          <Card.Img variant="top" src={mylegacy} />
          <Card.Body>
            <Card.Text>MyLegacy</Card.Text>
            <Button
              variant="primary"
              onClick={() => {
                routerHistory.push(`/dashboard?userid=${userId}`);
              }}
            >
              View
            </Button>
          </Card.Body>
        </Card>
        <Card style={{ width: '18rem', marginTop: 10, marginBottom: 10 }}>
          <Card.Img variant="top" src={lifesg} />
          <Card.Body>
            <Card.Text>LifeSG</Card.Text>
            <Button
              variant="primary"
              onClick={() => {
                routerHistory.push(`/dashboard?userid=${userId}`);
              }}
            >
              View
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Secondary>
  );
}
