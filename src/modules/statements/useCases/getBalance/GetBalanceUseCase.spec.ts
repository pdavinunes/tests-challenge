import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let user: User;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {

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
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory, 
      usersRepositoryInMemory
    )
  })

  it("should be able to return a balance of an user", async () => {
    await statementsRepositoryInMemory.create({ 
      amount: 100, 
      user_id: user.id, 
      description: 'test', 
      type: OperationType.DEPOSIT
    })

    const response = await getBalanceUseCase.execute({
      user_id: user.id
    })

    expect(response).toHaveProperty("balance")
    expect(response).toHaveProperty("statement")
    expect(response.statement.length).toBe(1)
  })

  it("should not be able to return a balance of an inexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: '1'
      })
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})