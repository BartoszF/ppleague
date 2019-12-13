import { ACCESS_TOKEN } from './constants';

export function request(options) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });


  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append('Authorization', `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`);
  }

  const defaults = { headers };
  options = { ...defaults, ...options };

  const response = fetch(`/api${options.url}`, options);
  const json = response.json();
  if (!response.ok) {
    return Promise.reject(json);
  }
  return json;
}
