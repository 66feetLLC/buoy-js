import _ from "lodash";
import parseBuoyProperties from "./parse-buoy-properties"
import parseLine from "./parse-line"
export const PARSE_ERROR = "Invalid data for parse-realtime-buoy-data.js";
/**
 * Data loaded from
 * http://www.ndbc.noaa.gov/data/realtime2/{stationID}.txt
 * No json was available
 * returns an {Array} of records of buoy data
 */
export default function(list, numberOfRecords = 10) {
	if (_.isString(list)) {
		// create an array of lines
		list = list.split("\n");
		// get the prop names, and remove STN, which we're using as the ID
		var map = parseLine(_.first(list));
		// pop off the first two lines of text, they're descriptions, not buoy data
		list = _.compact(list.slice(2));
		return _.take(list, numberOfRecords).map(function(row) {
			var values = parseLine(row),
				buoy = {
					date: new Date()
				};
			// build the object by iterating through each column value
			_.each(values, _.partial(parseBuoyProperties, buoy, map));
			// seconds and milliseconds don't come from noaa data,
			// so clear them
			buoy.date.setSeconds(0)
			buoy.date.setMilliseconds(0)
			return buoy;
		});
	} else {
		/* istanbul ignore next */
		throw PARSE_ERROR;
	}
}
