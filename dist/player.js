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
exports.getPlayerById = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
function getPlayerById(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.PLAYERS}/${id}/_`;
        try {
            const body = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const $ = cheerio_1.default.load(body, {
                normalizeWhitespace: true,
            });
            const mainTable = $('.playerSummaryStatBox');
            if (!mainTable.html()) {
                throw new Error('There is no player available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api');
            }
            const imageBlock = mainTable.find('.summaryBodyshotContainer');
            const image = imageBlock.children('img').eq(1).attr('src');
            const mainTableContent = mainTable.find('.summaryBreakdownContainer');
            const nickname = mainTableContent.find('.summaryNickname').text();
            const name = mainTableContent.find('.summaryRealname').text().trim();
            const teamName = mainTableContent.find('.SummaryTeamname').text();
            const teamId = Number((_a = mainTableContent
                .find('.SummaryTeamname')
                .find('a')
                .attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[3]);
            const age = parseInt(mainTableContent.find('.summaryPlayerAge').text(), 10);
            const statRow1 = mainTableContent
                .find('.summaryStatBreakdownRow')
                .eq(0)
                .find('.summaryStatBreakdown');
            const rating = parseFloat(statRow1.eq(0).find('.summaryStatBreakdownDataValue').text());
            const dpr = parseFloat(statRow1.eq(1).find('.summaryStatBreakdownDataValue').text());
            const kast = parseFloat(statRow1.eq(2).find('.summaryStatBreakdownDataValue').text());
            const statRow2 = mainTableContent
                .find('.summaryStatBreakdownRow')
                .eq(1)
                .find('.summaryStatBreakdown');
            const impact = parseFloat(statRow2.eq(0).find('.summaryStatBreakdownDataValue').text());
            const apr = parseFloat(statRow2.eq(1).find('.summaryStatBreakdownDataValue').text());
            const kpr = parseFloat(statRow2.eq(2).find('.summaryStatBreakdownDataValue').text());
            const additionalStats = $('.statistics .columns .col');
            const headshots = parseFloat(additionalStats.eq(0).children('.stats-row').eq(1).children('span').eq(1).text());
            const maps = parseInt(additionalStats.eq(0).children('.stats-row').eq(6).children('span').eq(1).text(), 10);
            const player = {
                id: Number(id),
                team: {
                    id: teamId,
                    name: teamName,
                },
                image,
                nickname,
                name,
                age: age || null,
                rating,
                impact: impact || null,
                dpr: dpr || null,
                apr: apr || null,
                kast: kast || null,
                kpr,
                headshots,
                mapsPlayed: maps || null,
            };
            console.log(player);
            return player;
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.getPlayerById = getPlayerById;
//# sourceMappingURL=player.js.map