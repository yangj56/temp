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

export enum Eservice {
  BIRTH_REG = 'Birth Registration',
  DEATH_CERT = 'Death Certification',
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
  GENERATE_ASYM_KEY = "Generating user's asymmetric key",
  ENCRYPT_PRIVATE_KEY_WITH_PASSWORD = "Encrypting user's private key",
  DECRYPT_PRIVATE_KEY_PASSWORD = 'Decrypting your private key with password',
  ENCRYPT_FILE = 'Encrypting your file',
  ENCRYPT_FILE_WITH_DATA_KEY = 'Encrypting the uploaded file with data key',
  ENCRYPT_DATA_KEY_AGENCY_PUB_KEY = 'Encrypting the data key with agency public key',
  ENCRYPT_DATA_KEY_WITH_PIN = 'Encrypting the data key with pins',
  DECRYPT_FILE = 'Decrypting your file',
  DECRYPT_FILE_WITH_DATA_KEY = 'Decrypting your file with data key',
  ENCRYPT_DATA_KEY = 'Encrypting data key',
  ENCRYPT_DATA_KEY_WITH_USER_PUB_KEY = 'Encrypting data key with sharee public key',
  DECRYPT_DATA_KEY = 'Decrypting data key with private key',
  RETRIEVE_ALL_FILE = 'Retrieving all the visible files that belong to the user',
  RETRIEVE_ENCRYPTED_FILE = 'Retrieving the encrypted file',
  RETRIEVE_ENCRYPTED_DATA_KEY = 'Retrieving the encrypted data key',
  RETRIEVE_USER_DATA = 'Retrieving user data(pub key, encrypted private key, iv, salt)',
  RETRIEVE_SHAREE_PUBLIC_KEY = 'Retrieving sharee public key',
  RETRIEVE_USER_PRIVATEKEY = 'Retrieving user data',
  UPLOADING_ENCRYPTED_PRIVATE_KEY = "Uploading user's encrypted private file",
  UPLOADING_ENCRYPTED_FILE = 'Uploading encrypted file',
  UPLOADING_ENCRYPTED_DATA_KEY = 'Uploading encrypted data key file',
  SHARE_FILE_TO_USER = 'Upload encrypted data key',
  PREPARE_FILE_FOR_DOWNLOAD = 'Prompting file for download',
  IDLE = 'Idle',
  ACTION_LOGIN = '[Action] Login',
  ACTION_RETRIEVAL_FILE = '[Action] Retrieve files',
  ACTION_DOWNLOAD = '[Action] Download',
  ACTION_UPLOAD = '[Action] Upload',
  ACTION_SHARE_ONBOARDED_USER = '[Action] Share to onboarded user',
  ACTION_SHARE_NON_ONBOARDED_USER = '[Action] Share to non-onboarded user',
  ACTION_SHARE_FILE = '[Action] Share file',
}
