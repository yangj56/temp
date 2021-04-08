import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { CardProp } from 'typing';

type Props = {
  cards: CardProp[];
};

export function MultipleBanner({ cards }: Props) {
  const cardComponents = cards.map((item, index) => (
    <Card className="bg-dark text-white" key={`card-item-${index}`}>
      <Card.Img src={item.image} alt={item.imageAlt} />
      <Card.ImgOverlay>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <Card.Text>{item.subText}</Card.Text>
      </Card.ImgOverlay>
    </Card>
  ));
  return (
    <CardGroup className="flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row">
      {cardComponents}
    </CardGroup>
  );
}
