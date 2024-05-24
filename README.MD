
# Venta de Entradas

Aplicación para la venta online de tickets para distintos eventos



## API Reference

#### Get all products

```http
  GET /api/products
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `limit` | `int` |  `limita la cantidad de productos a mostrar, por defecto es 0`| 

#### Get single product

```http
  GET /api/products/${pid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of item to fetch |


#### Create a product

```http
  POST /api/products/${pid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required**. Title of Event |
| `description`      | `string` | **Required**. Description of Event |
| `code`      | `string` | **Required**. Code of Event |
| `price`      | `number` | **Required**. Price of Event |
| `stock`      | `number` | **Required**. Stock tickets |
| `category`      | `string` | **Required**. Category of Event |
| `thumbnails`      | `string` | Picture or Flayer |


#### Update a product

```http
  PUT /api/products/${pid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` |  Title of Event |
| `description`      | `string` |  Description of Event |
| `code`      | `string` |  Code of Event |
| `price`      | `number` |  Price of Event |
| `stock`      | `number` |  Stock tickets |
| `category`      | `string` |  Category of Event |
| `thumbnails`      | `string` | Picture or Flayer |


#### Delete a product

```http
  DELETE /api/products/${pid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of event to delete |



#### Get a Cart

```http
  GET /api/carts/${cid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of item to fetch |



#### Create a Cart

```http
  POST /api/carts/${:pid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `productId`      | `number` | ID of Product to add (optional) |


#### Add o Update product to existent Cart

```http
  PUT /api/carts/${cid}/products/${pid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cid`      | `number` | **Required**. ID of cart |
| `pid`      | `number` | **Required**. ID of Product to add |

If body is empty quantity is 1.

```json
{
    "quantity":2
}
```



#### Empty Carts

```http
  DELETE /api/carts/${cid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cid`      | `number` | **Required**. ID of cart |

Delete all products from cart

#### Empty Carts

```http
  DELETE /api/carts/${cid}/products/${:pid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cid`      | `number` | **Required**. ID of cart |
| `pid`      | `number` | **Required**. ID of Product|

Delete specific  products from cart


## Authors

- [@Rodolfo Cavieres](https://github.com/ripcv/)

