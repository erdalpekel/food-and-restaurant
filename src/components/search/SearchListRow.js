import React from "react";
import PropTypes from "prop-types";
import {
	Card,
	CardTitle,
	CardText,
	CardActions,
	Grid,
	Cell,
	Media,
	Button,
	Chip,
	Avatar,
	FontIcon
} from "react-md";

import Map from "../../components/Map";
import { PNF, phoneUtil } from "utilities";

export class SearchListRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let productRating = [];
		if (this.props.restaurantProduct.rating) {
			const ratingInt = parseInt(this.props.restaurantProduct.rating);
			if (!isNaN(ratingInt)) {
				for (let i = 0; i < ratingInt; i++) {
					productRating.push(
						<FontIcon key={i} secondary>
							star
						</FontIcon>
					);
				}
				for (let i = ratingInt; i < 5; i++) {
					productRating.push(
						<FontIcon key={i} secondary>
							star_border
						</FontIcon>
					);
				}
			}
		} else {
			// put 5 empty / grayed out stars into the rating if no rating is set
			for (let i = 0; i < 5; i++) {
				productRating.push(
					<FontIcon key={i} disabled>
						star_border
					</FontIcon>
				);
			}
		}

		return (
			<Card raise className="search-list-row-card">
				<Grid>
					<Cell size={5}>
						<Media>{this.props.restaurantProduct.image ? <img src={this.props.restaurantProduct.image} /> : null}</Media>
					</Cell>
					<Cell size={3}>
						<div className="md-card">
							<CardActions>
								<Button
									className="md-block-centered"
									flat
									primary
									children={<span>{this.props.restaurantProduct.name}</span>}
								/>
							</CardActions>
							<CardText>
								<Button
									className="md-block-centered"
									flat
									disabled
									secondary
									iconEl={<span>{productRating}</span>}
								/>
							</CardText>
						</div>
					</Cell>
					<Cell size={2}>
						<Media aspectRatio="1-1">
							{this.props.restaurantProduct.restaurant.image ? <img src={this.props.restaurantProduct.restaurant.image} /> : null}
						</Media>
					</Cell>
					<Cell size={2}>
						<Chip
							label={this.props.restaurantProduct.price}
							avatar={<Avatar icon={<FontIcon>euro_symbol</FontIcon>} suffix="orange" />}
						/>
						{this.props.restaurantProduct.isOrganic === true ? (
							<Chip
								label={"Organic"}
								avatar={<Avatar icon={<FontIcon>nature</FontIcon>} suffix="light-green" />}
							/>
						) : null}
					</Cell>
				</Grid>
				<CardActions expander>
				</CardActions>
				<CardText expandable>
					<CardTitle
						title={this.props.restaurantProduct.restaurant.name}
						avatar={<Avatar src={this.props.restaurantProduct.restaurant.image} role="presentation" />}
					/>
					<CardTitle title={this.props.restaurantProduct.name} />
					<CardText>{this.props.restaurantProduct.description}</CardText>
					<CardTitle title={this.props.restaurantProduct.restaurant.name} />
					<CardText>{this.props.restaurantProduct.restaurant.description}</CardText>
					<CardActions>
						<Chip
							label={this.props.restaurantProduct.restaurant.phone}
							avatar={<Avatar icon={<FontIcon>phone</FontIcon>} suffix="blue" />}
							onClick={_ => {
								window.open(
									`tel:${phoneUtil.format(
										phoneUtil.parseAndKeepRawInput(this.props.restaurantProduct.restaurant.phone, "DE"),
										PNF.E164
									)}`
								);
							}}
						/>
						<Chip
							label={this.props.restaurantProduct.restaurant.website}
							avatar={<Avatar icon={<FontIcon>link</FontIcon>} suffix="blue" />}
							onClick={_ => {
								window.open(`//${this.props.restaurantProduct.restaurant.website}`, "_blank");
							}}
						/>
						<Chip
							label={this.props.restaurantProduct.restaurant.email}
							avatar={<Avatar icon={<FontIcon>email</FontIcon>} suffix="blue" />}
							onClick={_ => {
								window.open(`mailto:${this.props.restaurantProduct.restaurant.email}`, "_blank");
							}}
						/>
						<Chip
							label={this.props.restaurantProduct.restaurant.address}
							avatar={<Avatar icon={<FontIcon>location_on</FontIcon>} suffix="blue" />}
						/>
					</CardActions>
					{/* We access the coordinates in reverse order because they are
                                stored in order [longitude,latitude] in MongoDB*/}
					<Map
						latitude={this.props.restaurantProduct.location.coordinates[1]}
						longitude={this.props.restaurantProduct.location.coordinates[0]}
						isMarkerShown={true}
						isInfoWindowOpen={true}
						infoWindowAddress={this.props.restaurantProduct.restaurant.address}
						infoWindowTitle={this.props.restaurantProduct.restaurant.name}
					/>
				</CardText>
			</Card>
		);
	}
}

SearchListRow.propTypes = {
	restaurantProduct: PropTypes.shape({
		restaurant: PropTypes.shape({
			name: PropTypes.string.isRequired,
			location: PropTypes.shape({
				coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
			}).isRequired,
			category: PropTypes.string,
			phone: PropTypes.string.isRequired,
			website: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			address: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired
		}).isRequired,
		image: PropTypes.shape({
			data: PropTypes.string.isRequired,
			contentType: PropTypes.string.isRequired
		}).isRequired,
		price: PropTypes.number.isRequired,
		isOrganic: PropTypes.bool.isRequired,
		description: PropTypes.string.isRequired
	}).isRequired
};
