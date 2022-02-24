"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const authChecker = async ({ root, args, context, info }, roles) => {
    try {
        const { user } = context;
        console.log(user);
        if (roles.length === 0)
            return user !== undefined;
        if (roles.includes(user.role))
            return true;
        return false;
    }
    catch (error) {
        throw new apollo_server_express_1.AuthenticationError('Cannot authenticate user');
    }
};
exports.authChecker = authChecker;
//# sourceMappingURL=auth-checker.js.map