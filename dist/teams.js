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
exports.getTopTeams = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
function getTopTeams() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.TEAMS}`;
        try {
            const body = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const $ = cheerio_1.default.load(body, {
                normalizeWhitespace: true,
            });
            const allContent = $('.ranked-team');
            const teams = [];
            allContent.map((_i, element) => {
                const el = $(element);
                const id = Number(el.find('.moreLink').attr('href').split('/')[2]);
                const ranking = parseInt(el.find('.position').text().replace('#', ''), 10);
                const logo = el.find('.team-logo').find('img').attr('src');
                const name = el.find('.teamLine').find('.name').text();
                const players = [];
                el.find('.lineup')
                    .children()
                    .children()
                    .children()
                    .each((__i, p) => {
                    const player = $(p).find('a');
                    const pic = player.find('.playerPicture');
                    const nick = player.find('.nick');
                    const country = nick.find('img');
                    players.push({
                        fullname: pic.attr('title'),
                        image: pic.attr('src'),
                        nickname: nick.text(),
                        country: {
                            name: country.attr('title'),
                            flag: `${config_1.CONFIG.BASE}${country.attr('src')}`,
                        },
                    });
                });
                const response = {
                    id,
                    ranking,
                    name,
                    logo,
                    players,
                };
                teams[teams.length] = response;
            });
            if (!teams.length) {
                throw new Error('There are no teams available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api');
            }
            return teams;
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.getTopTeams = getTopTeams;
//# sourceMappingURL=teams.js.map