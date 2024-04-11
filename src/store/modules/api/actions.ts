import { State, Commit, Getters } from 'vuex';

const fetchToken = async ({ state, commit }: { state: State; commit: Commit }) => {
  commit('setLoading', true);
  let validation = false;
  // prevent unnecessary request
  // validate if token is not default value
  if (state.token !== 'TOKEN') {
    const validateData = await fetch(`${process.env.REST_API}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${state.token}`,
        'Content-Type': 'application/json'
      }
    });

    const { data } = await validateData.json();
    validation = data.status === 200 ? true : false;
  }

  if (validation) return true;

  // fetch token
  const tokenData = await fetch(`${process.env.REST_API}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: process.env.REST_USER,
      password: process.env.REST_PASSWORD
    })
  });

  const { token } = await tokenData.json();
  if (token) {
    commit('setToken', token);
    return true;
  }

  commit('setLoading', false);
  return false;
};

const fetchData = async (
  { commit, getters }: { commit: Commit; getters: Getters },
  endpoint: string
) => {
  const token = getters['getToken'];
  const response = await fetch(`${process.env.REST_API}/wp-json/example/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  commit('setLoading', false);

  return data ? data : false;
};

export default { fetchToken, fetchData };
