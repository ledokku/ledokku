import { Field, ID, ObjectType } from "type-graphql";
import { Settings as SettingsClass } from "@prisma/client"

@ObjectType()
export class Settings implements SettingsClass {
    @Field(type => ID)
    id: string;

    @Field(type => [String])
    allowedEmails: string[]
}