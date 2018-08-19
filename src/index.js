import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import WebFontLoader from "webfontloader";
import "react-md/dist/react-md.indigo-pink.min.css";

WebFontLoader.load({
	google: {
		families: ["Roboto:300,400,500,700", "Material Icons"]
	}
});

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
