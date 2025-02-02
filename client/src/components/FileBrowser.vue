
<template>
  <ul class="list-group">
    <li class="list-group-item" v-for="file in files" :key="file.name">
      <span v-if="file.is_directory"><Directory :name="file.name"></Directory></span>
      <span v-else><File :name="file.name"></File></span>
    </li>
  </ul>
</template>
<script>
import { mapState  } from 'vuex'
import Directory from '@/components/FileBrowser/FiletypeDirectory.vue'
import File from '@/components/FileBrowser/FiletypeFile.vue'

export default {
  components: { Directory, File},
  computed: mapState({
    files: (state) => state.files.all,
  }),
  methods: {},
  created() {
    this.$store.dispatch('files/getAllFiles')
  },
}
</script>
