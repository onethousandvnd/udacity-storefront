import { Application, Request, Response } from 'express';
import { verifyAuthToken } from './../ultility/authen-authorize';
import { CreateOrUpdateOrderDto, Orders, OrdersModel, OrdersProductModel } from '../models/orders';

const ordersModel = new Orders();

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders: OrdersModel[] = await ordersModel.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {

    const userId = req.body.userId;
    const products = req.body.products;
    let status = req.body.status;

    if (!userId || !products) {
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
      userId,
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
    const userId = req.body.userId;
    const status = req.body.status;
    const products = req.body.products;

    if (!id || !userId || !status || !products) {
      res.status(400);
      res.send(
        'Bad request!'
      );
      return false;
    }

    const order = await ordersModel.update(id, {
      products,
      status,
      userId,
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
      const id = req.params.userId as unknown as number;

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



const deleteOrders = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }

    await ordersModel.deleteOrders(id);
    res.send("Delete order success!");
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export default function ordersRoutes(app: Application) {
  app.get('/orders', verifyAuthToken, getAllOrders);
  app.post('/order', verifyAuthToken, create);
  app.put('/order/:id', verifyAuthToken, update);
  app.get('/order/get-by-id/:id', verifyAuthToken, getById);
  app.get('/order/get-by-user-id/:userId', verifyAuthToken, getByUserId);
  app.delete('/order/:id', verifyAuthToken, deleteOrders);
}
