import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () =>{

  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate an user",async ()=>{
    const user: ICreateUserDTO = {
      name: "Vitor test",
      password: "123456",
      email: "vitorotiv_silva@hotmail.com"
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: "vitorotiv_silva@hotmail.com",
      password: "123456"
    })

    expect(result).toHaveProperty("token");
  })

  it("should not be able to authenticate an not existent user",()=>{
    expect(async ()=>{

      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "falsepassword"
      })

    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to authenticate with incorrect password",()=>{
    expect(async () =>{

      const user: ICreateUserDTO = {
        name: "Vitor test",
        password: "123456",
        email: "vitorotiv_silva@hotmail.com"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "falsepassword"
      })

    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to authenticate with incorrect email",()=>{
    expect(async () =>{

      const user: ICreateUserDTO = {
        name: "Vitor test",
        password: "123456",
        email: "vitorotiv_silva@hotmail.com"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "falseemail",
        password: user.password
      })

    }).rejects.toBeInstanceOf(AppError);
  })
})
