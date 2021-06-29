"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@tsed/common");
const swagger_1 = require("@tsed/swagger");
const _ = require("lodash");
const base_1 = require("../base");
let UsersController = class UsersController extends base_1.default {
    scrapeProfileInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.Users.getUserProfileHtml(userId);
            let data = this.Users.processUserProfileHtml(profile);
            return data;
        });
    }
    getFriends(userId, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Friends.getFriends(userId).then(val => {
                if (mode === 'profile') {
                    return {
                        total: val.length,
                        data: _.chunk(_.chunk(val, 6), 4)
                    };
                }
                return {
                    total: val.length,
                    data: val,
                };
            });
        });
    }
};
__decorate([
    common_1.Get('/:userId/profile-info'),
    __param(0, common_1.PathParams('userId', Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "scrapeProfileInfo", null);
__decorate([
    common_1.Get('/:userId/friends'),
    swagger_1.Summary('Get user friends'),
    __param(0, common_1.Required()),
    __param(0, common_1.PathParams('userId', Number)),
    __param(1, common_1.QueryParams('mode', String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFriends", null);
UsersController = __decorate([
    common_1.Controller('/users')
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=Users.js.map