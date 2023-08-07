import supertest from 'supertest';
import app from '../../server';
import { CreateUserDto, UpdateUserDto } from '../../models/user-shopping';

const request = supertest(app);
describe('User handler specification', () => {
  let token: string;
  let userId: string;

  it('should create user successfully.', async (done) => {
    const userData: CreateUserDto = {
      username: 'binhtt22',
      firstName: 'binh',
      lastName: 'tran',
      password: 'abc123',
    };
    const res = await request.post('/user').send(userData);

    const { body, statusCode } = res;
    token = body.token;
    userId = body.id;

    expect(statusCode).toBe(200);
    done();
  });

  // it('should update user successfully.', async (done) => {
  //   const input: UpdateUserDto = {
  //     firstName: 'binh',
  //     lastName: 'tran',
  //   };

  //   const res = await request
  //     .put(`/user/${userId}`)
  //     .send(input)
  //     .set('Authorization', 'Bearer ' + token);

  //   expect(res.statusCode).toBe(200);
  //   done();
  // });

  it('should gets all users successfully.', async (done) => {
    const res = await request
    .get('/user')
    .set('Authorization', 'Bearer ' + token);

    expect(res.statusCode).toBe(200);
    done();
  });

  // it('should get user by id successfully.', async (done) => {
  //   const res = await request
  //   .get(`/user/${userId}`)
  //   .set('Authorization', 'Bearer ' + token);

  //   expect(res.statusCode).toBe(200);
  //   done();
  // });

  // afterAll(async () => {
  //     it('should delete user successfully.', async (done) => {
  //       const res = await request
  //       .delete(`/user/${userId}`)
  //       .set('Authorization', 'Bearer ' + token);

  //       expect(res.statusCode).toBe(200);
  //       done();
  //   });
  // })
});
