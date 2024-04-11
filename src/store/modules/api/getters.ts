import { State } from 'vuex';

const getToken = (state: State) => state.token;

export default { getToken };
