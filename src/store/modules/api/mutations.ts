import { State } from 'vuex';

const setToken = (state: State, token: string) => {
  state.token = token;
};

const setLoading = (state: State, loading: string) => {
  state.loading = loading;
};

export default { setToken, setLoading };
