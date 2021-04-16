export enum WebPage {
  HOME = '/',
  ABOUT = '/about',
  CONTACT = '/contact',
  SPKIE = '/spike',
  LOGIN_AGENCY = '/agency-login',
  LOGIN_PUBLIC = '/agency-public',
  SUBPAGE1 = '/subpage1',
  SUBPAGE2 = '/subpage2',
  DASHBOARD = '/dashboard',
  FILEURL = '/file-url'
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
  // {
  //   title: 'Contact Us',
  //   id: 'contact-us-subpages',
  //   dropdownItems: [
  //     {
  //       dropdownTitle: 'contact details',
  //       dropdownSlug: WebPage.CONTACT,
  //     },
  //     {
  //       dropdownTitle: 'subpage 2',
  //       dropdownSlug: WebPage.SUBPAGE2,
  //     },
  //   ],
  // },
  {
    title: 'Login (Agency)',
    slug: WebPage.LOGIN_AGENCY,
  },
  {
    title: 'Login (Public)',
    slug: WebPage.LOGIN_PUBLIC,
  },
  {
    title: 'File-URL',
    slug: WebPage.FILEURL
  }
];

export enum QueryKey {
  USER_LIST = 'user_list',
  LOGIN = 'login',
  ALL_FILE = 'all_file',
}

export enum Role {
  PUBLIC = 'user',
  AGENCY = 'agency',
}
