import request from "supertest";
import {createConnection} from "../../../../database"
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
let id: string;
let password: string;

describe("Show User Profile",()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    connection.runMigrations();
    id = uuidV4();
    password = await hash("teste3",8);

    await connection.query(
      `INSERT INTO users(id,name,email,password)
      VALUES('${id}','teste3','teste3@teste3.com.br','${password}')`
    );
  })

  it("should be able show user profile",async ()=>{
    const session = await request(app).post("/api/v1/sessions")
    .send({
      email: "teste3@teste3.com.br",
	    password: "teste3"
    })

    const {token} = session.body;

    const response = await request(app).get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toBe(200);
  })

  afterAll(async()=>{
    await connection.query("DELETE FROM users WHERE name = 'teste3'");
    await connection.close();
  })

})
