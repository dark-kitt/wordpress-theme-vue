import { Commit, Getters } from 'vuex';

import callFetch from '@scripts/callFetch';

const fetchData = async (
  { commit, getters }: { commit: Commit; getters: Getters },
  { method = 'POST', endpoint }: { method: string; endpoint: string }
) => {
  // set loading state and fetch data
  commit('setLoading', true);
  let response: {
    [key: string]: unknown;
    code: string;
    data: {
      status: number;
    };
  } = await callFetch({ method, token: getters['getToken'], endpoint });

  // token error handling
  const { code, data } = response;
  if (code && code.includes('jwt_auth') && data.status && data.status !== 200) {
    // log process to console
    console.warn('REST-API: System request new API token.');

    // fetch new token if the old is expired
    const { role, token } = await callFetch<{ role: string; token: string }>({
      method: 'GET',
      endpoint: 'token'
    });

    if (role === 'rest_api_user' && token) {
      // commit new token and fetch data again
      await commit('setToken', token);
      response = await callFetch({ method, token, endpoint });
    }
  }

  commit('setLoading', false);
  return response ? response : false;
};

export default { fetchData };
