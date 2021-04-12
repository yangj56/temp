import * as _ from 'lodash';

export function getValueFromEnv(
  key: string,
  defaultValue: string,
  disableWarrning = false
): string {
  // eslint-disable-next-line security/detect-object-injection
  const value = process.env[key] || defaultValue;
  if ((_.isNil(value) || value.length === 0) && !disableWarrning) {
    console.log(`Configuration key not found or empty: ${key}`);
  }
  return value;
}

export function getIntValueFromEnv(
  key: string,
  defaultValue?: number,
  disableWarrning = false
): number | undefined {
  const stringValue = getValueFromEnv(key, '', disableWarrning);
  if (_.isNil(stringValue)) {
    return defaultValue;
  }

  const intValue = parseInt(stringValue, 10);
  if (Number.isNaN(intValue)) {
    if (!disableWarrning) {
      console.log(
        `Configuration ${key} is not a valid integer: ${stringValue}`
      );
    }
    return defaultValue;
  }

  return intValue;
}

export const config = {
  baseUrl: getValueFromEnv('REACT_APP_BASE_URL', 'https://localhost.com'),
  dummyAPIId: getValueFromEnv('REACT_APP_DUMMPY_API_ID', '123'),
  serverUrl: getValueFromEnv('REACT_APP_SERVER_URL', 'https://localhost.com'),
};
