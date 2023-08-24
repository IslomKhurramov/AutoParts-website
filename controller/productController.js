let productController = module.exports;
const Definer = require("../lib/mistake");
const Product = require("../models/Product");
const assert = require("assert");

productController.getAllProducts = async (req, res) => {
  try {
    console.log("GET cont.getAllProducts");
  } catch (err) {
    console.log("ERROR: cont.getAllProducts", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

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
    const html = `<script>
        alert('new dish added succesfully');
        window.location.replace("/resto/products/user");
        </script>`;

    res.end(html);
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
