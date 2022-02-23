import { mongoose } from '@typegoose/typegoose';

export class MongoDB {
  constructor(
    private username: string,
    private password: string,
    private dbName: string
  ) {}

  public connect = async () => {
    try {
      const dbUrl = `mongodb+srv://${this.username}:${this.password}@cluster0.2fjmi.mongodb.net/${this.dbName}?retryWrites=true&w=majority`;
      await mongoose.connect(dbUrl);
      console.log('Connected to database');
    } catch (err) {
      console.log(err);
    }
  };
}
