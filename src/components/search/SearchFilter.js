import React from "react";
import PropTypes from "prop-types";
import {
	Card,
	CardTitle,
	CardText,
	CardActions,
	Button,
	FontIcon,
	Autocomplete,
	Slider,
	TextField,
	Avatar,
	SelectionControl,
	SelectionControlGroup,
	LinearProgress,
	Chip
} from "react-md";
import LocationService from "services/LocationService";
import RestaurantsService from "services/RestaurantsService";
import { reverseGeocodeLocation, forwardGeocodeLocation } from "services/MapsService";
import { debounce } from "utilities";

export default class SearchFilter extends React.Component {
	static sliderDebounceTime = 500;
	static textFieldDebounceTime = 500;
	static maxLocationLabelLength = 20;

	constructor(props) {
		super(props);

		this.state = {
			restaurantNamesAutocompleteSuggestions: [],
			userLocationAutocompleteSuggestions: [],
			locationText: null,
			userLocationGeocoded: null,
			gps_querying: false,
			gps_failed: false
		};
	}

	reverseGeoCodeWrapper = (latitude, longitude) => {
		reverseGeocodeLocation(
			latitude,
			longitude,
			response => {
				console.log(response.json);
				if (typeof response.json.results !== "undefined" && response.json.results.length > 0) {
					const firstResultAddress = response.json.results[0].formatted_address;
					this.setState({
						userLocationGeocoded: firstResultAddress,
						gps_failed: false
					});
				}
			},
			error => {
				console.error(error);
			}
		);
	};

	forwardGeoCodeWrapper = userLocationText => {
		forwardGeocodeLocation(
			userLocationText,
			response => {
				console.log(response.json);
				if (typeof response.json.results !== "undefined" && response.json.results.length > 0) {
					var resultsList = [];
					for (const result_index in response.json.results) {
						const result = response.json.results[result_index];
						resultsList.push({
							_id: result_index,
							latitude: result.geometry.location.lat,
							longitude: result.geometry.location.lng,
							name: result.formatted_address
						});
						console.log(result);
					}
					console.log(resultsList);

					this.setState({
						userLocationAutocompleteSuggestions: resultsList
					});
				}
			},
			error => {
				console.error(error);
			}
		);
	};

	getUsersPosition = () => {
		this.setState(
			{
				gps_querying: true
			},
			() => {
				LocationService.getCurrentPosition(
					position => {
						this.props.onLocationChange(position.coords.latitude, position.coords.longitude);
						this.reverseGeoCodeWrapper(position.coords.latitude, position.coords.longitude);
						this.setState({
							gps_querying: false,
							gps_failed: false
						});
					},
					error => {
						this.setState({
							gps_querying: false,
							gps_failed: true
						});
						console.error(error);
					},
					true
				);
			}
		);
	};

	getRestaurantNames = () => {
		const queryParameters = {
			latitude: this.props.latitude,
			longitude: this.props.longitude,
			radius: this.props.radius
		};
		console.log("queryParameters restaurant names request: ", queryParameters);

		RestaurantsService.getRestaurantNamesInVicinity(queryParameters)
			.then(response => {
				console.log(response);
				if (typeof response !== "undefined" && response.length > 0) {
					//set default empty value if the user wants to unselect restaurant
					var resultsList = [""];
					for (const result_index in response) {
						const result = response[result_index];
						resultsList.push({
							_id: result_index,
							name: result.restaurant.name
						});
						console.log(result);
					}
					console.log(resultsList);
					this.setState({
						restaurantNamesAutocompleteSuggestions: resultsList
					});
				}
			})
			.catch(e => {
				console.error(e);
			});
	};

	componentDidMount() {
		this.getRestaurantNames();
	}

	handleRadiusSliderChange = debounce(inputValue => {
		this.props.onRadiusChange(inputValue);
	}, SearchFilter.sliderDebounceTime);

	handleUserLocationTextChange = debounce(userLocationText => {
		this.setState(
			{
				locationText: userLocationText
			},
			() => {
				this.forwardGeoCodeWrapper(userLocationText);
			}
		);
	}, SearchFilter.textFieldDebounceTime);

	handleUserLocationTextAutocomplete = (...autocompleteArray) => {
		const selectedItemData = autocompleteArray[2];
		if (typeof selectedItemData !== "undefined" && selectedItemData.length > 0) {
			const selectedItemDataFirst = selectedItemData[0];
			const latitude = selectedItemDataFirst.latitude;
			const longitude = selectedItemDataFirst.longitude;

			this.props.onLocationChange(latitude, longitude);
			this.reverseGeoCodeWrapper(latitude, longitude);
		}
	};

