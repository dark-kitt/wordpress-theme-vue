import states, { ApiTypes as ApiStateTypes } from './states';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

export type ApiTypes = ApiStateTypes;

export default {
  namespaced: true,
  states,
  mutations,
  getters,
  actions
};
