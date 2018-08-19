import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-md";

export class SearchPaginate extends React.Component {
	constructor(props) {
		super(props);
	}

	handlePaginateBackward = () => {
		this.props.onPaginateBackward();
	};

	handlePaginateForward = () => {
		this.props.onPaginateForward();
	};

	handlePaginateToPage = page => {
		this.props.onPaginateToPage(page);
	};

	render() {
		const maxPageNumber = Math.ceil(this.props.totalResultCount / this.props.limit);
		const currentPage = Number(this.props.offset / this.props.limit) + 1;
		const pageNumbers = [];

		for (let i = 1; i <= maxPageNumber; i++) {
			pageNumbers.push(
				<Button
					primary={currentPage !== i}
					secondary={currentPage === i}
					flat
					key={i}
					onClick={() => this.handlePaginateToPage(i)}
				>
					{i}
				</Button>
			);
		}

		return (
			<span>
				<Button icon primary disabled={currentPage === 1} onClick={this.handlePaginateBackward}>
					arrow_back
				</Button>
				{pageNumbers}
				<Button icon primary disabled={currentPage >= maxPageNumber} onClick={this.handlePaginateForward}>
					arrow_forward
				</Button>
			</span>
		);
	}
}

SearchPaginate.propTypes = {
	onPaginateBackward: PropTypes.func.isRequired,
	onPaginateForward: PropTypes.func.isRequired,
	onPaginateToPage: PropTypes.func.isRequired,

	offset: PropTypes.number.isRequired,
	limit: PropTypes.number.isRequired,
	totalResultCount: PropTypes.number.isRequired
};
