let productController = module.exports;
const Definer = require("../lib/mistake");
const Product = require("../models/Product");
const assert = require("assert");

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST cont.getAllProducts");
    const product = new Product();
    const result = await product.getAllProductsData(req.member, req.body);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont.getAllProducts", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getUserProducts = async (req, res) => {
  try {
    console.log("GET cont.getUserProducts");
    //todo:get user data
    // res.locals.member.mb_type = "USER";
    const product = new Product();
    const result = await product.getUserProductsData(req.member);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont.getUserProducts", err.message);
    res.json({ state: "fail", message: err.message });
  }
};
productController.getAllProductsElectric = async (req, res) => {
  try {
    console.log("POST cont.getAllProducts");
    const product = new Product();
    const result = await product.getAllProductsElectricData(
      req.member,
      req.body
    );

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont.getAllProducts", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getChosenProduct = async (req, res) => {
  try {
    console.log("GET cont.getChosenProduct");
    const product = new Product();
    const id = req.params.id;
    const result = await product.getChosenProductData(req.member, id);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont.getChosenProduct", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

productController.searchProduct = async (req, res) => {
  try {
    console.log("GET cont.searchProduct");
    const product = new Product();
    const key = req.params.key;
    const result = await product.searchProductData(key);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont.searchProduct", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

/*********************************
 *      BSSR RELATED METHODS
 ********************************* */
productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");

    assert(req.files, Definer.general_err3);

    const product = new Product();
    let data = req.body;
    // console.log(req.body);

    data.product_images = req.files.map((ele) => {
      return ele.path;
    });

    const result = await product.addNewProductData(data, req.member);

    if (req.member.mb_type === "USER") {
      const html = `<script>
          alert('new dish added succesfully');
          window.location.replace("/resto/products/user");
          </script>`;
      res.end(html);
    } else {
      const html = `<script>
          alert('new dish added succesfully');
          window.location.replace("/resto/all-users");
          </script>`;
      res.end(html);
    }
  } catch (err) {
    console.log("ERROR, cont/addNewProduct", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

productController.editChosenProduct = async (req, res) => {
  try {
    console.log("POST cont.editChosenProduct");
    const product = new Product();
    const id = req.params.id;
    const result = await product.editChosenProductData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "succeed", data: result });
  } catch (err) {
    console.log("ERROR: cont.editChosenProduct", err.message);
    res.json({ state: "fail", message: err.message });
  }
};
