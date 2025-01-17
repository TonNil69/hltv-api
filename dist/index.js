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
const match_1 = require("./match");
const matches_1 = require("./matches");
const results_1 = require("./results");
const players_1 = require("./players");
const player_1 = require("./player");
const teams_1 = require("./teams");
const team_1 = require("./team");
const rss_1 = __importDefault(require("./rss"));
exports.default = {
    getNews: () => __awaiter(void 0, void 0, void 0, function* () { return (0, rss_1.default)('news'); }),
    getResults: results_1.getResults,
    getMatchById: match_1.getMatchById,
    getMatches: matches_1.getMatches,
    getTopPlayers: players_1.getTopPlayers,
    getPlayerById: player_1.getPlayerById,
    getTopTeams: teams_1.getTopTeams,
    getTeamById: team_1.getTeamById,
};
//# sourceMappingURL=index.js.map