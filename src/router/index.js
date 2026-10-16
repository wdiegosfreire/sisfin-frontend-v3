
import User from "@/pages/user/User.vue";
import Vehicle from "@/pages/vehicle/Vehicle.vue";
import WishList from "@/pages/wishList/WishList.vue";
import Supermarket from "@/pages/supermarket/Supermarket.vue";

import Brand from "@/pages/supermarket/brand/Brand.vue";

import Account from "@/pages/transaction/account/Account.vue";
import Summary from "@/pages/transaction/summary/Summary.vue";
import Location from "@/pages/transaction/location/Location.vue";
import Objective from "@/pages/transaction/objective/Objective.vue";
import PaymentMethod from "@/pages/transaction/paymentMethod/PaymentMethod.vue";

import Bank from "@/pages/statement/bank/Bank.vue";
import Statement from "@/pages/statement/statement/Statement.vue";
import StatementType from "@/pages/statement/statementType/StatementType.vue";
import StatementPattern from "@/pages/statement/statementPattern/StatementPattern.vue";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", name: "user", component: User },
	{ path: "/vehicle", name: "vehicle", component: Vehicle },
	{ path: "/wishList", name: "wishList", component: WishList },
	{ path: "/supermarket", name: "supermarket", component: Supermarket },

	{ path: "/statement/bank", name: "bank", component: Bank },
	{ path: "/statement/statement", name: "statement", component: Statement },
	{ path: "/statement/statementType", name: "statementType", component: StatementType },
	{ path: "/statement/statementPattern", name: "statementPattern", component: StatementPattern },

	{ path: "/transaction/account", name: "account", component: Account },
	{ path: "/transaction/summary", name: "summary", component: Summary },
	{ path: "/transaction/location", name: "location", component: Location },
	{ path: "/transaction/objective", name: "objective", component: Objective },
	{ path: "/transaction/paymentMethod", name: "paymentMethod", component: PaymentMethod },

	{ path: "/supermarket/brand", name: "brand", component: Brand },
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
