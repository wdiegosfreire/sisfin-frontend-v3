import maintenanceApiInstance from "./maintenanceApiInstance";

export default {
	name: "maintenanceApi",
	methods: {
		$_maintenance_get(url) {
			return maintenanceApiInstance.get(url);
		},
		$_maintenance_post(url, data) {
			return maintenanceApiInstance.post(url, data);
		},
		$_maintenance_put(url, data) {
			return maintenanceApiInstance.put(url, data);
		},
		$_maintenance_delete(url) {
			return maintenanceApiInstance.delete(url);
		}
	}
}