import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe("Create Statement",()=>{
  beforeEach(()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })

  it("should be able to create a new statement",async ()=>{
    const user = await createUserUseCase.execute({
      name: "test1",
      email: "test2@test.com.br",
      password: "test"
    })

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    const user_id:string = userCreated?.id!;

    const statementCreated = await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 120,
      description: "deposito teste"
    })

    expect(statementCreated).toHaveProperty("id")
  })

  it("should not be able to create a new statement a non existent user",()=>{
    expect(async ()=>{
      await createStatementUseCase.execute({
        user_id : "123456789",
        type: "deposit" as OperationType,
        amount: 120,
        description: "deposito teste"
      })
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to create a new statement if don't have enough funds",()=>{
    expect(async ()=>{
      const user = await createUserUseCase.execute({
        name: "test1",
        email: "test2@test.com.br",
        password: "test"
      })

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

      const user_id:string = userCreated?.id!;

      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 120,
        description: "saque teste"
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
