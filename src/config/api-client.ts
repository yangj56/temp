import axios from 'axios';
import { config } from 'config/app-config';

export const apiCLient = axios.create({
  baseURL: `${config.baseUrl}/data/api`,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar', 'app-id': config.dummyAPIId },
});
