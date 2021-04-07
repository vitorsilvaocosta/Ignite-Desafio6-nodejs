import request from "supertest";
import {createConnection} from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
let id: string;
let password: string;

describe("Create Statement Controller",()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    connection.runMigrations();
    id = uuidV4();
    password = await hash("teste4",8);

    await connection.query(
      `INSERT INTO users(id,name,email,password)
      VALUES('${id}','teste4','teste4@teste4.com.br','${password}')`
    );
  })

  it("should be able to create a new statement deposit",async()=>{
    const session = await request(app).post("/api/v1/sessions")
    .send({
      email: "teste4@teste4.com.br",
	    password: "teste4"
    })

    const {token} = session.body;

    const response = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 120,
      description: "deposito teste"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
  })

  it("should be able to create a new statement withdraw",async()=>{
    const session = await request(app).post("/api/v1/sessions")
    .send({
      email: "teste4@teste4.com.br",
	    password: "teste4"
    })

    const {token} = session.body;

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 120,
      description: "saque teste"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
  })

  afterAll(async()=>{
    await connection.query("DELETE FROM users WHERE name = 'teste4'");
    await connection.close();
  })

})
