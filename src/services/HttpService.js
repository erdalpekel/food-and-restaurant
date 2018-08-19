export default class HttpService {
	static get(url, onSuccess, onError) {
		let token = window.localStorage["jwtToken"];

		let header = new Headers();

		if (token) {
			header.append("Authorization", `Bearer ${token}`);
		}

		fetch(url, {
			method: "GET",
			headers: header
		})
			.then(resp => {
				if (resp.ok) {
					return resp.json();
				} else {
					resp.json().then(json => {
						onError(json.error);
					});
				}
			})
			.then(resp => {
				if (resp.hasOwnProperty("token")) {
					window.localStorage["jwtToken"] = resp.token;
				}
				onSuccess(resp);
			})
			.catch(e => {
				onError(e.message);
			});
	}
}
