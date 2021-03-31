import { LayoutDiv } from 'common/style';
import Card from 'react-bootstrap/Card';

export function SingleBanner() {
  return (
    <LayoutDiv>
      <Card className="bg-dark text-white">
        <Card.Img
          src="https://i.shgcdn.com/d95c31c2-d639-4018-8cb2-de2a00299b98/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
          alt="Card image"
        />
        <Card.ImgOverlay>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </Card.Text>
          <Card.Text>Last updated 3 mins ago</Card.Text>
        </Card.ImgOverlay>
      </Card>
    </LayoutDiv>
  );
}
