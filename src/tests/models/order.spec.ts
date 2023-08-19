import { CreateOrUpdateOrderDto, Orders } from '../../models/orders';
import { CreateAndUpdateProductDto, Product } from '../../models/product';
import { CreateUserDto, UserShopping } from '../../models/user-shopping';

const orderModel = new Orders();
const userModel = new UserShopping();
const productModel = new Product();

describe('Order Model', () => {
  let order: CreateOrUpdateOrderDto;
  let userid: number;
  let productid: number;

  const userInput: CreateUserDto = {
    username: "binhtt32",
    firstname: "binh",
    lastname: "tran",
    password: "abc123",
  };

  const productInput: CreateAndUpdateProductDto = {
    name: "productA",
    price: 100,
  };

  function createOrder() {
    order = {
      products: [
        {
          productid: productid,
          quantity: 10,
        },
      ],
      userid: userid,
      status: 'A',
    };
    return orderModel.create(order);
  }

  function deleteOrder(id: number) {
    return orderModel.deleteOrder(id);
  }

  beforeAll(async () => {
    const user = await userModel.create(userInput);
    userid = user.id;

    const product = await productModel.create(productInput);
    productid = product.id;

  });

  afterAll(async () => {
    while(userid == 0) {}
    await userModel.delete(userid);
  });

  it('should create an order', async () => {
    const resOrder = await createOrder();
    await deleteOrder(resOrder.id);
    expect(resOrder).toEqual({id: resOrder.id, ...order});
  });

  it('should get list of orders', async () => {
    const resOrder = await createOrder();
    const orderList = await orderModel.getOrders();
    await deleteOrder(resOrder.id);

    expect(orderList).toContain(resOrder);
  });

  it('should update an order', async () => {
    const resOrder = await createOrder();
    const updateOrder: CreateOrUpdateOrderDto = {
      products: [
        {
          productid,
          quantity: 30,
        },
      ],
      userid: userid,
      status: 'I',
    };
    const updatedOrder = await orderModel.update(resOrder.id, updateOrder);
    await deleteOrder(resOrder.id);
    expect(updatedOrder).toEqual({id:resOrder.id,...updateOrder});
  });

  it('should get an order by order id', async () => {
    const resOrder = await createOrder();
    const resOrderById = await orderModel.getById(resOrder.id);
    await deleteOrder(resOrder.id);
    expect(resOrderById).toEqual(resOrder);
  });

  it('should get list of orders by user id', async () => {
    const resOrder = await createOrder();
    const resOrderById = await orderModel.getByUserId(order.userid);
    await deleteOrder(resOrder.id);
    expect(resOrderById).toContain(resOrder);
  });

  it('should delete an order', async () => {
    const resOrder = await createOrder();
    const res = await orderModel.deleteOrder(resOrder.id);
    expect(res).toBeTrue();
  });
});
