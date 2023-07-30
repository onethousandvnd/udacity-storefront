import client from "../database";

export interface ProductModel {
  id: number;
  name: string;
  price: number;
}

export interface CreateAndUpdateProductDto {
  name: string;
  price: number;
}

export class Product {
  async getAll(): Promise<ProductModel[]> {
    const connection = await client.connect();
    try {
      const sql = "SELECT * FROM product";
      const result = await connection.query<ProductModel>(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`System error! Cannot get products.`);
    } finally {
      connection.release();
    }
  }

  async create(
    createProductInput: CreateAndUpdateProductDto
  ): Promise<ProductModel> {
    const { name, price } = createProductInput;
    const connection = await client.connect();
    try {
      const sql =
        "INSERT INTO product (name, price) VALUES($1, $2) RETURNING *";
      const result = await connection.query<ProductModel>(sql, [name, price]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`System error! Cannot create product.`);
    } finally {
      connection.release();
    }
  }

  async update(
    id: number,
    updateProductInput: CreateAndUpdateProductDto
  ): Promise<ProductModel> {
    const { name, price } = updateProductInput;
    const connection = await client.connect();
    try {
      const checkProductSql = "SELECT * FROM product WHERE id=$1";
      let checkResult = await connection.query<ProductModel>(checkProductSql, [
        id,
      ]);

      if (checkResult.rowCount == 0) {
        throw new Error(`Product does not exist!`);
      }

      const sql =
        "UPDATE product SET name=$1, price=$2 WHERE id=$3 RETURNING *";
      const result = await connection.query<ProductModel>(sql, [
        name,
        price,
        id,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`System error! Cannot update product.`);
    } finally {
      connection.release();
    }
  }

  async show(id: number): Promise<ProductModel> {
    const connection = await client.connect();
    try {
      const checkProductSql = "SELECT * FROM product WHERE id=$1";
      let checkResult = await connection.query<ProductModel>(checkProductSql, [
        id,
      ]);

      if (checkResult.rowCount == 0) {
        throw new Error(`Product does not exist!`);
      }

      const sql = "SELECT * FROM product WHERE id=$1";
      const result = await connection.query<ProductModel>(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`System error! Cannot get product.`);
    } finally {
      connection.release();
    }
  }

  async deleteProduct(id: number): Promise<ProductModel> {
    const connection = await client.connect();
    try {
      const checkProductSql = "SELECT * FROM product WHERE id=$1";
      let checkResult = await connection.query<ProductModel>(checkProductSql, [
        id,
      ]);

      if (checkResult.rowCount == 0) {
        throw new Error(`Product does not exist!`);
      }

      const sql = "DELETE FROM product WHERE id=($1)";
      const result = await connection.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Can not delete product.`);
    } finally {
      connection.release();
    }
  }
}
