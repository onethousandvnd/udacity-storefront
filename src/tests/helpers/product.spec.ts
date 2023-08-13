import supertest from "supertest";
import app from "../../server";
import { CreateUserDto } from "../../models/user-shopping";
import { CreateAndUpdateProductDto } from "../../models/product";

const request = supertest(app);

describe("Product Handler", () => {
  const product: CreateAndUpdateProductDto = {
    name: "productA",
    price: 100,
  };

  let token: string;
  let userId: number;
  let productId: number;

  async function createFunc(input: CreateAndUpdateProductDto): Promise<any> {
    const res = await request
      .post("/product")
      .send(input)
      .set("Authorization", "bearer " + token);
    return {
      id: res.body.product.id,
      name: res.body.product.name,
      price: res.body.product.price,
      statusCode: res.statusCode,
    };
  }

  beforeAll(async () => {
    const userInput: CreateUserDto = {
      username: "binhtt23",
      firstName: "binh",
      lastName: "tran",
      password: "abc123",
    };

    const res = await request.post("/user").send(userInput);
    token = res.body.token;
    userId = res.body.id;
  });

  afterAll(async () => {
    await request
      .delete(`/user/${userId}`)
      .set("Authorization", "bearer " + token);
  });

  it("should create product successfully", async (done) => {
    const resProduct = await createFunc(product);

    expect(resProduct.statusCode).toBe(200);
    done();
  });

  it("should get products successfully", async (done) => {
    const res = await request
      .get("/product")
      .set("Authorization", "bearer " + token);

    expect(res.statusCode).toBe(200);
    done();
  });

  it("should get product by id successfully", async (done) => {
    const { id } = await createFunc(product);

    const res = await request
      .get(`/product/${id}`)
      .set("Authorization", "bearer " + token);

    expect(res.statusCode).toBe(200);
    done();
  });

  it("should update product successfully", async (done) => {
    const { id } = await createFunc(product);

    const input: CreateAndUpdateProductDto = {
      name: "productB",
      price: 200,
    };
    const res = await request
      .put(`/product/${id}`)
      .send(input)
      .set("Authorization", "bearer " + token);

    expect(res.statusCode).toBe(200);
    done();
  });

  it("should delete product successfully", async (done) => {
    const { id } = await createFunc(product);

    const res = await request
      .delete(`/product/${id}`)
      .set("Authorization", "bearer " + token);

    expect(res.statusCode).toBe(200);
    done();
  });
});
