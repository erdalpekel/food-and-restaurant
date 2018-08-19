import React from "react";
import PropTypes from "prop-types";
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";

class Map extends React.Component {
	static defaultZoomLevel = 17;

	constructor(props) {
		super(props);
	}

	render() {
		const GoogleMapExample = withGoogleMap(props => (
			<GoogleMap
				defaultCenter={{ lat: this.props.latitude, lng: this.props.longitude }}
				defaultZoom={Map.defaultZoomLevel}
			>
				{this.props.isMarkerShown && (
					<Marker position={{ lat: this.props.latitude, lng: this.props.longitude }}>
						{this.props.isInfoWindowOpen &&
							this.props.isInfoWindowOpen !== false &&
							this.props.infoWindowAddress && (
								<InfoWindow>
									<span>
										<h3>{this.props.infoWindowTitle}</h3>
										<p>{this.props.infoWindowAddress}</p>
									</span>
								</InfoWindow>
							)}
					</Marker>
				)}
			</GoogleMap>
		));

		return (
			<div
				style={{
					height: 400,
					width: "100%",
					display: "flex",
					flexFlow: "row nowrap",
					justifyContent: "center",
					padding: 0
				}}
			>
				<GoogleMapExample
					containerElement={<div style={{ width: "100%", marginLeft: 0 }} />}
					mapElement={<div style={{ height: `100%` }} />}
				/>
			</div>
		);
	}
}

Map.propTypes = {
	latitude: PropTypes.number.isRequired,
	longitude: PropTypes.number.isRequired,
	isMarkerShown: PropTypes.bool.isRequired,
	isInfoWindowOpen: PropTypes.bool,
	infoWindowTitle: PropTypes.string.isRequired,
	infoWindowAddress: PropTypes.string.isRequired
};

export default Map;
