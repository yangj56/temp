import { LayoutDiv } from 'common/style';

type Props = {
  title: string;
};

export function AnnouncementBar({ title }: Props) {
  return <LayoutDiv>{title}</LayoutDiv>;
}
