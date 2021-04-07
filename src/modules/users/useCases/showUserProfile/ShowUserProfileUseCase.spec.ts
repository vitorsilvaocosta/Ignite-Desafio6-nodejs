import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile",()=>{

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("should be able to show user profile",async ()=>{
    const user: ICreateUserDTO = {
      name: "Vitor test",
      password: "123456",
      email: "vitorotiv_silva@hotmail.com"
    }

    const {id} = await createUserUseCase.execute(user);

    const result = await showUserProfileUseCase.execute(`${id}`);

    expect(result).toHaveProperty("id");
  })

  it("should not be able to show user profile an not existent user",()=>{
    expect(async ()=>{
      const user: ICreateUserDTO = {
        name: "Vitor test",
        password: "123456",
        email: "vitorotiv_silva@hotmail.com"
      }

      const {id} = await createUserUseCase.execute(user);

     await showUserProfileUseCase.execute(`1234567`);

    }).rejects.toBeInstanceOf(AppError);
  })
})
