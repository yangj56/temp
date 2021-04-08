import Card from 'react-bootstrap/Card';
import { CardProp } from 'typing';

type Props = {
  card: CardProp;
};

export function SingleBanner({ card }: Props) {
  const { title, description, subText, image, imageAlt } = card;
  return (
    <Card className="bg-dark text-white">
      <Card.Img src={image} alt={imageAlt} />
      <Card.ImgOverlay>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text>{subText}</Card.Text>
      </Card.ImgOverlay>
    </Card>
  );
}
