# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
Get all products: [GET|Token required] '/product'
Create a product: [POST|Token required] '/product'
Update a product: [PUT|Token required] '/product/:id'
Get a product: [GET|Token required] '/product/:id'
Delete a product: [DELETE|Token required] '/product/:id'

#### Users
Get all users: [GET|Token required] '/user'
Create a user: [POST] '/user'
Get a user by id: [GET|Token required] '/user/:id'
Update a user by id: [PUT|Token required] '/user/:id'
Delete a user: [DELETE|Token required] '/user/:id'
Get token: [POST] '/user/authenticate'

#### Orders
Get all orders: [GET|Token required] '/order'
Create an order: [POST|Token required] '/order'
Update an order: [PUT|Token required] '/order/:id'
Get an order by id: [GET|Token required] '/order/get-by-id/:id'
Get an order by user id: [GET|Token required] '/order/get-by-user-id/:userid'
Delete an order: [DELETE|Token required] '/order/:id'

## Data Shapes
#### Product
- id: number
- name: string
- price: number

#### User
- id: number
- firstname: string
- lastname: string
- username: string
- password: string

#### Orders
- id: number
- userid: number
- status: string

#### OrderItems
- id: number
- ordersid: number
- productid: number
- quantity: number
