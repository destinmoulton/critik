<template>
  {{name}}
</template>
<script setup>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faFolder} from '@fortawesome/free-regular-svg-icons';

defineProps({
  name: {
    type: String,
    required: true,
  }
});
</script>
