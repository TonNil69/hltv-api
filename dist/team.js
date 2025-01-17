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
exports.getTeamById = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
function getTeamById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.TEAM}/${id}/_`;
        try {
            const body = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const $ = cheerio_1.default.load(body, {
                normalizeWhitespace: true,
            });
            const teamProfile = $('.teamProfile');
            if (!teamProfile.html()) {
                throw new Error('There is no team available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api');
            }
            const lineup = teamProfile.find('.bodyshot-team').children();
            const players = [];
            lineup.each((_i, p) => {
                const player = $(p);
                const countryName = player.find('.flag').attr('title');
                const countryFlag = `${config_1.CONFIG.BASE}${player.find('.flag').attr('src')}`;
                players.push({
                    fullname: player.find('img').attr('title'),
                    image: player.find('img').attr('src'),
                    nickname: player.attr('title'),
                    country: countryName
                        ? {
                            name: countryName,
                            flag: countryFlag,
                        }
                        :
                            undefined,
                });
            });
            const name = teamProfile.find('.profile-team-name').text();
            const logo = teamProfile.find('.teamlogo').attr('src');
            const statsContainer = teamProfile.find('.profile-team-stats-container').children();
            const ranking = Number(statsContainer.eq(0).find('.right').text().replace('#', ''));
            const averagePlayerAge = Number(statsContainer.eq(2).find('.right').text());
            const coach = statsContainer.eq(3).find('.right').text().trim();
            return {
                id,
                name,
                logo,
                ranking,
                coach,
                averagePlayerAge,
                players,
            };
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.getTeamById = getTeamById;
//# sourceMappingURL=team.js.map