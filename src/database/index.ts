import { createConnection, getConnectionOptions } from 'typeorm';

(async () => await createConnection(

  Object.assign(await getConnectionOptions(),{
    database: process.env.NODE_ENV === "test" ? "fin_api_test" : "fin_api",
    migrationsRun: true,
  })
))();
export {createConnection};
