export enum WebPage {
  HOME = '/',
  ABOUT = '/about',
  CONTACT = '/contact',
  SPKIE = '/spike',
  SUBPAGE1 = '/subpage1',
  SUBPAGE2 = '/subpage2',
}

export type INavDropdownItem = {
  dropdownTitle: string;
  dropdownSlug: string;
};

export type INavItem = {
  title: string;
  slug?: string;
  id?: string;
  dropdownItems?: INavDropdownItem[];
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
    id: 'contact-us-subpages',
    dropdownItems: [
      {
        dropdownTitle: 'contact details',
        dropdownSlug: WebPage.CONTACT,
      },
      {
        dropdownTitle: 'subpage 2',
        dropdownSlug: WebPage.SUBPAGE2,
      },
    ],
  },
  {
    title: 'Spikes page',
    slug: WebPage.SPKIE,
  },
];

export enum QueryKey {
  USER_LIST = 'user_list',
}
