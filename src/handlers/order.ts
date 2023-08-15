import { Application, Request, Response } from 'express';
import { verifyAuthToken } from './../ultility/authen-authorize';
import { CreateOrUpdateOrderDto, Orders, OrdersModel, OrdersProductModel } from '../models/orders';

const ordersModel = new Orders();

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders: OrdersModel[] = await ordersModel.getOrders();
    res.json({orders: orders});
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {

    const userid = req.body.userid;
    const products = req.body.products;
    let status = req.body.status;

    if (!userid || !products) {
      res.status(400);
      res.send(
        'Bad request!'
      );
      return false;
    }

    status = status ?? 'A';
    const order = await ordersModel.create({
      products,
      status,
      userid,
    });
    res.json(order);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const status = req.body.status;
    const products = req.body.products;

    if (!id || !status || !products) {
      res.status(400);
      res.send(
        'Bad request!'
      );
      return false;
    }

    const order = await ordersModel.update(id, {
      products,
      status,
      userid: 0
    });

    res.json(order);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }

    const order = await ordersModel.getById(id);
    res.json(order);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const getByUserId = async (req: Request, res: Response) => {
    try {
      const id = req.params.userid as unknown as number;

      if (!id) {
        res.status(400);
        res.send('Bad request!');
        return false;
      }

      const order = await ordersModel.getByUserId(id);
      res.json(order);
    } catch (error) {
      res.status(500);
      res.json(error);
    }
  };



const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }

    await ordersModel.deleteOrder(id);
    res.send("Delete order success!");
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export default function ordersRoutes(app: Application) {
  app.get('/order', verifyAuthToken, getAllOrders);
  app.post('/order', verifyAuthToken, create);
  app.put('/order/:id', verifyAuthToken, update);
  app.get('/order/get-by-id/:id', verifyAuthToken, getById);
  app.get('/order/get-by-user-id/:userid', verifyAuthToken, getByUserId);
  app.delete('/order/:id', verifyAuthToken, deleteOrder);
}
