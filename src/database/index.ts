import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async(): Promise<Connection> =>{
  return await createConnection({
    type: "postgres",
    port: 5432,
    host: "localhost", //colocar localhost para migration:run
    username: "ignite",
    password: "ignite",
    database: process.env.NODE_ENV === "test" ? "fin_api_test" : "fin_api",
    migrationsRun: true,
    entities: [
      "./src/modules/**/entities/*.ts"
    ],
    migrations: [
      "./src/database/migrations/*.ts"
    ],
  });
}
