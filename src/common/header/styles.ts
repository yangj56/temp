import styled from 'styled-components';
import tw from 'twin.macro';

export const HeaderWrapper = styled.div`
  ${tw`flex flex-wrap items-center justify-between w-full`};
`;

export const Title = styled.h3`
  ${tw`text-lg sm:text-xl font-semibold text-black`};
`;
