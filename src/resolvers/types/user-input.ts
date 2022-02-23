import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  confirmPassword: string;
}