	handleUserLocationReset = () => {
		this.setState({
			userLocationAutocompleteSuggestions: [],
			locationText: null,
			userLocationGeocoded: null
		});
		// parent view need to refresh search list query parameters and items so notify it here
		this.props.onUserLocationReset();
	};

	handlePriceStartTextChange = inputValues => {
		this.props.onPriceStartChange(inputValues);
	};

	handlePriceEndTextChange = inputValues => {
		this.props.onPriceEndChange(inputValues);
	};

	handlePriceRangeReset = () => {
		this.props.onPriceRangeReset();
	};

	handleIsOrganicSwitched = value => {
		this.props.onIsOrganicSwitched(value);
	};

	handleMerchantTypesClick = values => {
		this.props.onMerchantTypesClicked(values);
	};

	handleRestaurantNameTextAutocomplete = (...autocompleteArray) => {
		const selectedItemData = autocompleteArray[2];
		if (typeof selectedItemData !== "undefined" && selectedItemData.length > 0) {
			const selectedItemDataFirst = selectedItemData[0];
			const name = selectedItemDataFirst.name;
			this.props.onRestaurantNameChange(name);
		}
	};

	render() {
		let address = undefined;
		let city = undefined;
		let country = undefined;
		if (this.state.userLocationGeocoded) {
			const values = this.state.userLocationGeocoded.split(",");
			address =
				values[0] !== void 0
					? values[0].substr(0, SearchFilter.maxLocationLabelLength) +
					  (values[0].length > SearchFilter.maxLocationLabelLength ? ".." : "")
					: undefined;
			city =
				values[1] !== void 0
					? values[1].substr(0, SearchFilter.maxLocationLabelLength) +
					  (values[1].length > SearchFilter.maxLocationLabelLength ? ".." : "")
					: undefined;
			country =
				values[2] !== void 0
					? values[2].substr(0, SearchFilter.maxLocationLabelLength) +
					  (values[2].length > SearchFilter.maxLocationLabelLength ? ".." : "")
					: undefined;
		}

		return (
			<div>
				<Card id="location-card" raise className="md-block-centered search-filter-card">
					<CardTitle
						title="Location"
						avatar={
							<Avatar
								suffix={this.props.latitude ? "indigo" : "grey"}
								icon={<FontIcon>location_searching</FontIcon>}
							/>
						}
					/>
					{!this.props.latitude ? (
						<CardActions className="md-block-centered">
							<Button flat primary iconChildren="my_location" onClick={this.getUsersPosition}>
								Find location
							</Button>
						</CardActions>
					) : null}
					{this.state.gps_querying === true ? <LinearProgress id="user-gps-query-loading-progress" /> : null}
					<CardActions>
						{this.props.latitude ? (
							<CardText>
								{address === undefined && city === undefined && country === undefined ? (
									<span>
										<FontIcon primary>location_on</FontIcon>
										{this.state.userLocationGeocoded}
									</span>
								) : null}

								{address !== undefined ? (
									<Chip
										label={address}
										avatar={<Avatar icon={<FontIcon>location_on</FontIcon>} suffix="indigo" />}
									/>
								) : null}
								{city !== undefined ? (
									<Chip
										label={city}
										avatar={<Avatar icon={<FontIcon>location_city</FontIcon>} suffix="indigo" />}
									/>
								) : null}
								{country ? (
									<Chip
										label={country}
										avatar={<Avatar icon={<FontIcon>terrain</FontIcon>} suffix="indigo" />}
									/>
								) : null}
							</CardText>
						) : null}
					</CardActions>
					{this.props.latitude ? (
						<CardText>
							<Slider
								id="location-card-slider"
								defaultValue={this.props.defaultRadius}
								onChange={this.handleRadiusSliderChange}
								min={1}
								max={20}
								discrete
								label={"Searching within " + this.props.radius + " KM"}
							/>
						</CardText>
					) : null}
					{this.props.latitude ? (
						<CardActions>
							<Button flat secondary onClick={this.handleUserLocationReset} className="md-block-centered">
								reset location
							</Button>
						</CardActions>
					) : null}

					{this.state.gps_failed === true ? (
						<CardActions>
							<Button flat secondary className="md-block-centered">
								Location request failed!
							</Button>
						</CardActions>
					) : null}
					{this.state.gps_failed === true ? (
						<CardActions className="md-block-centered">
							<Autocomplete
								id="user-location-search-textfield"
								type="search"
								// lineDirection="right"
								placeholder="alternatively: type location"
								onChange={this.handleUserLocationTextChange}
								data={this.state.userLocationAutocompleteSuggestions}
								dataLabel="name"
								deleteKeys={["_id", "latitude", "longitude"]}
								filter={Autocomplete.caseInsensitiveFilter}
								onAutocomplete={this.handleUserLocationTextAutocomplete}
							/>
						</CardActions>
					) : null}
				</Card>
				<Card id="price-card" raise className="search-filter-card">
					<CardTitle
						title="Price"
						avatar={
							<Avatar
								suffix={this.props.priceRangeSetStart || this.props.priceRangeSetEnd ? "amber" : "grey"}
								icon={<FontIcon>euro_symbol</FontIcon>}
							/>
						}
					/>
					<CardActions>
						<TextField
							id="price-start-text"
							fullWidth={false}
							type="number"
							step={0.1}
							label="start price"
							onChange={this.handlePriceStartTextChange}
							value={this.props.priceRangeSetStart}
						/>
						<TextField
							id="price-end-text"
							fullWidth={false}
							type="number"
							step={0.1}
							label="end price"
							onChange={this.handlePriceEndTextChange}
							value={this.props.priceRangeSetEnd}
						/>
					</CardActions>
					{this.props.priceRangeSetStart || this.props.priceRangeSetEnd ? (
						<CardActions>
							<Button flat secondary onClick={this.handlePriceRangeReset} className="md-block-centered">
								reset price range
							</Button>
						</CardActions>
					) : null}
				</Card>
				<Card id="restaurants-card" raise className="search-filter-card">
					<CardTitle
						title="Restaurant"
						avatar={
							<Avatar
								suffix={this.props.restaurantName || this.props.restaurantName ? "lime" : "grey"}
								icon={<FontIcon>fastfood</FontIcon>}
							/>
						}
					/>
					<CardActions className="md-block-centered">
						<Autocomplete
							id="user-location-search-textfield"
							type="search"
							lineDirection="right"
							placeholder="restaurant name"
							data={this.state.restaurantNamesAutocompleteSuggestions}
							dataLabel="name"
							deleteKeys={["_id"]}
							filter={Autocomplete.caseInsensitiveFilter}
							onAutocomplete={this.handleRestaurantNameTextAutocomplete}
						/>
					</CardActions>
				</Card>
				<Card id="is-organic-card" raise className="search-filter-card">
					<CardTitle
						title="Organic Label"
						avatar={
							<Avatar
								suffix={this.props.isOrganic ? "light-green" : "grey"}
								icon={<FontIcon>nature</FontIcon>}
							/>
						}
						expander
					/>
					<CardActions expandable>
						<SelectionControl
							id="is-organic-checkbox"
							name="is organic checkbox"
							aria-label="is organic"
							type="switch"
							onChange={this.handleIsOrganicSwitched}
						/>
					</CardActions>
				</Card>
				<Card raise className="search-filter-card">
					<CardTitle
						title="Merchant Type"
						avatar={
							<Avatar
								suffix={
									this.props.merchantTypes !== undefined && this.props.merchantTypes.length > 0
										? "deep-orange"
										: "grey"
								}
								icon={<FontIcon>store</FontIcon>}
							/>
						}
						expander
					/>
					<CardActions expandable>
						<SelectionControlGroup
							id="merchant-type-control-group-checkboxes"
							name="merchant type checkboxes"
							type="checkbox"
							controls={[
								{
									label: "Ethnic",
									value: "Ethnic"
								},
								{
									label: "Fast Food",
									value: "FastFood"
								},
								{
									label: "Casual",
									value: "Casual"
								}
							]}
							onChange={this.handleMerchantTypesClick}
						/>
					</CardActions>
				</Card>
			</div>
		);
	}
}

SearchFilter.propTypes = {
	onLocationChange: PropTypes.func.isRequired,
	onRadiusChange: PropTypes.func.isRequired,
	onUserLocationReset: PropTypes.func.isRequired,
	onPriceStartChange: PropTypes.func.isRequired,
	onPriceEndChange: PropTypes.func.isRequired,
	onPriceRangeReset: PropTypes.func.isRequired,
	onIsOrganicSwitched: PropTypes.func.isRequired,
	onMerchantTypesClicked: PropTypes.func.isRequired,
	onRestaurantNameChange: PropTypes.func.isRequired,

	latitude: PropTypes.number,
	longitude: PropTypes.number,
	radius: PropTypes.number,
	priceRangeSetStart: PropTypes.number,
	priceRangeSetEnd: PropTypes.number,
	restaurantName: PropTypes.string,
	defaultRadius: PropTypes.number.isRequired,
	isOrganic: PropTypes.bool,
	merchantTypes: PropTypes.array.isRequired
};
