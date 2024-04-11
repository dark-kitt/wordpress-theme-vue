import state, { ApiTypes as ApiStateTypes } from './states';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

export interface ApiTypes extends ApiStateTypes {}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
