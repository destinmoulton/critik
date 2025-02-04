<template>
    <input disabled class="w-100" v-model="path" />
    <ul class="list-group">
        <li class="list-group-item">
            <a @click="this.changePath(parent_path)" class="ctk-directory-link">
                <Directory :name="'..'"></Directory>
            </a>
        </li>
        <li class="list-group-item" v-for="file in files" :key="file.name">
            <a
                v-if="file.is_directory"
                @click="this.changePath(file.fs_path)"
                class="ctk-directory-link"
            >
                <Directory :name="file.name"></Directory>
            </a>
            <a v-else class="ctk-file-link" @click="this.openFile(file.fs_path)">
                <File :name="file.name"></File>
            </a>
        </li>
    </ul>
</template>
<script>
import router from '@/router';
import { mapState, mapActions } from 'vuex';
import Directory from '@/components/FileBrowser/FiletypeDirectory.vue';
import File from '@/components/FileBrowser/FiletypeFile.vue';

export default {
    components: { Directory, File },
    computed: mapState({
        files: (state) => state.filebrowser.files,
        path: (state) => state.filebrowser.path,
        parent_path: (state) => state.filebrowser.parent_path,
    }),
    methods: {
        ...mapActions({
            changePath: 'filebrowser/changePath',
        }),
        openFile: (file_path) => {
            router.push({ name: 'view', params: { file: file_path } });
        },
    },
    created() {
        this.$store.dispatch('filebrowser/bindEvents');
    },
};
</script>
<style>
.ctk-directory-link {
    cursor: pointer;
    text-decoration: none;
}

.ctk-file-link {
    cursor: pointer;
    text-decoration: none;
}
</style>
