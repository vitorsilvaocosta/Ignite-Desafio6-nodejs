import request from "supertest";
import {createConnection} from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
let id: string;
let password: string;

describe("Get Statement Operation Controller",()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    connection.runMigrations();
    id = uuidV4();
    password = await hash("teste6",8);

    await connection.query(
      `INSERT INTO users(id,name,email,password)
      VALUES('${id}','teste6','teste6@teste6.com.br','${password}')`
    );
  })

  it("should be able to get statement operation",async()=>{
    const session = await request(app).post("/api/v1/sessions")
    .send({
      email: "teste6@teste6.com.br",
	    password: "teste6"
    })

    const {token} = session.body;

    const statementResponse = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 120,
      description: "deposito teste"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    const {id: statement_id} = statementResponse.body;

    const response = await request(app).get(`/api/v1/statements/${statement_id}`)
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  })

  afterAll(async()=>{
    await connection.query("DELETE FROM users WHERE name = 'teste6'");
    await connection.close();
  })

})
