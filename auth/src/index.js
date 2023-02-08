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
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const current_user_1 = require("./routes/current-user");
const signin_1 = require("./routes/signin");
const signout_1 = require("./routes/signout");
const signup_1 = require("./routes/signup");
const error_handler_1 = require("./middlewares/error-handler");
const not_found_error_1 = require("./errors/not-found-error");
const app = (0, express_1.default)();
app.set('trust proxy', true);
app.use((0, body_parser_1.json)());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: true,
}));
app.use(current_user_1.currentUserRouter);
app.use(signin_1.signinRouter);
app.use(signout_1.signoutRouter);
app.use(signup_1.signupRouter);
app.all('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new not_found_error_1.NotFoundError();
}));
app.use(error_handler_1.errorHandler);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT key should be defined');
    }
    try {
        yield mongoose_1.default.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('connected to mongodb');
    }
    catch (err) {
        console.error(err);
    }
});
app.listen(3000, () => {
    console.log('listening on port 3000!');
});
start();
