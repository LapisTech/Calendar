import { LocalDate } from './LocalDate.ts';

const HOLIDAY_CSV = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

await fetch(HOLIDAY_CSV).then((response) => {
	return response.blob();
}).then(async (result) => {
	const data = await result.arrayBuffer();
	return Deno.writeTextFile('holiday.csv', new TextDecoder('shift-jis').decode(data));
});

const localDate = await new LocalDate().loadFromCSV('holiday.csv');
const data = localDate.getAllHolidays();

await Promise.all([
	... Object.keys(data).map((year) => {
		console.log(year);
		return Deno.writeTextFile(`docs/holiday.${year}.json`, JSON.stringify(data[year]));
	}),
	await Deno.writeTextFile('docs/holiday.json', JSON.stringify(data)),
]);

console.log('Complete.');

/*import * as fs from 'fs';

import { LocalDate } from './LocalDate';

const HOLIDAY_JSON = './holiday.json';
const OUT_FILE = './docs/holiday.json';

interface CALENDER_HOLIDAY
{
	[ key: number ]: // Year
	{
		[ key: number ]: // Month
		{
			[ key: number ]: string, // Day: Holiday name.
		}
	}
}

function Main()
{
	const ldate = new LocalDate();
	return ldate.init( HOLIDAY_JSON, true );
}

Main().then( ( holidays ) =>
{
	const data: CALENDER_HOLIDAY = {};
	holidays.forEach( ( holiday ) =>
	{
		const year = holiday.date.getFullYear();
		const month = holiday.date.getMonth() + 1;
		if ( !data[ year ] ) { data[ year ] = {}; }
		if ( !data[ year ][ month ] ) { data[ year ][ month ] = {}; }
		data[ year ][ month ][ holiday.date.getDate() ] = holiday.name;
	} );

	fs.writeFileSync( OUT_FILE, JSON.stringify( data ) );
	Object.keys( data ).forEach( ( year ) =>
	{
		fs.writeFileSync( OUT_FILE.replace( /holiday\.json$/, 'holiday.' + year + '.json' ), JSON.stringify( data[ <any>year ] ) );
	} );
} );
*/
