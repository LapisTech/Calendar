"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const LocalDate_1 = require("./LocalDate");
const HOLIDAY_JSON = './holiday.json';
const OUT_FILE = './docs/holiday.json';
function Main() {
    const ldate = new LocalDate_1.LocalDate();
    return ldate.init(HOLIDAY_JSON, true);
}
Main().then((holidays) => {
    const data = {};
    holidays.forEach((holiday) => {
        const year = holiday.date.getFullYear();
        const month = holiday.date.getMonth() + 1;
        if (!data[year]) {
            data[year] = {};
        }
        if (!data[year][month]) {
            data[year][month] = {};
        }
        data[year][month][holiday.date.getDate()] = holiday.name;
    });
    fs.writeFileSync(OUT_FILE, JSON.stringify(data));
    Object.keys(data).forEach((year) => {
        fs.writeFileSync(OUT_FILE.replace(/holiday\.json$/, 'holiday.' + year + '.json'), JSON.stringify(data[year]));
    });
});
