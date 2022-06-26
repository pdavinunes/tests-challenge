import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let user: User;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Balance", () => {

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
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )
  })

  it("should be able to create a statement of type deposit", async () => {
    const payload = {
      amount: 100, 
      user_id: user.id, 
      description: 'deposit test', 
      type: OperationType.DEPOSIT
    }

    const response = await createStatementUseCase.execute(payload);

    expect(response).toHaveProperty("id")
    expect(response.type).toBe(OperationType.DEPOSIT)
    expect(response.user_id).toBe(user.id)
  })

  it("should be able to create a statement of type withdraw", async () => {
    const payloadDeposit = {
      amount: 100, 
      user_id: user.id, 
      description: 'deposit test', 
      type: OperationType.DEPOSIT
    }

    const payloadWithdraw = {
      amount: 50, 
      user_id: user.id, 
      description: 'withdraw test', 
      type: OperationType.WITHDRAW
    }

    await createStatementUseCase.execute(payloadDeposit);
    const response = await createStatementUseCase.execute(payloadWithdraw);

    expect(response).toHaveProperty("id")
    expect(response.type).toBe(OperationType.WITHDRAW)
    expect(response.amount).toBe(50)
  })

  it("should not be able to create a statement with an inexistent user", () => {
    expect(async () => {
      const payloadDeposit = {
        amount: 100, 
        user_id: '1234', 
        description: 'deposit test', 
        type: OperationType.DEPOSIT
      }

      await createStatementUseCase.execute(payloadDeposit);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to make a withdraw if the funds are insufficient", () => {
    expect(async () => {
      const payloadWithdraw = {
        amount: 50, 
        user_id: user.id, 
        description: 'withdraw test', 
        type: OperationType.WITHDRAW
      }

      await createStatementUseCase.execute(payloadWithdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
