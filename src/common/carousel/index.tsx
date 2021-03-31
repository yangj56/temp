import { ImageWrapper } from 'common/carousel/styles';
import Carousel from 'react-bootstrap/Carousel';

export interface CarouselItems {
  id: string;
  image: string;
  title: string;
  description: string;
}

type Props = {
  carouselItems: CarouselItems[];
};

export function CustomizedCarousel({ carouselItems }: Props) {
  const enableCarousel = carouselItems?.length > 1;
  const data = carouselItems.map((carouselItem) => (
    <Carousel.Item key={carouselItem.id}>
      <ImageWrapper className="d-block w-100" src={carouselItem.image} />
      <Carousel.Caption>
        <h3>{carouselItem.title}</h3>
        <p>{carouselItem.description}</p>
      </Carousel.Caption>
    </Carousel.Item>
  ));
  return (
    <Carousel indicators={enableCarousel} controls={enableCarousel}>
      {data}
    </Carousel>
  );
}
