import supertest from 'supertest';
import app from '../../server';
import { CreateAndUpdateProductDto } from '../../models/product';
import { CreateUserDto } from '../../models/user-shopping';
import { CreateOrUpdateOrderDto } from '../../models/orders';

const request = supertest(app);

// describe('Order Handler', () => {
//   let token: string;
//   let userId: number;
//   let productId: number;
//   let orderId: number;

//   beforeAll(async () => {
//     const userInput: CreateUserDto = {
//       username: 'binhtt22',
//       firstName: 'binh',
//       lastName: 'tran',
//       password: 'abc123',
//     };

//     const res = await request
//       .post('/user')
//       .send(userInput);

//     token = res.body.token;
//     userId = res.body.id;

//     const product: CreateAndUpdateProductDto = {
//       name: 'productA',
//       price: 100,
//     };

//     const resProduct = await request
//       .post('/product')
//       .send(product)
//       .set('Authorization', 'bearer ' + token);

//       productId = resProduct.body.id;
//   });

//   it('should create order successfully', async (done) => {
//     const res = await request
//       .post('/order')
//       .set('Authorization', 'Bearer ' + token)
//       .send({
//         products: [
//           {
//             productId: productId,
//             quantity: 10,
//           },
//         ],
//         userId: userId,
//         status: 'A',
//       } as CreateOrUpdateOrderDto);
    
//     orderId = res.body.id;
//     expect(res.statusCode).toBe(200);
//     done();
//   });

//   it('should get all orders successfully', async (done) => {
//     const res = await request
//       .get('/order')
//       .set('Authorization', 'Bearer ' + token)

//     expect(res.statusCode).toBe(200);
//     done();
//   });

//   it('should get order by id successfully', async (done) => {
//     const res = await request
//       .get(`/order/${orderId}`)
//       .set('Authorization', 'Bearer ' + token)

//     expect(res.statusCode).toBe(200);
//     done();
//   });

//   it('should delete order successfully', async (done) => {
//     const res = await request
//       .delete(`/order/${orderId}`)
//       .set('Authorization', 'Bearer ' + token)

//     expect(res.statusCode).toBe(200);
//     done();
//   });
// });
