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
exports.getMatchById = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
function getMatchById(matchId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.MATCHES}/${matchId}/_`;
        try {
            const body = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const $ = cheerio_1.default.load(body, {
                normalizeWhitespace: true,
            });
            const stats1 = [];
            const stats2 = [];
            const allContent = $('.matchstats').find('#all-content');
            const team1Stats = allContent.children('table.totalstats').first().children('tbody');
            const list1 = team1Stats.children('tr').not('.header-row');
            list1.each((i, element) => {
                var _a;
                const el = $(element);
                const nameEl = el.find('.players .gtSmartphone-only');
                const name = nameEl.text().replace(/'\w+' /, '');
                const nickname = nameEl.find('.player-nick').text();
                const id = Number((_a = el
                    .find('.players')
                    .find('a')
                    .attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2]);
                const kills = parseInt(el.find('td.kd').text().split('-')[0], 10);
                const deaths = parseInt(el.find('td.kd').text().split('-')[1], 10);
                const adr = parseFloat(el.find('td.adr').text());
                const kast = parseFloat(el.find('td.kast').text());
                const rating = parseFloat(el.find('td.rating').text());
                const objData = {
                    name,
                    id,
                    nickname,
                    kills,
                    deaths,
                    adr,
                    kast,
                    rating,
                };
                stats1.push(objData);
            });
            const team2Stats = allContent.children('table.totalstats').last().children('tbody');
            const list2 = team2Stats.children('tr').not('.header-row');
            list2.each((i, element) => {
                var _a;
                const el = $(element);
                const nameEl = el.find('.players .gtSmartphone-only');
                const nick = nameEl.find('.player-nick').text();
                nameEl.find('.player-nick').remove();
                const name = nameEl.text().replace("''", '');
                const nickname = nick;
                const id = Number((_a = el
                    .find('.players')
                    .find('a')
                    .attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2]);
                const kills = parseInt(el.find('td.kd').text().split('-')[0], 10);
                const deaths = parseInt(el.find('td.kd').text().split('-')[1], 10);
                const adr = parseFloat(el.find('td.adr').text());
                const kast = parseFloat(el.find('td.kast').text());
                const rating = parseFloat(el.find('td.rating').text());
                const objData = {
                    name,
                    nickname,
                    id,
                    kills,
                    deaths,
                    adr,
                    kast,
                    rating,
                };
                stats2.push(objData);
            });
            if (!stats1.length || !stats2.length) {
                throw new Error('Something went wrong, here is no correct stats found for this match. Please create an issue in this repository https://github.com/dajk/hltv-api');
            }
            const mapsEl = $('.mapholder');
            const maps = [];
            mapsEl.each((_, element) => {
                const el = $(element);
                const mapTeam1 = {
                    name: el.find('.results-left').find('.results-teamname').text(),
                    result: {
                        first: {
                            side: el.find('.results-center-half-score').children().eq(1).attr('class'),
                            rounds: Number(el.find('.results-center-half-score').children().eq(1).text()),
                        },
                        second: {
                            side: el.find('.results-center-half-score').children().eq(5).attr('class'),
                            rounds: Number(el.find('.results-center-half-score').children().eq(5).text()),
                        },
                        ext: Number(el.find('.results-center-half-score').children().eq(11).text()),
                    },
                };
                const mapTeam2 = {
                    name: el.find('.results-right').find('.results-teamname').text(),
                    result: {
                        first: {
                            side: el.find('.results-center-half-score').children().eq(3).attr('class'),
                            rounds: Number(el.find('.results-center-half-score').children().eq(3).text()),
                        },
                        second: {
                            side: el.find('.results-center-half-score').children().eq(7).attr('class'),
                            rounds: Number(el.find('.results-center-half-score').children().eq(7).text()),
                        },
                        ext: Number(el.find('.results-center-half-score').children().eq(13).text()),
                    },
                };
                maps.push({
                    name: el.find('.mapname').text(),
                    pick: el.find('.pick').find('.results-teamname').text(),
                    teams: [mapTeam1, mapTeam2],
                });
            });
            const timeAndEvent = $('.timeAndEvent');
            const time = new Date(timeAndEvent.find('.time').data('unix')).toISOString();
            const event = {
                name: timeAndEvent.find('.event').find('a').text(),
                logo: '',
            };
            const team1El = $('.teamsBox').children('.team').eq(0);
            const team2El = $('.teamsBox').children('.team').eq(1);
            const team1 = {
                name: team1El.find('.teamName').text(),
                logo: ((_a = team1El.find('.logo').attr('src')) === null || _a === void 0 ? void 0 : _a.includes('https'))
                    ? team1El.find('.logo').attr('src')
                    : `${config_1.CONFIG.BASE}${team1El.find('.logo').attr('src')}`,
                result: Number(team1El.find('.team1-gradient').children().last().text()),
                players: stats1,
            };
            const team2 = {
                name: team2El.find('.teamName').text(),
                logo: ((_b = team2El.find('.logo').attr('src')) === null || _b === void 0 ? void 0 : _b.includes('https'))
                    ? team2El.find('.logo').attr('src')
                    : `${config_1.CONFIG.BASE}${team2El.find('.logo').attr('src')}`,
                result: Number(team2El.find('.team2-gradient').children().last().text()),
                players: stats2,
            };
            return {
                id: Number(matchId),
                time,
                event,
                teams: [team1, team2],
                maps,
            };
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.getMatchById = getMatchById;
//# sourceMappingURL=match.js.map