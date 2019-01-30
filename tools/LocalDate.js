"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const https = require("https");
const stream = require("stream");
const iconv = require("iconv-lite");
const HOLIDAY_CSV = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
function Get(url) {
    const buftrans = new stream.Transform({ transform(chunk, encoding, callback) { callback(null, chunk); } });
    return new Promise((resolve, reject) => {
        const bufs = [];
        const request = https.request(url, (response) => { response.pipe(buftrans); });
        buftrans.on('data', (chunk) => { bufs.push(chunk); });
        buftrans.on('end', () => { resolve(Buffer.concat(bufs)); });
        buftrans.on('error', (error) => { reject(error); });
        request.end();
    });
}
class LocalDate {
    constructor() {
        this.holidays = [];
    }
    init(file, force) {
        return this.loadConfig(file).then((config) => {
            this.config = config;
            return this.loadHoliday(config.holiday, force);
        }).then((holidays) => {
            this.holidays = holidays;
            return holidays;
        });
    }
    _date(year, month, day) {
        if (year === undefined) {
            return new Date();
        }
        if (month === undefined) {
            return new Date(year);
        }
        --month;
        if (day === undefined) {
            return new Date(year, month);
        }
        return new Date(year, month, day);
    }
    date(year, month, day, addsec = 0) {
        if (typeof year === 'number' && month === undefined && day === undefined) {
            addsec = year;
            year = undefined;
        }
        const date = this._date(year, month, day);
        const data = new Date(date.getTime() - (date.getTimezoneOffset() * 60 + addsec) * 1000);
        data.holiday = this.getHoliday(data);
        return data;
    }
    getHoliday(date, addsec = 0) {
        const DAY_MSEC = 24 * 60 * 60 * 1000;
        const target = date.getTime() + addsec * 1000;
        for (let i = 0; i < this.holidays.length; ++i) {
            const msec = this.holidays[i].date.getTime();
            if (msec <= target && target < msec + DAY_MSEC) {
                return this.holidays[i].name;
            }
        }
        return null;
    }
    isHoliday(date, addsec = 0) {
        if (date.getDay() % 6 === 0) {
            return true;
        }
        return this.getHoliday(date, addsec) !== null;
    }
    addHoliday(year, month, day, name) {
        this.holidays.push({ date: this.date(year, month, day), name: name });
    }
    open(file) {
        const stat = this.stat(file);
        if (!stat || !stat.isFile()) {
            return Promise.reject('No file.');
        }
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        }).then((data) => { return data; });
    }
    loadConfig(file) {
        let notfound = false;
        return this.open(file).then((data) => {
            return JSON.parse(data);
        }).catch((error) => { notfound = true; return {}; }).then((data) => {
            const config = {
                holiday: {
                    file: './holiday.csv',
                    url: HOLIDAY_CSV,
                },
            };
            if (typeof data !== 'object') {
                return config;
            }
            if (typeof data.holiday === 'object') {
                if (typeof data.holiday.file === 'string') {
                    config.holiday.file = data.holiday.file;
                }
                if (typeof data.holiday.url === 'string') {
                    config.holiday.url = data.holiday.url;
                }
            }
            if (notfound) {
                fs.writeFile(file, JSON.stringify(config), () => { });
            }
            return config;
        });
    }
    loadHoliday(hdata, force) {
        const stat = this.stat(hdata.file);
        if (force !== true && stat && stat.isFile() && this.date().getTime() < stat.mtime.getTime() + 30 * 24 * 60 * 60 * 1000) {
            return this.open(hdata.file).then((data) => {
                return this.parseHoliday(data.split('\n'));
            });
        }
        return Get(hdata.url).then((buffer) => {
            const csv = iconv.decode(buffer, 'Shift_JIS');
            const lines = csv.split(/\r\n|\r|\n/);
            lines.shift();
            fs.writeFile(hdata.file, lines.join('\n'), () => { });
            return this.parseHoliday(lines);
        });
    }
    parseHoliday(lines) {
        const holidays = [];
        lines.forEach((line) => {
            if (!line) {
                return;
            }
            const dn = line.split(',');
            const datestr = dn[0].split('/');
            const data = { date: this.date(parseInt(datestr[0]), parseInt(datestr[1]), parseInt(datestr[2])), name: dn[1] || '' };
            data.date.holiday = data.name;
            holidays.push(data);
        });
        this.holidays = holidays;
        return holidays;
    }
    stat(file) {
        try {
            return fs.statSync(file);
        }
        catch (e) { }
        return null;
    }
}
exports.LocalDate = LocalDate;
