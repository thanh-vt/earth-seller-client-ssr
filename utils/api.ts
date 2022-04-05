// eslint-disable-next-line import/no-mutable-exports,import/named
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosResponse } from 'axios'

export interface TokenResponse {
  // eslint-disable-next-line camelcase
  access_token: string;
  // eslint-disable-next-line camelcase
  expires_in: number;
  // eslint-disable-next-line camelcase
  refresh_expires_in: number;
  // eslint-disable-next-line camelcase
  refresh_token: string;
  // eslint-disable-next-line camelcase
  token_type: 'Bearer ';
  // eslint-disable-next-line camelcase
  id_token: string;
  'not-before-policy': number;
  // eslint-disable-next-line camelcase
  session_state: string;
  scope: string;
}

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
  // Request interceptor for API calls
  $axios.interceptors.request.use(
    (config) => {
      const token = getLocalAccessToken();
      config.headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// response parse
  $axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const axiosResponse = await refreshToken();
        storeToken(axiosResponse.data);
        $axios.defaults.headers.common.Authorization = `Bearer ${axiosResponse.data.access_token}`;
        return $axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
}

// get token o localStorage
export function getLocalAccessToken(): string {
  const token = window.localStorage.getItem('accessToken');
  console.log('token >>>', token);
  return token || '';
}

// get token o refreshToken
export function getLocalRefreshToken() {
  return window.localStorage.getItem('refreshToken');
}

export function storeToken(tokenResponse: TokenResponse) {
  window.localStorage.setItem('accessToken', tokenResponse.access_token);
  window.localStorage.setItem('refreshToken', tokenResponse.refresh_token);
}

export function getAccessToken(): Promise<AxiosResponse<TokenResponse>> {
  return $axios.post<TokenResponse>(
    '/token',
    {
      // eslint-disable-next-line camelcase
      grant_type: 'password',
      scope: 'openid',
      username: process.env.KEYCLOAK_CLIENT_ID,
      password: process.env.KEYCLOAK_CLIENT_SECRET,
    },
    { baseURL: process.env.KEYCLOAK_BASE_URL }
  ).then((res) => {
    storeToken(res.data);
    return res;
  });
}

export function refreshToken(): Promise<AxiosResponse<TokenResponse>> {
  return $axios.post<TokenResponse>(
    '/token',
    {
      // eslint-disable-next-line camelcase
      grant_type: 'refresh_token',
      scope: 'openid',
      refreshToken: getLocalRefreshToken(),
    },
    { baseURL: process.env.KEYCLOAK_BASE_URL }
  );
}

export { $axios }
