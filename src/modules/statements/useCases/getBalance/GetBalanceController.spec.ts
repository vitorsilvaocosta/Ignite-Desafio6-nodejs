import request from "supertest";
import createConnection from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
let id: string;
let password: string;

describe("Get Balance Controller",()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
    id = uuidV4();
    password = await hash("teste5",8);

    await connection.query(
      `INSERT INTO users(id,name,email,password)
      VALUES('${id}','teste5','teste5@teste5.com.br','${password}')`
    )
  })

  it("should be able get balance",async ()=>{
    const session = await request(app).post("/api/v1/sessions")
    .send({
      email: "teste5@teste5.com.br",
	    password: "teste5"
    })

    const {token} = session.body;

    const response = await request(app).get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toBe(200);
  })

  afterAll(async()=>{
    await connection.query("DELETE FROM users WHERE name = 'teste5'");
    await connection.close();
  })

})
