import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("682816440010f18673ad");

export const account = new Account(client);
