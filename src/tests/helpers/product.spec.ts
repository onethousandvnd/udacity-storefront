import supertest from 'supertest';
import app from '../../server';
import { CreateUserDto } from '../../models/user-shopping';
import { CreateAndUpdateProductDto } from '../../models/product';

const request = supertest(app);

// describe('Product Handler', () => {
//   const product: CreateAndUpdateProductDto = {
//     name: 'productA',
//     price: 100,
//   };

//   let token: string;
//   let userId: number;
//   let productId: number;

//   beforeAll(async () => {
//     const userInput: CreateUserDto = {
//       username: 'binhtt22',
//       firstName: 'binh',
//       lastName: 'tran',
//       password: 'abc123',
//     };

//     const res = await request.post('/user').send(userInput);
//     token = res.body.token;
//     userId = res.body.id;
//   });

//   afterAll(async () => {
//     await request.delete(`/user/${userId}`)
//     .set('Authorization', 'bearer ' + token);
//   });

//   it('should create product successfully', async (done) => {
//     const res = await request
//       .post('/product')
//       .send(product)
//       .set('Authorization', 'bearer ' + token);

//       productId = res.body.id;
//     expect(res.statusCode).toBe(200);
//     done();
//   });

//   it('should get products successfully', async (done) => {
//     const res = await request
//     .get('/product')
//     .set('Authorization', 'bearer ' + token);

//     expect(res.statusCode).toBe(200);
//     done();
//   });

//   it('should get product successfully', async (done) => {
//     const res = await request
//     .get(`/product/${productId}`)
//     .set('Authorization', 'bearer ' + token);

//     expect(res.statusCode).toBe(200);
//     done();
//   });

//   it('should update product successfully', async (done) => {
//     const input: CreateAndUpdateProductDto = {
//       name: 'productB',
//       price: 200,
//     };
//     const res = await request
//       .put(`/product/${productId}`)
//       .send(input)
//       .set('Authorization', 'bearer ' + token);

//     expect(res.statusCode).toBe(200);
//     done();
//   });

//   it('should delete product successfully', async (done) => {
//     const res = await request
//     .delete(`/product/${productId}`)
//     .set('Authorization', 'bearer ' + token);

//     expect(res.statusCode).toBe(200);
//     done();
//   });
// });
