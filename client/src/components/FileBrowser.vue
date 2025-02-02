<template>
  <ul class="list-group">
    <li class="list-group-item" v-for="file in files" :key="file.name">{{ file.name }}</li>
  </ul>
</template>
<script>
import { mapState  } from 'vuex'

export default {
  computed: mapState({
    files: (state) => state.files.all,
  }),
  methods: {},
  created() {
    this.$store.dispatch('files/getAllFiles')
  },
}
</script>
