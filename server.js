const express = require("express");
const app = express();
const PORT = process.env.PORT || 7070;
const IP = getPrivateIPAddress();

let products = [];
let orders = [];
let users = [];

function getPrivateIPAddress() {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      )
        return alias.address;
    }
  }
  return "0.0.0.0";
}

app.use(express.json());
app.use(express.urlencoded());

const findById = (array, id) => array.find((item) => item.id === id);

const sampleData = () => {
  products = [
    { id: "1", name: "Product 1", price: 100, stock: 10 },
    { id: "2", name: "Product 2", price: 200, stock: 5 },
  ];

  users = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Doe", email: "jane@example.com" },
  ];

  orders = [
    { id: "1", userId: "1", productId: "1", quantity: 1, status: "Pending" },
    { id: "2", userId: "2", productId: "2", quantity: 2, status: "Completed" },
  ];
};

sampleData();

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const product = findById(products, req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.post("/products", (req, res) => {
  const newProduct = { ...req.body, id: (products.length + 1).toString() };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const product = findById(products, req.params.id);
  if (product) {
    Object.assign(product, req.body);
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.delete("/products/:id", (req, res) => {
  const productIndex = products.findIndex((p) => p.id === req.params.id);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.get("/orders/:id", (req, res) => {
  const order = findById(orders, req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

app.post("/orders", (req, res) => {
  const newOrder = {
    ...req.body,
    id: (orders.length + 1).toString(),
    status: "Pending",
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.put("/orders/:id", (req, res) => {
  const order = findById(orders, req.params.id);
  if (order) {
    Object.assign(order, req.body);
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

app.delete("/orders/:id", (req, res) => {
  const order = findById(orders, req.params.id);
  if (order) {
    order.status = "Cancelled";
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

app.post("/users/register", (req, res) => {
  const newUser = { ...req.body, id: (users.length + 1).toString() };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.post("/users/login", (req, res) => {
  const user = users.find((u) => u.email === req.body.email);
  if (user) {
    res.json({ message: "Login successful", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port localhost:${PORT}, network IP:`, IP);
  console.log(`API Endpoints:
		Products:
		- GET /products              # Get all products
		- GET /products/:id          # Get a single product by ID
		- POST /products             # Create a new product
		- PUT /products/:id          # Update a product by ID
		- DELETE /products/:id       # Delete a product by ID

		Orders:
		- GET /orders                # Get all orders
		- GET /orders/:id            # Get a single order by ID
		- POST /orders               # Create a new order
		- PUT /orders/:id            # Update an order by ID
		- DELETE /orders/:id         # Cancel an order by ID

		Users:
		- POST /users/register       # User registration
		- POST /users/login          # User login

		Example Url: http://${IP}:${PORT}/products
`);
});
