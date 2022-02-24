"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class MongoDB {
    constructor(username, password, dbName) {
        this.username = username;
        this.password = password;
        this.dbName = dbName;
        this.connect = async () => {
            try {
                const dbUrl = `mongodb+srv://${this.username}:${this.password}@cluster0.2fjmi.mongodb.net/${this.dbName}?retryWrites=true&w=majority`;
                await typegoose_1.mongoose.connect(dbUrl);
                console.log('Connected to database');
            }
            catch (err) {
                console.log(err);
            }
        };
    }
}
exports.MongoDB = MongoDB;
//# sourceMappingURL=database.js.map