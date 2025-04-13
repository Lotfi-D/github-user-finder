export type HandledError = {
  type: 'rate_limit' | 'unauthorized' | 'forbidden' | 'not_found' | 'server_error' | 'unknown';
  message: string;
};
