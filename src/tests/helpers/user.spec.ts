import supertest from 'supertest';
import app from '../../server';
import { CreateUserDto, UpdateUserDto } from '../../models/user-shopping';

const request = supertest(app);
describe('User handler specification', () => {

  const _createUserInput: CreateUserDto = {
    username: 'binhtt22',
    firstName: 'binh',
    lastName: 'tran',
    password: 'abc123',
  };

  async function createFunc(input: CreateUserDto) : Promise<any> {
    const result = await request.post('/user').send(input);
    return { token: result.body.token, userId: result.body.id, statusCode: result.statusCode };
  }

  async function deleteFunc(id: number, token: string) : Promise<any> {
    const result = await request
      .delete(`/user/${id}`)
      .set('Authorization', 'Bearer ' + token);
    return { statusCode: result.statusCode };
  }


  it('should create user successfully.', async (done) => {
    const createUserInput: CreateUserDto = {
      username: 'binhtt123',
      firstName: 'binh',
      lastName: 'tran',
      password: 'abc123',
    };

    const { userId, token, statusCode } = await createFunc(createUserInput);
    await deleteFunc(userId, token);
    expect(statusCode).toBe(200);
    done();
  });

  it('should update user successfully.', async (done) => {
    const input: UpdateUserDto = {
      firstName: 'binh',
      lastName: 'tran',
    };

    const { userId, token } = await createFunc(_createUserInput);

    const res = await request
      .put(`/user/${userId}`)
      .send(input)
      .set('Authorization', 'Bearer ' + token);

    await deleteFunc(userId, token);
    expect(res.statusCode).toBe(200);
    done();
  });

  it('should gets all users successfully.', async (done) => {
    const { userId, token } = await createFunc(_createUserInput);

    const res = await request
    .get('/user')
    .set('Authorization', 'Bearer ' + token);

    await deleteFunc(userId, token);
    expect(res.statusCode).toBe(200);
    done();
  });

  it('should get user by id successfully.', async (done) => {
    const { userId, token } = await createFunc(_createUserInput);

    const res = await request
    .get(`/user/${userId}`)
    .set('Authorization', 'Bearer ' + token);

    await deleteFunc(userId, token);
    expect(res.statusCode).toBe(200);
    done();
  });

  it('should delete user successfully.', async (done) => {
    
    const { userId, token } = await createFunc(_createUserInput);
    const res = await deleteFunc(userId, token);
    
    expect(res.statusCode).toBe(200);
    done();
  });

});
