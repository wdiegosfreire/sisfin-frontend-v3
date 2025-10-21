import User from "@/pages/user/User.vue";
import Summary from "@/pages/summary/Summary.vue";
import Vehicle from "@/pages/vehicle/Vehicle.vue";
import Location from "@/pages/location/Location.vue";
import WishList from "@/pages/wishList/WishList.vue";
import Supermarket from "@/pages/supermarket/Supermarket.vue";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", name: "user", component: User },
	{ path: "/summary", name: "summary", component: Summary },
	{ path: "/vehicle", name: "vehicle", component: Vehicle },
	{ path: "/location", name: "location", component: Location },
	{ path: "/wishList", name: "wishList", component: WishList },
	{ path: "/supermarket", name: "supermarket", component: Supermarket },
//   { path: "/objective", name: "objective", component: Objective },
//   { path: "/statement", name: "statement", component: Statement },
//   { path: "/account", name: "account", component: Account },
//   { path: "/paymentMethod", name: "paymentMethod", component: PaymentMethod },
//   { path: "/bank", name: "bank", component: Bank },
//   { path: "/statementType", name: "statementType", component: StatementType },
//   { path: "/statementPattern", name: "statementPattern", component: StatementPattern },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
	if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
		if (localStorage.getItem("vuetify:dynamic-reload")) {
			console.error("Dynamic import error, reloading page did not fix it", err)
		}
		else {
			console.log("Reloading page to fix dynamic import error")
			localStorage.setItem("vuetify:dynamic-reload", "true")
			location.assign(to.fullPath)
		}
	}
	else {
		console.error(err)
	}
})

router.isReady().then(() => {
	localStorage.removeItem("vuetify:dynamic-reload")
})

export default router
