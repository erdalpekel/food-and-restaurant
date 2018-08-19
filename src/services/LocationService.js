export default class LocationService {
	static getCurrentPosition(success, error, highAccuracy) {
		if (navigator.geolocation) {
			console.log("geolocation supported");
			const geoOptions = highAccuracy
				? {
						enableHighAccuracy: true
				  }
				: {};
			return navigator.geolocation.getCurrentPosition(success, error, geoOptions);
		} else {
			console.log("Couldn't get user location");
		}
	}
}
