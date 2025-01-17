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
exports.getMatches = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
function getMatches() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.MATCHES}`;
        try {
            const body = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const $ = cheerio_1.default.load(body, {
                normalizeWhitespace: true,
            });
            const allContent = $('.upcomingMatch');
            const matches = [];
            allContent.map((_i, element) => {
                const el = $(element);
                const link = el.children('a').attr('href');
                const id = Number(link.split('/')[2]);
                const time = new Date(parseInt(el.find('.matchTime').attr('data-unix'), 10)).toISOString();
                const event = {
                    name: el.find('.matchEventName').text(),
                    logo: el.find('.matchEventLogo').attr('src'),
                };
                const stars = Number(el.attr('stars'));
                const map = el.find('.matchMeta').text();
                const teamsEl = el.find('.matchTeams');
                if (!teamsEl.html()) {
                    return;
                }
                const team1El = teamsEl.find('.matchTeam.team1');
                const team2El = teamsEl.find('.matchTeam.team2');
                const team1 = {
                    id: Number(el.attr('team1')),
                    name: team1El.find('.matchTeamName').text() || 'n/a',
                    logo: team1El.find('.matchTeamLogo').attr('src'),
                };
                const team2 = {
                    id: Number(el.attr('team2')),
                    name: team2El.find('.matchTeamName').text() || 'n/a',
                    logo: team2El.find('.matchTeamLogo').attr('src'),
                };
                const response = {
                    id,
                    time,
                    event,
                    stars,
                    maps: config_1.MAPS[map] || map,
                    teams: [team1, team2],
                };
                matches.push(response);
            });
            if (!matches.length) {
                throw new Error('There are no matches available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api');
            }
            return matches;
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.getMatches = getMatches;
//# sourceMappingURL=matches.js.map