const googleMapsClient = require("@google/maps").createClient({
	key: "AIzaSyD59SFZWT5UjO4StmPUZFJb9HGukgSh4Go",
	Promise: Promise,
	rate: {
		limit: 10,
		period: 60000
	},
	retryOptions: {
		interval: 3000
	}
});

const reverseGeocodeLocation = (latitude, longitude, success, error) => {
	// https://googlemaps.github.io/google-maps-services-js/docs/LatLng.html
	// latitude first, longitude last
	googleMapsClient
		.reverseGeocode({
			latlng: [latitude, longitude]
		})
		.asPromise()
		.then(success)
		.catch(error);
};

const forwardGeocodeLocation = (locationText, success, error) => {
	googleMapsClient
		.geocode({
			address: locationText
		})
		.asPromise()
		.then(success)
		.catch(error);
};

module.exports = {
	reverseGeocodeLocation,
	forwardGeocodeLocation
};
