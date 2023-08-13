import supertest from 'supertest';
import app from '../../server';
import { CreateAndUpdateProductDto } from '../../models/product';
import { CreateUserDto } from '../../models/user-shopping';
import { CreateOrUpdateOrderDto } from '../../models/orders';

const request = supertest(app);

describe('Order Handler', () => {
  let token: string;
  let userId: number;
  let productId: number;
  let orderInput: CreateOrUpdateOrderDto;

  async function createFunc(input: CreateOrUpdateOrderDto): Promise<any> {
    const res = await request
    .post('/order')
    .set('Authorization', 'Bearer ' + token)
    .send(input);
    return { id: res.body.id, userId: res.body.userid, status: res.body.status, statusCode: res.statusCode};
  }

  beforeAll(async () => {
    const userInput: CreateUserDto = {
      username: 'binhtt25',
      firstName: 'binh',
      lastName: 'tran',
      password: 'abc123',
    };

    const res = await request
      .post('/user')
      .send(userInput);
    
    token = res.body.token;
    userId = res.body.id;

    const product: CreateAndUpdateProductDto = {
      name: 'productA',
      price: 100,
    };

    const resProduct = await request
      .post('/product')
      .send(product)
      .set('Authorization', 'bearer ' + token);

    productId = resProduct.body.id;

    orderInput = {
        products: [
            {
                productId: productId ?? 1,
                quantity: 10,
            },
            ],
            userId: userId ?? 1,
            status: 'A'
    }
  });

  afterAll(async () => {
    await request
      .delete(`/user/${userId}`)
      .set("Authorization", "bearer " + token);
  });


  it('should create order successfully', async (done) => {
    const res = await createFunc(orderInput);
    
    expect(res.statusCode).toBe(200);
    done();
  });

  it('should get all orders successfully', async (done) => {
    const res = await request
      .get('/order')
      .set('Authorization', 'Bearer ' + token)

    expect(res.statusCode).toBe(200);
    done();
  });

  it('should get order by id successfully', async (done) => {
    const { id } = await createFunc(orderInput);
    const res = await request
      .get(`/order/get-by-id/${id}`)
      .set('Authorization', 'Bearer ' + token)

    expect(res.statusCode).toBe(200);
    done();
  });

  it('should get order by user id successfully', async (done) => {
    const { userId } = await createFunc(orderInput);
    const res = await request
      .get(`/order/get-by-user-id/${userId}`)
      .set('Authorization', 'Bearer ' + token)

    expect(res.statusCode).toBe(200);
    done();
  });

  it('should delete order successfully', async (done) => {
    const { id } = await createFunc(orderInput);
    const res = await request
      .delete(`/order/${id}`)
      .set('Authorization', 'Bearer ' + token)

    expect(res.statusCode).toBe(200);
    done();
  });
});
