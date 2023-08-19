import { CreateAndUpdateProductDto, Product } from '../../models/product';

const productModel = new Product();

describe('Product Model', () => {
  const _productInput: CreateAndUpdateProductDto = {
    name: "productA",
    price: 100,
  };

  function createProduct(input: CreateAndUpdateProductDto) {
    return productModel.create(input);
  }

  function deleteProduct(id: number) {
    return productModel.deleteProduct(id);
  }

  it('should create a product', async () => {
    const resProduct = await createProduct(_productInput);
    await deleteProduct(resProduct.id);
    expect(resProduct).toEqual({id: resProduct.id, ..._productInput});
  });

  it('should get list of products', async () => {
    const resProduct = await createProduct(_productInput);
    const productList = await productModel.getAll();
    await deleteProduct(resProduct.id);

    expect(productList).toContain(resProduct);
  });

  it('should update a product', async () => {
    const resProduct = await createProduct(_productInput);
    const updateProduct: CreateAndUpdateProductDto = {
        name: "productB",
        price: 120,
      };
    const updatedProduct = await productModel.update(resProduct.id, updateProduct);
    await deleteProduct(resProduct.id);
    expect(updatedProduct).toEqual({id:resProduct.id,...updateProduct});
  });

  it('should get a product by id', async () => {
    const resProduct = await createProduct(_productInput);
    const resProductById = await productModel.getById(resProduct.id);
    await deleteProduct(resProduct.id);
    expect(resProductById).toEqual(resProduct);
  });

  it('should delete a product', async () => {
    const resProduct = await createProduct(_productInput);
    const res = await productModel.deleteProduct(resProduct.id);
    expect(res).toBeTrue();
  });
});
