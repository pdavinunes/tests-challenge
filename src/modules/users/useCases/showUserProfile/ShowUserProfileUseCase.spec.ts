import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User", () => {

  beforeEach(() => { 
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to show an user', async () => {
    const data = {
      name: "user test",
      email: "user@mail.com",
      password: "1234"
    }

    const user = await createUserUseCase.execute(data);

    const response = await showUserUseCase.execute(user.id)

    expect(response).toHaveProperty("id")
  })

  it('should not be able to show a inexistent user', async () => {
    expect(async () => {
      await showUserUseCase.execute('123')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})  