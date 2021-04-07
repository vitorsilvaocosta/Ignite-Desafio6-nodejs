import request from "supertest";
import {createConnection} from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
let id: string;
let password: string;

describe("Authenticate User Controller",()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    connection.runMigrations();
    id = uuidV4();
    password = await hash("teste2",8);

    await connection.query(
      `INSERT INTO users(id,name,email,password)
      VALUES('${id}','teste2','teste2@teste2.com.br','${password}')`
    );
  })

  it("should be able authenticate user",async ()=>{
    const response = await request(app).post("/api/v1/sessions")
    .send({
      email: "teste2@teste2.com.br",
	    password: "teste2"
    })

    expect(response.body).toHaveProperty("token");
  })

  afterAll(async()=>{
    await connection.query("DELETE FROM users WHERE name = 'teste2'");
    await connection.close();
  })

})
