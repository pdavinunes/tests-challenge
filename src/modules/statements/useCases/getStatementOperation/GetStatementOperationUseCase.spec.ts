import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let user: User;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement", () => {

  beforeAll(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    user = await usersRepositoryInMemory.create({
      name: 'test',
      email: 'test@test',
      password: '1234'
    })
  })

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )
  }) 

  it("should be able to receive a statement", async () => {
    const statement = await statementsRepositoryInMemory.create({ 
      amount: 100, 
      user_id: user.id, 
      description: 'test', 
      type: OperationType.DEPOSIT
    })

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })

    expect(statement).toHaveProperty("id")
    expect(statement.user_id).toBe(user.id)
  })

  it("should not be able to receive a statement with a inexistent user", () => {
    expect(async () => {
      const statement = await statementsRepositoryInMemory.create({ 
        amount: 100, 
        user_id: user.id, 
        description: 'test', 
        type: OperationType.DEPOSIT
      })

      await getStatementOperationUseCase.execute({
        user_id: '1233',
        statement_id: statement.id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("should not be able to receive an inexistent statement", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: '1233'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})