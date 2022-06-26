import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Auth User", () => {

  beforeEach(() => { 
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to authenticate an user', async () => {

    const data = {
      name: "user test",
      email: "user@mail.com",
      password: "1234"
    }

    await createUserUseCase.execute(data)

    const response = await authenticateUserUseCase.execute({
      email: data.email, 
      password: data.password
    })

    expect(response).toHaveProperty("token")
    expect(response).toHaveProperty("user")
  })

  it('should not be able to authenticate an inexistent user', async () => {
    expect(async () => {
      const data = {
        name: "user test",
        email: "user@mail.com",
        password: "1234"
      }
  
      const response = await authenticateUserUseCase.execute({
        email: data.email, 
        password: data.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate an user with wrong password', async () => {
    expect(async () => {
      const data = {
        name: "user test",
        email: "user@mail.com",
        password: "1234"
      }
  
      const response = await authenticateUserUseCase.execute({
        email: data.email, 
        password: '12345'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})  