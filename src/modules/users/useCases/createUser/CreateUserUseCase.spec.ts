import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User",()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user",async ()=>{
    const user = await createUserUseCase.execute({
      name: "test1",
      email: "test2@test.com.br",
      password: "test"
    })

    const userExist = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userExist).toHaveProperty("id");
  })

  it("should not be able to create a new user if it already exists",()=>{
    expect(async ()=>{
      await createUserUseCase.execute({
        name: "test1",
        email: "test2@test.com.br",
        password: "test"
      })
      await createUserUseCase.execute({
        name: "test1",
        email: "test2@test.com.br",
        password: "test"
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
