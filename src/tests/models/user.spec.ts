import { CreateUserDto, UserShopping } from '../../models/user-shopping';

const userModel = new UserShopping();

describe('User Model', () => {

  const _userInput: CreateUserDto = {
    username: "binhtt42",
    firstname: "binh",
    lastname: "tran",
    password: "abc123",
  };


  function createUser(input: CreateUserDto) {
    return userModel.create(input);
  }

  function deleteUser(id: number) {
    return userModel.delete(id);
  }

  it('should create a user', async () => {
    const resUser = await createUser(_userInput);
    await deleteUser(resUser.id);
    expect(resUser).toEqual(resUser);
  });

  it('should get list of users', async () => {
    const resUser = await createUser(_userInput);
    const userList = await userModel.getAll();
    await deleteUser(resUser.id);

    expect(userList).toContain(resUser);
  });

  it('should update an user', async () => {
    const resUser = await createUser(_userInput);
    const updateUser: CreateUserDto = {
        username: "binhtt42",
        firstname: "binh123",
        lastname: "tran44",
        password: "abc123",
      };
      
    const updatedUser = await userModel.update(resUser.id, updateUser);
    await deleteUser(resUser.id);
    expect({ firstname: updatedUser.firstname, lastname: updatedUser.lastname})
        .toEqual({ firstname: updateUser.firstname, lastname: updateUser.lastname});
  });

  it('should get an user by id', async () => {
    const resUser = await createUser(_userInput);
    const resUserById = await userModel.getById(resUser.id);
    await deleteUser(resUser.id);
    expect(resUserById).toEqual(resUser);
  });

  it('should delete an user', async () => {
    const resUser = await createUser(_userInput);
    const res = await userModel.delete(resUser.id);
    expect(res).toBeTrue();
  });

  it('should authen successfully', async () => {
    const resUser = await createUser(_userInput);
    const res = await userModel.authenticate(_userInput.username, _userInput.password);
    await deleteUser(resUser.id);
    expect(res).toEqual(resUser);
  });
});
