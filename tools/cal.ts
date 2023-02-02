import { LocalDate } from './LocalDate';
const HOLIDAY_JSON = './holiday.json';

interface HOLIDAY_INFO {
	[key: number]: // Year
		{
			[key: number]: // Month
				{
					[key: number]: string; // Day: name
				};
		};
}

interface CAL_NAMES {
	WEEK: string[];
	MONTH: string[];
}

const NAME: CAL_NAMES = {
	WEEK: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
	MONTH: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
};

interface FONT_COLOR_STRING {
	front: string;
	back: string;
}

interface FONT_COLOR {
	black: FONT_COLOR_STRING;
	red: FONT_COLOR_STRING;
	green: FONT_COLOR_STRING;
	yellow: FONT_COLOR_STRING;
	blue: FONT_COLOR_STRING;
	magenta: FONT_COLOR_STRING;
	cyan: FONT_COLOR_STRING;
	white: FONT_COLOR_STRING;
}
const BASE_COLOR = {
	black: { front: '\u001b[30m', back: '\u001b[40m' },
	red: { front: '\u001b[31m', back: '\u001b[41m' },
	green: { front: '\u001b[32m', back: '\u001b[42m' },
	yellow: { front: '\u001b[33m', back: '\u001b[43m' },
	blue: { front: '\u001b[34m', back: '\u001b[44m' },
	magenta: { front: '\u001b[35m', back: '\u001b[45m' },
	cyan: { front: '\u001b[36m', back: '\u001b[46m' },
	white: { front: '\u001b[37m', back: '\u001b[47m' },
};
const RCOLOR: FONT_COLOR = {
	black: { front: BASE_COLOR.white.front, back: BASE_COLOR.black.back },
	red: { front: BASE_COLOR.white.front, back: BASE_COLOR.red.back },
	green: { front: BASE_COLOR.white.front, back: BASE_COLOR.green.back },
	yellow: { front: BASE_COLOR.white.front, back: BASE_COLOR.yellow.back },
	blue: { front: BASE_COLOR.white.front, back: BASE_COLOR.blue.back },
	magenta: { front: BASE_COLOR.white.front, back: BASE_COLOR.magenta.back },
	cyan: { front: BASE_COLOR.white.front, back: BASE_COLOR.cyan.back },
	white: { front: BASE_COLOR.black.front, back: BASE_COLOR.white.back },
};
const TCOLOR: FONT_COLOR = {
	black: { front: BASE_COLOR.black.front, back: BASE_COLOR.white.back },
	red: { front: BASE_COLOR.red.front, back: BASE_COLOR.white.back },
	green: { front: BASE_COLOR.green.front, back: BASE_COLOR.white.back },
	yellow: { front: BASE_COLOR.yellow.front, back: BASE_COLOR.white.back },
	blue: { front: BASE_COLOR.blue.front, back: BASE_COLOR.white.back },
	magenta: { front: BASE_COLOR.magenta.front, back: BASE_COLOR.white.back },
	cyan: { front: BASE_COLOR.cyan.front, back: BASE_COLOR.white.back },
	white: { front: BASE_COLOR.black.front, back: BASE_COLOR.white.back },
};
const COLOR: FONT_COLOR = {
	black: { front: BASE_COLOR.black.front, back: '' },
	red: { front: BASE_COLOR.red.front, back: '' },
	green: { front: BASE_COLOR.green.front, back: '' },
	yellow: { front: BASE_COLOR.yellow.front, back: '' },
	blue: { front: BASE_COLOR.blue.front, back: '' },
	magenta: { front: BASE_COLOR.magenta.front, back: '' },
	cyan: { front: BASE_COLOR.cyan.front, back: '' },
	white: { front: BASE_COLOR.black.front, back: '' },
};
const RESET_COLOR = '\u001b[0m';

interface ARGUMENTS {
	hide: boolean; // -h ... hide today.
	year: boolean; // -y ... print year calendar.
	count: boolean; // -j ... print count day.
	nocolor: boolean; // -n ... no color.(original)
	date: { year: number; month: number };
}

