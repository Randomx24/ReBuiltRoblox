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
exports.AccountInformationController = void 0;
const common_1 = require("@tsed/common");
const swagger_1 = require("@tsed/swagger");
const base_1 = require("../base");
const middleware = require("../../middleware/");
let AccountInformationController = class AccountInformationController extends base_1.default {
    currentAccount(cookie) {
        return __awaiter(this, void 0, void 0, function* () {
            const s = new base_1.default({
                cookie,
            });
            const [birthDate, description, gender] = yield Promise.all([
                s.AccountInformation.getBirthDate(),
                s.AccountInformation.getDescription(),
                s.AccountInformation.getGender(),
            ]);
            return {
                birthDate,
                description,
                gender,
            };
        });
    }
};
__decorate([
    common_1.Get('/current-account'),
    swagger_1.Summary('Get information required for account page'),
    __param(0, common_1.Locals('cookie')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "currentAccount", null);
AccountInformationController = __decorate([
    common_1.Controller('/account-information'),
    common_1.UseBefore(middleware.Auth.AuthenticateRequest, middleware.Auth.YesAuth)
], AccountInformationController);
exports.AccountInformationController = AccountInformationController;
//# sourceMappingURL=AccountInformation.js.map