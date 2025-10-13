<template>
	<v-app>
		<structure />
		<loading />
	</v-app>
</template>

<script>
import { useAppStore } from '@/stores/app';

import Loading from "./components/loading/Loading.vue";
import Structure from './pages/structure/Structure.vue';
import apiConfig from "./components/axios/common/apiConfig.js";

export default {
	name: 'App',
	components: { Loading, Structure },

	mixins: [ apiConfig ],

	created() {
		this.createInterceptors();

		if (window.localStorage.sessionToken) {
			useAppStore().setUserName(window.localStorage.userName);
			useAppStore().setUserIdentity(window.localStorage.userIdentity);
			useAppStore().setSessionToken(window.localStorage.sessionToken);
		}
		else {
			useAppStore().setUserName("");
			useAppStore().setUserIdentity("");
			useAppStore().setSessionToken("");

			this.$router.push("/");
		}
	}
};
</script>
