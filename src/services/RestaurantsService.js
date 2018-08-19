import HttpService from "./HttpService";

export default class RestaurantsService {
	static baseURL() {
		return "http://localhost:3000/restaurant";
	}

	static query(parameters) {
		var query = "";

		if (parameters.searchQuery) {
			query += `name=${parameters.searchQuery}&`;
		}
		if (parameters.priceRangeSetStart) {
			query += `priceStart=${parameters.priceRangeSetStart}&`;
		}
		if (parameters.priceRangeSetEnd) {
			query += `priceEnd=${parameters.priceRangeSetEnd}&`;
		}
		if (parameters.latitude && parameters.longitude) {
			query += `latitude=${parameters.latitude}&longitude=${parameters.longitude}&`;
		}
		if (parameters.radius) {
			query += `radius=${parameters.radius}&`;
		}
		if (parameters.orderBy) {
			query += `orderBy=${parameters.orderBy}&`;
		}
		if (parameters.orderSequence) {
			query += `orderSequence=${parameters.orderSequence}&`;
		}
		if (parameters.offset) {
			query += `offset=${parameters.offset}&`;
		}
		if (parameters.limit) {
			query += `limit=${parameters.limit}&`;
		}
		if (parameters.isOrganic) {
			query += `isOrganic=${parameters.isOrganic}&`;
		}
		if (parameters.merchantTypes) {
			query += `merchantTypes=${parameters.merchantTypes}&`;
		}
		if (parameters.productCategory) {
			query += `productCategory=${parameters.productCategory}&`;
		}
		if (parameters.restaurantName) {
			query += `restaurantName=${parameters.restaurantName}&`;
		}

		return query;
	}

	static getRestaurantsWithFilters(parameters) {
		const queryURL = this.baseURL() + `/query?${this.query(parameters)}`;
		return new Promise((resolve, reject) => {
			HttpService.get(
				queryURL,
				function(data) {
					resolve(data);
				},
				function(textStatus) {
					reject(textStatus);
				}
			);
		});
	}

	static getRestaurantNamesInVicinity(parameters) {
		const queryURL = this.baseURL() + "/names?" + this.query(parameters);
		return new Promise((resolve, reject) => {
			HttpService.get(
				queryURL,
				function(data) {
					resolve(data);
				},
				function(textStatus) {
					reject(textStatus);
				}
			);
		});
	}
}
