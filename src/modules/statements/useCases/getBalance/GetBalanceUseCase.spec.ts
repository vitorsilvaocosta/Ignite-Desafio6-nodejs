import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance",()=>{
  beforeEach(()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository)
  })

  it("should be able to get balance",async ()=>{
    const user = await createUserUseCase.execute({
      name: "test1",
      email: "test2@test.com.br",
      password: "test"
    })

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    const user_id:string = userCreated?.id!;

    await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 120,
      description: "deposito teste"
    })

    const getBalance = await getBalanceUseCase.execute({user_id});

    const userBalance = await inMemoryStatementsRepository.getUserBalance({user_id})

    expect(userBalance.balance).toEqual(getBalance.balance);
  })

  it("should not be able to get balance a non existent user",()=>{
    expect(async ()=>{
      const user_id:string = "123456789";
      await getBalanceUseCase.execute({user_id});
    }).rejects.toBeInstanceOf(AppError);
  })
})
