import { Commit, Getters } from 'vuex';

import callFetch from '@scripts/callFetch';

const fetchData = async (
  { commit, getters }: { commit: Commit; getters: Getters },
  { method = 'POST', endpoint }: { method: string; endpoint: string }
) => {
  // set loading state and fetch data
  commit('setLoading', true);
  let response = await callFetch<{ [key: string]: unknown }>({
    method,
    token: getters['getToken'],
    endpoint
  });

  // JWT Authentication error handling
  const { code, data } = response as { code: string; data: { status: number } };
  if (code?.includes('jwt_auth') && data?.status !== 200) {
    // log process to console
    console.warn('REST-API: System request new API token.');

    // fetch new token if the old is invalid
    const { role, token } = await callFetch<{ role: string; token: string }>({
      method: 'GET',
      endpoint: 'token'
    });

    if (role === 'rest_api_user' && token) {
      // commit new token and fetch data again
      await commit('setToken', token);
      response = await callFetch<{ [key: string]: unknown }>({ method, token, endpoint });
    }
  }

  commit('setLoading', false);
  return response ? response : false;
};

export default { fetchData };
