import request from "supertest";
import {createConnection} from "../../../../database"
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller",()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    connection.runMigrations();
  })

  it("should be able to create a new user",async ()=>{
    const response = await request(app).post("/api/v1/users")
    .send({
      name: "name_test",
      email: "test@test.com.br",
      password:"test"
    })

    expect(response.status).toBe(201);

  })

  afterAll(async()=>{
    await connection.query("DELETE FROM users WHERE name = 'name_test'");
    await connection.close();
  })
})
