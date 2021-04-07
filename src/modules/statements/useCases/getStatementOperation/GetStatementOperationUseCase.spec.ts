import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement Operation",()=>{
  beforeEach(()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })

  it("should be able to get statement operation",async ()=>{
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

    const statement_id:string = statementCreated?.id!;

    const getStatOp = await getStatementOperationUseCase.execute({
      user_id,
      statement_id: statement_id
    });

    expect(getStatOp).toHaveProperty("id");
  })

  it("should not be able to get statement operation a non existent user",()=>{
    expect(async ()=>{
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

      const statement_id:string = statementCreated?.id!;

      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id
      });
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to get statement operation a non existent statement",()=>{
    expect(async ()=>{
      const user = await createUserUseCase.execute({
        name: "test1",
        email: "test2@test.com.br",
        password: "test"
      })

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

      const user_id:string = userCreated?.id!;

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "123456"
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
