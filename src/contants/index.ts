export enum WebPage {
  HOME = '/',
  ABOUT = '/about',
  CONTACT = '/contact',
  SPKIE = '/spike',
}
export type INavItem = {
  title: string;
  slug: string;
};

export const navItems: INavItem[] = [
  {
    title: 'Home',
    slug: '/',
  },
  {
    title: 'About',
    slug: WebPage.ABOUT,
  },
  {
    title: 'Contact Us',
    slug: WebPage.CONTACT,
  },
  {
    title: 'Spikes page',
    slug: WebPage.SPKIE,
  },
];

export enum QueryKey {
  USER_LIST = 'user_list',
}
