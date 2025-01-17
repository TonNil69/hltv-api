"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
function getResults() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.RESULTS}`;
        try {
            const body = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const $ = cheerio_1.default.load(body, {
                normalizeWhitespace: true,
            });
            const results = [];
            const resultElements = $('.allres .result-con');
            $(resultElements).each((_i, element) => {
                var _a, _b, _c;
                const el = $(element).find('tr');
                const timestamp = Number(el.parents('.result-con').attr('data-zonedgrouping-entry-unix'));
                const time = new Date(timestamp).toISOString();
                const team1El = el.children('.team-cell').first();
                const team2El = el.children('.team-cell').last();
                const matchId = $(element).children('a').attr('href');
                const maps = el.find('.map-text');
                const result1 = el.find('.result-score').children('span').first();
                const result2 = el.find('.result-score').children('span').last();
                const team1 = {
                    name: team1El.find('.team').text(),
                    logo: ((_a = team1El.find('img').attr('src')) === null || _a === void 0 ? void 0 : _a.includes('https://'))
                        ? team1El.find('img').attr('src')
                        : `${config_1.CONFIG.BASE}${team1El.find('img').attr('src')}`,
                    result: parseInt(result1.text(), 10),
                };
                const team2 = {
                    name: team2El.find('.team').text(),
                    logo: ((_b = team2El.find('img').attr('src')) === null || _b === void 0 ? void 0 : _b.includes('https://'))
                        ? team2El.find('img').attr('src')
                        : `${config_1.CONFIG.BASE}${team2El.find('img').attr('src')}`,
                    result: parseInt(result2.text(), 10),
                };
                const objData = {
                    event: {
                        name: el.find('.event-name').text(),
                        logo: ((_c = el.find('.event-logo').attr('src')) === null || _c === void 0 ? void 0 : _c.includes('https://'))
                            ? el.find('.event-logo').attr('src')
                            : `${config_1.CONFIG.BASE}${el.find('.event-logo').attr('src')}`,
                    },
                    maps: maps.text(),
                    time,
                    teams: [team1, team2],
                    matchId: parseInt(matchId.split('/')[2], 10),
                };
                results.push(objData);
            });
            if (!results.length) {
                throw new Error('There are no results available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api');
            }
            return results;
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.getResults = getResults;
//# sourceMappingURL=results.js.map