function Color(value: string, color?: FONT_COLOR_STRING) {
	if (color) return color.back + color.front + value + RESET_COLOR;
	return value;
}

function CreateCalender(last: Date) {
	const days: number[] = [];
	let week = last.getDay();
	for (let day = last.getDate(); 0 < day; --day) {
		days.unshift(day);
		if (0 < week) --week;
		else week = 6;
	}
	for (let empty = (7 - (last.getDate() - last.getDay() - 1) % 7) % 7; 0 < empty; --empty) {
		days.unshift(0);
	}

	return days;
}

function PrintSigle(arg: ARGUMENTS, today: Date, holiday: HOLIDAY_INFO = {}) {
	// Month[1-12]/0 = Month[0-11]/lastday
	const year = arg.date.year;
	const month = arg.date.month;
	const date = new Date(year, month, 0);
	const days = CreateCalender(date);
	const weekcolor: (FONT_COLOR_STRING | undefined)[] = [
		// Normal color.
		COLOR.red,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		COLOR.blue,
		// Today color.
		TCOLOR.red,
		TCOLOR.white,
		TCOLOR.white,
		TCOLOR.white,
		TCOLOR.white,
		TCOLOR.white,
		TCOLOR.blue,
	];
	const h: { [key: number]: string } = (holiday[year] ? holiday[year][month] : null) || {};
	const day = today.getFullYear() === year && today.getMonth() + 1 === month ? today.getDate() : 0;

	console.log('      ' + NAME.MONTH[month - 1] + ' ' + year);
	console.log(
		NAME.WEEK.map((v, i) => {
			return Color(v.slice(0, 2), weekcolor[i]);
		}).join(' '),
	);
	while (0 < days.length) {
		console.log(
			days.splice(0, 7).map((d, i) => {
				return 0 < d ? Color(('  ' + d).slice(-2), weekcolor[(d === day ? 7 : 0) + (h[d] ? 0 : i)]) : '  ';
			}).join(' '),
		);
	}
}

function Arguments() {
	const arg: ARGUMENTS = {
		hide: false,
		year: false,
		count: false,
		nocolor: false,
		date: { year: 0, month: 0 },
	};

	for (let i = 2; i < process.argv.length; ++i) {
		switch (process.argv[i]) {
			case '-h':
				arg.hide = true;
				break;
			case '-y':
				arg.year = true;
				break;
			case '-j':
				arg.count = true;
				break;
			default:
				if (process.argv[i].match(/[^0-9]/)) break;
				const val = parseInt(process.argv[i]);
				if (arg.date.year === 0) {
					arg.date.year = val;
				} else if (arg.date.month === 0) {
					arg.date.month = arg.date.year;
					arg.date.year = val;
				}
				break;
		}
		if (arg.date.year < 1 || 9999 < arg.date.year) {
			arg.date.year = arg.date.month = 0;
		}
		if (arg.date.month < 1 || 12 < arg.date.month) arg.date.month = 0;
	}

	return arg;
}

function Init() {
	const ldate = new LocalDate();
	return ldate.init(HOLIDAY_JSON, true).then((holidays) => {
		const data: HOLIDAY_INFO = {};

		holidays.forEach((holiday) => {
			const year = holiday.date.getFullYear();
			const month = holiday.date.getMonth() + 1;
			if (!data[year]) data[year] = {};
			if (!data[year][month]) data[year][month] = {};
			data[year][month][holiday.date.getDate()] = holiday.name;
		});

		return data;
	});
}

function Main() {
	const date = new Date();
	return Init().then((holiday) => {
		const arg = Arguments();
		if (!arg.date.year) {
			arg.date.year = date.getFullYear();
			arg.date.month = date.getMonth() + 1;
		} else if (!arg.date.month) {
			arg.year = true;
		}

		if (arg.year) {
		} else {
			PrintSigle(arg, date, holiday);
		}
	});
}

Main();
