# Food & Restaurant Catalogue

This repository is a food catalogue web app built with ReactJS, NodeJS and MongoDB.
The accompanying NodeJS backend is located [here](). 

This project showcases among other the following functionality:
 * GPS location based product search
 * MongoDB aggregation pipelines
 * MongoDB geospatial queries
 * React-MD based Material Design user interface
 * Linking to operating systems mail- and telephone-applications
 * Google maps JS integration into colliding UI elements
 * Simple Pagination of product list in conjunction with MongoDB
 * Asynchronous HTTP requests to custom NodeJS backend
 
 ### Configuration
 Place your backend endpoint URL in the __.env__ file 
 
 ### Data generation
 The accompanying backend repository houses a `src/data` subdirectory.
 I have placed a dataset for the Munich region in there called _compatible_restaurants.json_.
 
 In order to generate a dataset for your own region do the following:
 1. Go to [jsongenerator](https://next.json-generator.com/)
 2. Place the contents of __restaurant-generator.json__ in the left textarea
 3. Edit the coordinates to impose your own geographic area in the order[longitude, latitude]: `coordinates: ['{{floating(11.3, 11.7)}}', '{{floating(48.0, 48.3)}}']`
 4. Click on __Generate__
 5. Save the resulting json locally (e.g. __restaurants.json__)
 6. Run the _python_ script __mongo_converter.py__ to remove the quotation marks from the floating point values: `python3 mongo_converter.py -s /path/to/restaurants.json`
 7. The resulting __compatible_restaurants.json__ can be import into MongoDB: `mongoimport -h ds125602.mlab.com:25602 -d DATABASE -u USER -p PASSWORD --collection restaurants --file compatible_restaurants.json --jsonArray`
 
 ### ToDo
 * UI design is not responsive. Especially within the filters text flows out of the container
 * Data generation process is rather tedious and incomplete
 * Containerize both fronted and backend so that a one-click installation process can be run on a cloud providers offerings with _Docker_
 * Add comments
 
 ### License and Copyright Notices
 * [google-maps-services-js](https://github.com/googlemaps/google-maps-services-js/blob/master/LICENSE.md) (Apache-2.0 License)
 * [google-libphonenumber](https://github.com/ruimarinho/google-libphonenumber) (MIT License)
 * [react](https://github.com/facebook/react) (MIT License)
 * [react-google-maps](https://github.com/tomchentw/react-google-maps) (MIT License)
 * [react-md](https://github.com/mlaursen/react-md) (MIT License)
 * [react-scripts](https://github.com/facebook/create-react-app) (MIT License)
 * [webfontloader](https://github.com/typekit/webfontloader) (Apache-2.0 License)