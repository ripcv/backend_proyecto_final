import { expect } from "chai";
import supertest from "supertest";
import inquirer from "inquirer";
import Mocha from "mocha";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config();

if (process.env.TEST_ENV !== "true") {
  console.log("No se puede ejecutar el test en ambiente de produccion");
  console.log("favor cambiar variable TEST_ENV a true para ejecutarlos");
  process.exit(0);
}

const requester = supertest(process.env.BASE_URL);

const loginAndGetCookie = async () => {
  const loginResponse = await requester
    .post("/api/sessions/login")
    .send({ email: "adminCoder@coder.com", password: "adminCod3r123" });
  let cookie = loginResponse.headers["set-cookie"][0];
  return cookie.split(";")[0];
};

const testProductos = async () => {
  describe("Test Producto", () => {
    let cookie;

    before(async () => {
      cookie = await loginAndGetCookie();
    });

    describe("Test crear Producto", () => {
      it("El endpoit POST /products debe crear un producto correctamente", async () => {
        const productMock = {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          code: faker.string.octal({ length: 6, prefix: "CE" }),
          price: faker.commerce.price(),
          stock: faker.number.int({ min: 15000, max: 35000 }),
          category: faker.commerce.productAdjective(),
          thumbnail: faker.image.url(),
          owner: "66c695afec80fc107f5b752a",
        };
        const response = await requester
          .post("/api/products")
          .set("Cookie", cookie)
          .send(productMock);
        expect(response._body.payload).to.have.property("_id");
      });
    });
    describe("Test Listar Producto por ID", () => {
      it("El endpoit GET /products/:pid listar un producto especifico", async () => {
        const response = await requester
          .get("/api/products/66c695e2ec80fc107f5b7532")
          .set("Cookie", cookie);
        expect(response._body.payload).to.have.property("_id");
      });
    });
    describe("Test Update Producto", () => {
      it("El endpoit PUT /products/:pid debe actualizar un producto ", async () => {
        const productMock = {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          code: faker.string.octal({ length: 6, prefix: "CE" }),
          price: faker.commerce.price(),
        };
        const response = await requester
          .put("/api/products/66c69a7fd16e5a171b7bf1dd")
          .set("Cookie", cookie)
          .send(productMock);
        expect(response._body.payload).to.have.property("acknowledged");
      });
    });
  });
};

const testUsuarios = async () => {
  let cookie;

  before(async () => {
    cookie = await loginAndGetCookie();
  });

  describe("Test Registro de Usuarios", () => {
    it("El endpoit POST /api/sessions/register debe crear un usuario correctamente", async () => {
      const userMock = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int(90),
        password: "123456",
        role: "admin",
      };
      const response = await requester
        .post("/api/sessions/register")
        .send(userMock);
      expect(response._body.payload).to.have.property("_id");
    });
  });
  describe("Test Login de Usuarios", () => {
    it("El endpoit POST /api/sessions/login debe logear un usuario", async () => {
      const response = await requester
        .post("/api/sessions/login")
        .send({ email: "adminCoder@coder.com", password: "adminCod3r123" });

      expect(response._body).to.have.property("message");
    });
  });
  describe("Test Actualización de Usuario", () => {
    it("El endpoit PUT /api/users/:uid debe actualizar un usuario", async () => {
      const userUpdate = {
        updates: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
        },
      };
      const response = await requester
        .put("/api/users/66c69b16c9eb33a073e2703b")
        .set("Cookie", cookie)
        .send(userUpdate);
      expect(response._body).to.have.property("message");
    });
  });
};

const testCarrito = async () => {
  let cookie;

  before(async () => {
    cookie = await loginAndGetCookie();
  });

  describe("Test Listar Carritos", () => {
    it("El endpoit GET /carts debe mostrar todos los carritos existentes", async () => {
      const response = await requester.get("/carts").set("Cookie", cookie);

      expect(response._body).to.have.property("payload");
    });
  });

  describe("Test Listar Carrito por ID Especifico", () => {
    it("El endpoit GET /carts/:cid mostrara un cart especifico", async () => {
      const response = await requester
        .get("/api/carts/66c659594bd5c8812483d087")
        .set("Cookie", cookie);

      expect(response._body.payload).to.have.property("_id");
    });
  });
  describe("Test Agregar producto a Carrito", () => {
    it("El endpoit post /carts mostrara un cart especifico", async () => {
      const product = {
        productId: "66c6968afd8180d31d9d6edc",
      };
      const response = await requester
        .post("/api/carts")
        .set("Cookie", cookie)
        .send(product);
      expect(response._body).to.have.property("message");
    });
  });
};

const runTest = async () => {
  while (true) {
    console.clear();
    const mocha = new Mocha();

    const questions = [
      {
        type: "list",
        name: "opcion",
        message: "Selecciones un test",
        choices: [
          { name: "Test Usuarios", value: "1" },
          { name: "Test Productos", value: "2" },
          { name: "Test Carrito", value: "3" },
          { name: "Salir", value: "4" },
        ],
      },
    ];

    const answers = await inquirer.prompt(questions);

    switch (answers.opcion) {
      case "1":
        mocha.suite.emit("pre-require", global, null, mocha);
        await testUsuarios();
        break;
      case "2":
        mocha.suite.emit("pre-require", global, null, mocha);
        await testProductos();
        break;
      case "3":
        mocha.suite.emit("pre-require", global, null, mocha);
        await testCarrito();
        break;
      case "4":
        process.exit(0);
        break;
      default:
        console.log("Opcion No valida.");
    }

    mocha.run((failures) => {
      process.exitCode = failures ? 1 : 0;
    });
  }
};

runTest();
