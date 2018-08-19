import React from "react";
import { CircularProgress, Grid, Cell } from "react-md";
import { debounce } from "utilities";
import RestaurantsService from "services/RestaurantsService";
import SearchList from "components/search/SearchList";
import SearchFilter from "components/search/SearchFilter";
import { SearchBar } from "components/search/SearchBar";
import { SearchPaginate } from "components/search/SearchPaginate";

export default class SearchListView extends React.Component {
	static inputValueDebounceTime = 500;
	static defaultLocationSearchRadius = 2;

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			data: [],
			limit: 10,
			offset: 0,
			totalResultCount: 0,
			searchQuery: "",
			latitude: null,
			longitude: null,
			radius: null,
			priceRangeSetStart: undefined,
			priceRangeSetEnd: undefined,
			orderBy: "price",
			orderSequence: 1,
			rowClicked: null,
			merchantTypes: [],
			isOrganic: null,
			productCategory: null,
			restaurantName: null
		};
	}

	queryRestaurantProducts() {
		this.setState({
			loading: true
		});

		const queryParameters = Object.assign({}, this.state);
		console.log("queryParameters: ", queryParameters);

		RestaurantsService.getRestaurantsWithFilters(queryParameters)
			.then(data => {
				if (data !== "undefined" && data.length > 0) {
					this.setState({
						data: [...data[0].results],
						totalResultCount: data[0].total,
						loading: false,
						error: undefined
					});
				} else {
					this.setState({
						data: [],
						totalResultCount: 0,
						loading: false,
						error: undefined
					});
				}
			})
			.catch(e => {
				console.error(e);
				this.setState({
					error: "Failed to fetch restaurant products."
				});
			});
	}

	componentDidMount() {
		this.queryRestaurantProducts();
	}

	handleSearchQueryChange = debounce(inputText => {
		this.setState(
			{
				searchQuery: inputText
			},
			() => this.queryRestaurantProducts()
		);
	}, SearchListView.inputValueDebounceTime);

	handleLocationChange = (latitude, longitude) => {
		this.setState(
			{
				latitude: latitude,
				longitude: longitude,
				radius: SearchListView.defaultLocationSearchRadius
			},
			() => this.queryRestaurantProducts()
		);
	};

	handleRadiusFilterChange = radius => {
		this.setState({ radius: radius }, () => this.queryRestaurantProducts());
	};

	handleUserLocationReset = () => {
		this.setState(
			{
				latitude: null,
				longitude: null,
				radius: null,
				orderBy: "price",
				orderSequence: 1
			},
			() => this.queryRestaurantProducts()
		);
	};

	handlePriceStartChange = inputNumber => {
		this.setState(
			{
				priceRangeSetStart: parseFloat(inputNumber)
			},
			() => this.queryRestaurantProducts()
		);
	};

	handlePriceEndChange = inputNumber => {
		console.log(inputNumber);
		this.setState(
			{
				priceRangeSetEnd: parseFloat(inputNumber)
			},
			() => this.queryRestaurantProducts()
		);
	};

	handlePriceRangeReset = () => {
		this.setState(
			{
				priceRangeSetStart: "",
				priceRangeSetEnd: ""
			},
			() => this.queryRestaurantProducts()
		);
	};

	handleSortByPriceClick = () => {
		this.setState(
			{
				orderBy: "price",
				orderSequence: this.resetOrderSequence("price")
			},
			() => this.queryRestaurantProducts()
		);
	};

	handleSortByLocationClick = () => {
		this.setState(
			{
				orderBy: "distance",
				orderSequence: this.resetOrderSequence("distance")
			},
			() => this.queryRestaurantProducts()
		);
	};

	resetOrderSequence = orderBy => {
		var orderSequence = null;
		if (this.state.orderBy !== orderBy) {
			orderSequence = 1;
		} else {
			orderSequence = this.state.orderSequence === 1 ? -1 : 1;
		}

		return orderSequence;
	};

	paginateForward = () => {
		this.setState(
			{
				offset: this.state.offset + this.state.limit,
				rowClicked: null
			},
			() => this.queryRestaurantProducts()
		);
	};

	paginateBackward = () => {
		if (this.state.offset > 0) {
			this.setState(
				{
					offset: this.state.offset - this.state.limit,
					rowClicked: null
				},
				() => this.queryRestaurantProducts()
			);
		}
	};

	handleRowClicked = row => {
		this.setState({
			rowClicked: this.state.rowClicked !== row ? row : null
		});
	};

	handlePaginationLimitChanged = value => {
		this.setState(
			{
				offset: 0,
				limit: value,
				rowClicked: null
			},
			() => this.queryRestaurantProducts()
		);
	};

	paginateToPage = pageNumber => {
		this.setState(
			{
				offset: (pageNumber - 1) * this.state.limit,
				rowClicked: null
			},
			() => this.queryRestaurantProducts()
		);
	};

	handleIsOrganicChange = value => {
		this.setState(
			{
				isOrganic: value ? value : null,
				offset: 0
			},
			() => this.queryRestaurantProducts()
		);
	};

	handleMerchantTypesClicked = values => {
		this.setState(
			{
				merchantTypes: values !== "" ? values.split(",") : undefined,
				offset: 0
			},
			() => this.queryRestaurantProducts()
		);
	};

	handleProductCategoryChanged = value => {
		this.setState(
			{
				productCategory: value === "" ? null : value
			},
			() => this.queryRestaurantProducts()
		);
	};

	handleRestaurantNameChanged = value => {
		this.setState(
			{
				restaurantName: value === "" ? null : value,
				offset: 0
			},
			() => this.queryRestaurantProducts()
		);
	};

	render() {
		return (
			<Grid className="grid-search-for-product">
				<Cell size={2}>
					<SearchFilter
						onRadiusChange={this.handleRadiusFilterChange}
						onLocationChange={this.handleLocationChange}
						latitude={this.state.latitude}
						longitude={this.state.longitude}
						radius={this.state.radius}
						defaultRadius={SearchListView.defaultLocationSearchRadius}
						priceRangeSetStart={this.state.priceRangeSetStart}
						priceRangeSetEnd={this.state.priceRangeSetEnd}
						isOrganic={this.state.isOrganic}
						merchantTypes={this.state.merchantTypes}
						restaurantName={this.state.restaurantName}
						onUserLocationReset={this.handleUserLocationReset}
						onPriceStartChange={this.handlePriceStartChange}
						onPriceEndChange={this.handlePriceEndChange}
						onPriceRangeReset={this.handlePriceRangeReset}
						onIsOrganicSwitched={this.handleIsOrganicChange}
						onMerchantTypesClicked={this.handleMerchantTypesClicked}
						onRestaurantNameChange={this.handleRestaurantNameChanged}
					/>
				</Cell>
				<Cell size={10}>
					{this.state.error ? (
							this.state.error ? `${this.state.error}` : ""
					) : (
						<div>
							<SearchBar
								onProductCategoryChanged={this.handleProductCategoryChanged}
								onPaginationLimitChanged={this.handlePaginationLimitChanged}
								onSortByLocationClicked={this.handleSortByLocationClick}
								onSortByPriceClicked={this.handleSortByPriceClick}
								latitude={this.state.latitude}
								orderBy={this.state.orderBy}
								orderSequence={this.state.orderSequence}
								onSearchQueryChange={this.handleSearchQueryChange}
							/>
							{this.state.loading ? (
								<CircularProgress id={"restaurantProducts-loading-progress"} />
							) : (
								<div>
									<SearchList
										data={this.state.data}
										latitude={this.state.latitude}
										rowClicked={this.state.rowClicked}
										onRowClicked={this.handleRowClicked}
									/>
									<SearchPaginate
										onPaginateBackward={this.paginateBackward}
										onPaginateForward={this.paginateForward}
										limit={this.state.limit}
										offset={this.state.offset}
										totalResultCount={this.state.totalResultCount}
										onPaginateToPage={this.paginateToPage}
									/>
								</div>
							)}
						</div>
					)}
				</Cell>
			</Grid>
		);
	}
}
