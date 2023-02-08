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
exports.signinRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_1 = require("@jeffliunpm/common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const password_1 = require("../services/password");
const router = express_1.default.Router();
exports.signinRouter = router;
router.post('/api/users/signin', [
    (0, express_validator_1.body)('email').isEmail().withMessage('email must be valid'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield user_1.User.findOne({ email });
    if (existingUser) {
        // const hashedReqPassword = await Password.toHash(password);
        const isPasswordMatch = yield password_1.Password.compare(existingUser.password, password);
        if (isPasswordMatch) {
            const userJwt = jsonwebtoken_1.default.sign({
                id: existingUser.id,
                email: existingUser.email,
            }, process.env.JWT_KEY);
            req.session = { jwt: userJwt };
            return res.status(200).send(existingUser);
        }
        else {
            throw new common_1.BadRequestError('Invalid credentials');
        }
    }
    else {
        throw new common_1.BadRequestError('Invalid credentials');
    }
}));
