import { ApiTypes } from './states';

const setToken = (state: ApiTypes, token: string) => {
  state.token = token;
};

const setLoading = (state: ApiTypes, loading: boolean) => {
  state.loading = loading;
};

export default { setToken, setLoading };
