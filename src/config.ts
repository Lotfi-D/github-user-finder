import { Config } from './types/config.types';

const config: Config = {
  api: {
    baseUrl: 'https://api.github.com',
    endpoints: {
      searchUsers: '/search/users?q=',
    },
  },
};

export default config
