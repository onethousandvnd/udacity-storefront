import Client from "../database";

export interface OrdersInterface {
  id: number;
  userId: number;
  status: string;
}

export interface OrdersProductModel {
  productId: number;
  quantity: number;
}

export interface OrdersModel {
  id: number;
  userId: number;
  status: string;
  products: OrdersProductModel[];
}

export class Orders {
  async getOrders(): Promise<OrdersModel[]> {
    const connection = await Client.connect();
    try {
      const sql = "SELECT * FROM Orders";
      const result = await connection.query<OrdersInterface>(sql);

      const getOrderProductSql =
        "SELECT productId, quantity FROM orderItems WHERE ordersId=$1";
      const Orders: OrdersModel[] = [];

      for (const order of result.rows) {
        const resultOrderItem = await connection.query<OrdersProductModel>(
          getOrderProductSql,
          [order.id]
        );
        Orders.push({
          ...order,
          products: resultOrderItem.rows,
        });
      }
      return Orders;
    } catch (err) {
      throw new Error(`System error! Cannot get orders.`);
    } finally {
      connection.release();
    }
  }

  async create(createOrderInput: OrdersModel): Promise<OrdersModel> {
    const { products, status, userId } = createOrderInput;
    const connection = await Client.connect();

    try {
      const insertOrderSql =
        "INSERT INTO Orders (userId, status) VALUES($1, $2) RETURNING *";
      const result = await connection.query<OrdersModel>(insertOrderSql, [userId, status]);
      const order = result.rows[0];

      const insertOrderProductsSql =
        "INSERT INTO orderItems (ordersId, productId, quantity) VALUES($1, $2, $3) RETURNING productId, quantity";
      const orderProducts: OrdersProductModel[] = [];

      for (const product of products) {
        const { productId, quantity } = product;
        const result = await connection.query<OrdersProductModel>(insertOrderProductsSql, [
          order.id,
          productId,
          quantity,
        ]);
        orderProducts.push(result.rows[0]);
      }

      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`System error! Cannot create order.`);
    } finally {
      connection.release();
    }
  }

  async update(id: number, updateOrderInput: OrdersModel): Promise<OrdersModel> {
    const { products, status, userId } = updateOrderInput;
    const connection = await Client.connect();

    try {
      const sql = "UPDATE Orders SET status = $1 WHERE id = $2 RETURNING *";
      const result = await connection.query<OrdersInterface>(sql, [status, id]);
      const order = result.rows[0];

      const deleteSql = "DELETE FROM orderItems WHERE ordersId = $1";
      await connection.query(deleteSql, [updateOrderInput.id]);

      const insertOrderProductsSql =
        "INSERT INTO orderItems (ordersId, productId, quantity) VALUES($1, $2, $3) RETURNING productId, quantity";
      const orderProducts: OrdersProductModel[] = [];

      for (const product of products) {
        const result = await connection.query<OrdersProductModel>(insertOrderProductsSql, [
          order.id,
          product.productId,
          product.quantity,
        ]);
        orderProducts.push(result.rows[0]);
      }

      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`System error! Cannot update order.`);
    } finally {
      connection.release();
    }
  }

  async getById(id: number): Promise<OrdersModel> {
    const connection = await Client.connect();
    try {
      const sql = "SELECT * FROM orders WHERE id=$1";
      const result = await connection.query(sql, [id]);

      if (result.rowCount == 0) {
        throw new Error(`Order does not exist!`);
      }

      const order = result.rows[0];
      const getOrderProductSql =
        "SELECT productId, quantity FROM orderItems WHERE ordersId=$1";
      const resultOrderItem = await connection.query<OrdersProductModel>(
        getOrderProductSql,
        [id]
      );
      return {
        ...order,
        products: resultOrderItem.rows,
      };
    } catch (err) {
      throw new Error(`System error! Cannot find order.`);
    } finally {
      connection.release();
    }
  }

  async getByUserId(id: number): Promise<OrdersModel[]> {
    const connection = await Client.connect();
    try {
      const sql = "SELECT * FROM orders WHERE userId=$1";
      const result = await connection.query<OrdersInterface>(sql, [id]);

      if (result.rowCount == 0) {
        throw new Error(`Orders not found!`);
      }

      const getOrderProductSql =
        "SELECT productId, quantity FROM orderItems WHERE ordersId=$1";
      const ordersModel: OrdersModel[] = [];

      for (const order of result.rows)
      {
        const resultOrderItem = await connection.query<OrdersProductModel>(
          getOrderProductSql,
          [order.id]
        );

        ordersModel.push({
          ...order,
          products: resultOrderItem.rows
        })
      }
      
      return ordersModel;
    } catch (err) {
      throw new Error(`System error! Cannot get orders.`);
    } finally {
      connection.release();
    }
  }

  async deleteOrders(ordersId: number): Promise<OrdersInterface> {
    const connection = await Client.connect();
    try {
      const checkOrderSql = "SELECT * FROM orders WHERE id=$1";
      let checkResult = await connection.query<OrdersInterface>(checkOrderSql, [
        ordersId,
      ]);

      if (checkResult.rowCount == 0) {
        throw new Error(`Order does not exist!`);
      }

      const getOrderProductsSql = "DELETE FROM orderItems WHERE ordersId=$1";
      await connection.query(getOrderProductsSql, [ordersId]);

      const sql = "DELETE FROM orders WHERE id=$1";
      const result = await connection.query<OrdersInterface>(sql, [ordersId]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`System error! Cannot delete order.`);
    } finally {
      connection.release();
    }
  }
}
