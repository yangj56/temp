import { NavBar1 } from 'common/header/navbar';
import { HeaderWrapper, Title } from 'common/header/styles';
import { LayoutDiv, PrimaryColorBg } from 'common/style';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => (
  <PrimaryColorBg>
    <LayoutDiv>
      <HeaderWrapper>
        <Link to="/">
          <Title>{title}</Title>
        </Link>
        <NavBar1 />
      </HeaderWrapper>
    </LayoutDiv>
  </PrimaryColorBg>
);
