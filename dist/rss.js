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
const node_fetch_1 = __importDefault(require("node-fetch"));
const xml2js_1 = __importDefault(require("xml2js"));
const config_1 = require("./config");
function validateXML(xml) {
    return xml.slice(0, 5) === `<?xml`;
}
function getRSS(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config_1.CONFIG.BASE}/${config_1.CONFIG.RSS}/${type}`;
        try {
            const xml = yield (yield (0, node_fetch_1.default)(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                },
            })).text();
            const parser = new xml2js_1.default.Parser();
            if (!validateXML(xml)) {
                throw new Error('Invalid XML');
            }
            const result = yield parser.parseStringPromise(xml);
            const { length } = result.rss.channel[0].item;
            const rss = [];
            for (let i = 0; i < length; i += 1) {
                const obj = {
                    title: result.rss.channel[0].item[i].title[0],
                    description: result.rss.channel[0].item[i].description[0],
                    link: result.rss.channel[0].item[i].link[0],
                    time: new Date(result.rss.channel[0].item[i].pubDate[0]).toISOString(),
                };
                rss.push(obj);
            }
            return rss;
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.default = getRSS;
//# sourceMappingURL=rss.js.map