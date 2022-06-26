import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => { 
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to create a new user', async () => {
    const data = {
      name: "user test",
      email: "user@mail.com",
      password: "1234"
    }

    const response = await createUserUseCase.execute(data);

    expect(response).toHaveProperty("id");
  })
  
  it('should not be able to create a user with email exists', async () => {
    const errorFn = async () => {
      const data = {
        name: "user test",
        email: "user@mail.com",
        password: "1234"
      }
    
    await createUserUseCase.execute(data);
    await createUserUseCase.execute({...data, name: "user test 2", password: "12346"});
    
    }

    expect(errorFn).rejects.toBeInstanceOf(CreateUserError)
    expect(errorFn).rejects.toEqual({
      "message": "User already exists", 
      "statusCode": 400
    })
  })
})  