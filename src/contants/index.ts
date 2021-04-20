export enum WebPage {
  HOME = '/',
  ABOUT = '/about',
  CONTACT = '/contact',
  SPKIE = '/spike',
  LOGIN_AGENCY = '/agency-login',
  LOGIN_PUBLIC = '/public-login',
  SUBPAGE1 = '/subpage1',
  SUBPAGE2 = '/subpage2',
  DASHBOARD = '/dashboard',
  FILEURL = '/file-url',
  ESERVICES = '/eservice',
  FILE_SHARE = '/file-share',
  LOGIN_FILE_SHARE = '/file-share-login',
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
];

export enum QueryKey {
  USER_LIST = 'user_list',
  LOGIN = 'login',
  ALL_FILE = 'all_file',
  USER_EXIST = 'user_exist',
}

export enum Role {
  PUBLIC = 'user',
  AGENCY = 'agency',
}

export enum AppState {
  GENERATE_DATA_KEY = 'Generating Data key',
  GENERATE_ASYM_KEY = 'Generating asymmetric key',
  ENCRYPT_PRIVATE_KEY_WITH_PASSWORD = 'Encrypting your private key',
  DECRYPT_PRIVATE_KEY_PASSWORD = 'Decrypting your private key',
  ENCRYPT_FILE = 'Encrypting your file',
  DECRYPT_FILE = 'Decrypting your file',
  ENCRYPT_DATA_KEY = 'Encrypting data key',
  DECRYPT_DATA_KEY = 'Decrypting data key',
  UPLOADING_ENCRYPTED_PRIVATE_KEY = 'Uploading encrypted private file',
  UPLOADING_ENCRYPTED_FILE = 'Uploading encrypted file',
  UPLOADING_ENCRYPTED_DATA_KEY = 'Uploading encrypted data key file',
  IDLE = 'Idle',
}
