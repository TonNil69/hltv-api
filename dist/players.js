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
exports.getTopPlayers = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
function getTopPlayers() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.PLAYERS}`;
        try {
            const body = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const $ = cheerio_1.default.load(body, {
                normalizeWhitespace: true,
            });
            const allContent = $('.stats-table.player-ratings-table tbody tr');
            const players = [];
            allContent.map((_i, element) => {
                const el = $(element);
                const link = el.find('.playerCol').find('a').attr('href');
                const [_, __, ___, id, slug] = link.split('/');
                const td = el.find('td');
                const nickname = td.eq(0).text();
                const team = td.eq(1).find('img').attr('title');
                const maps = td.eq(2).text();
                const kd = td.eq(5).text();
                const rating = td.eq(6).text();
                const response = {
                    id: parseInt(id, 10),
                    team,
                    nickname,
                    slug,
                    mapsPlayed: parseInt(maps, 10),
                    kd: parseFloat(kd),
                    rating: parseFloat(rating),
                };
                players.push(response);
            });
            if (!players.length) {
                throw new Error('There are no players available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api');
            }
            return players;
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.getTopPlayers = getTopPlayers;
//# sourceMappingURL=players.js.map