import filesapi from '../../api/filesystem.js';

const state = ()=> ({
  all:[]
});

const actions = {
  async getAllFiles({commit}){
    const files = await filesapi.getFiles();
    commit('setFiles',files);
  }
}

const mutations = {
  setFiles(state, files){
    state.all = files;
  }
}

const getters = {};

export default{
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
