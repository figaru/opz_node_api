module.exports = {
	todayRange: () => {
		var d = new Date();
		d.setHours(0,0,0,0);

		var d2 = new Date();
		d2.setHours(24,0,0,0);

		return {start: d, end: d2};
	},
	dateRange: (date) =>{
		var d = new Date(date);
		d.setHours(0,0,0,0);

		var d2 = new Date(date);
		d2.setHours(24,0,0,0);

		return {start: d, end: d2};
	},
	twoDateRange: (date1, date2) => {
		var d = new Date(date1);
		d.setHours(0,0,0,0);

		var d2 = new Date(date2);
		d2.setHours(24,0,0,0);

		return {start: d, end: d2};
	},
	dateMinusDays: (date, days) =>{
		var d = new Date(date);
		d.setDate(d.getDate() - days);
		d.setHours(0,0,0,0);

		var d2 = new Date();
		d2.setHours(24,0,0,0);

		return {start: d, end: d2};
	}
}