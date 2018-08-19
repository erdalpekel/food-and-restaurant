import React from "react";
import PropTypes from "prop-types";
import { SearchListRow } from "./SearchListRow";

export default class SearchList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{this.props.data.map((restaurantProduct, i) => (
					<SearchListRow key={i} rowNumber={i} restaurantProduct={restaurantProduct} />
				))}
			</div>
		);
	}
}

SearchList.propTypes = {
	data: PropTypes.array.isRequired
};
