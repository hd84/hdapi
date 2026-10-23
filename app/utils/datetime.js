exports.now = function () {
    const now = new Date();
    now.setMilliseconds(0);
	return now;
};

exports.addsecond = function (dt,value) {
	const seconds = Number(value);
	if (!Number.isFinite(seconds)) return null;

	const date = dt instanceof Date ? dt : new Date(dt);
	if (Number.isNaN(date.getTime())) return null;
	date.setSeconds(date.getSeconds() + seconds);
	return date;
};
exports.formatDateTime = function (value, format = 'YYYY-MM-DD HH:MM:SS') {
	if (value == null) return null;

	let year;
	let month;
	let day;
	let hours;
	let minutes;
	let seconds;

	if (typeof value === 'string') {
		const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
		if (match) {
			[, year, month, day, hours, minutes, seconds] = match;
		}
	}

	if (year === undefined) {
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return null;

		const pad = number => String(number).padStart(2, '0');
		year = String(date.getFullYear());
		month = pad(date.getMonth() + 1);
		day = pad(date.getDate());
		hours = pad(date.getHours());
		minutes = pad(date.getMinutes());
		seconds = pad(date.getSeconds());
	}

	if (format === 'YYYY-MM-DD') {
		return `${year}-${month}-${day}`;
	}

	if (format === 'YYYY-MM-DD HH:MM:SS') {
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	return format
		.replace('YYYY', year)
		.replace('MM', month)
		.replace('DD', day)
		.replace('HH', hours)
		.replace('mm', minutes)
		.replace('SS', seconds);
};

exports.formatTimestamp = function (timestamp) {
	if (timestamp == null || timestamp === '') return null;

	const numericTimestamp = Number(timestamp);
	if (!Number.isFinite(numericTimestamp)) return null;

	const milliseconds = Math.abs(numericTimestamp) < 100000000000
		? numericTimestamp * 1000
		: numericTimestamp;

	return exports.formatDateTime(new Date(milliseconds));
};

exports.TIMESTAMP = function (value, unit = 'milliseconds') {
	if (value == null || value === 0 || value === '0') {
		value = new Date();
	}

	if (value === '') return null;

	const date = value instanceof Date ? value : new Date(value);
	const milliseconds = date.getTime();
	if (Number.isNaN(milliseconds)) return null;

	if (unit === 'seconds') {
		return Math.floor(milliseconds / 1000);
	}

	if (unit !== 'milliseconds') return null;
	return milliseconds;
};
