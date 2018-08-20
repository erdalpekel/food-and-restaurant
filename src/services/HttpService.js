export default class HttpService {
	static get(url, onSuccess, onError) {
		fetch(url, {
			method: "GET"
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
				onSuccess(resp);
			})
			.catch(e => {
				onError(e.message);
			});
	}
}
