import * as asserts from 'https://deno.land/std@0.166.0/testing/asserts.ts';
import { LocalDate } from './LocalDate.ts';

Deno.test('1955', async () => {
	const data = {
		'1': {
			'1': '元日',
			'15': '成人の日',
		},
		'3': {
			'21': '春分の日',
		},
		'4': {
			'29': '天皇誕生日',
		},
		'5': {
			'3': '憲法記念日',
			'5': 'こどもの日',
		},
		'9': {
			'24': '秋分の日',
		},
		'11': {
			'3': '文化の日',
			'23': '勤労感謝の日',
		},
	};

	const localDate = new LocalDate();
	await localDate.loadFromCSV('holiday.csv');
	const actual = localDate.getHolidays(1955);
	asserts.assertEquals(JSON.stringify(actual), JSON.stringify(data));
});
