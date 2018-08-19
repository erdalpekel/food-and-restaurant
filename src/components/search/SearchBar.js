import React from "react";
import PropTypes from "prop-types";
import { Button, FontIcon, SelectField, TextField } from "react-md";

export class SearchBar extends React.Component {
	static paginationLimitOptions = [10, 25, 50, 100];
	static productCategories = ["", "Pasta", "Salad", "Bread", "Soup", "Antipasti", "Roast"];

	constructor(props) {
		super(props);
	}

	handleProductCategoryChanged = category => {
		this.props.onProductCategoryChanged(category);
	};

	handlePaginationLimitChanged = limit => {
		this.props.onPaginationLimitChanged(limit);
	};

	handleSortByLocationClick = () => {
		this.props.onSortByLocationClicked();
	};

	handleSortByPriceClick = () => {
		this.props.onSortByPriceClicked();
	};

	handleSearchQueryChange = query => {
		this.props.onSearchQueryChange(query);
	};

	render() {
		return (
			<div>
				<div className="md-grid">
					<SelectField
						id="select-product-category-default-value"
						label="Product category"
						defaultValue={""}
						menuItems={SearchBar.productCategories}
						className="md-cell md-cell--3"
						onChange={this.handleProductCategoryChanged}
						anchor={{ x: SelectField.HorizontalAnchors.CENTER, y: SelectField.VerticalAnchors.BOTTOM }}
						simplifiedMenu={false}
					/>
					<TextField
						id="search-bar"
						label="Search for a product"
						type="search"
						lineDirection="left"
						fullWidth={true}
						onChange={this.handleSearchQueryChange}
						placeholder="e.g. breze"
						className="md-cell md-cell--7"
						leftIcon={<FontIcon>search</FontIcon>}
					/>
					<SelectField
						id="select-pagination-limit-default-value"
						label="Results per page"
						defaultValue={SearchBar.paginationLimitOptions[0]}
						menuItems={SearchBar.paginationLimitOptions}
						className="md-cell md-cell--2"
						onChange={this.handlePaginationLimitChanged}
						anchor={{ x: SelectField.HorizontalAnchors.CENTER, y: SelectField.VerticalAnchors.BOTTOM }}
						simplifiedMenu={false}
					/>
				</div>
				<div className="md-grid">
					<Button flat primary className="md-cell md-cell--3">
						Sort by
					</Button>
					<Button
						raised
						primary={this.props.orderBy === "distance"}
						iconChildren="my_location"
						onClick={this.handleSortByLocationClick}
						disabled={!this.props.latitude}
						className="md-cell md-cell--3"
					>
						{this.props.orderBy === "distance" ? (
							<FontIcon>{this.props.orderSequence === 1 ? "arrow_upward" : "arrow_downward"}</FontIcon>
						) : (
							"distance"
						)}
					</Button>
					<Button
						raised
						primary={this.props.orderBy === "price"}
						iconChildren="euro_symbol"
						onClick={this.handleSortByPriceClick}
						className="md-cell md-cell--3"
					>
						{this.props.orderBy === "price" ? (
							<FontIcon>{this.props.orderSequence === 1 ? "arrow_upward" : "arrow_downward"}</FontIcon>
						) : (
							"price"
						)}
					</Button>
				</div>
			</div>
		);
	}
}

SearchBar.propTypes = {
	onProductCategoryChanged: PropTypes.func.isRequired,
	onPaginationLimitChanged: PropTypes.func.isRequired,
	onSortByLocationClicked: PropTypes.func.isRequired,
	onSortByPriceClicked: PropTypes.func.isRequired,
	onSearchQueryChange: PropTypes.func.isRequired,

	latitude: PropTypes.number,
	orderBy: PropTypes.string.isRequired,
	orderSequence: PropTypes.number.isRequired
};
