let productController = module.exports;

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
    console.log("POST cont.addNewProduct");
    res.send("ok");
  } catch (err) {
    console.log("ERROR: cont.addNewProduct", err.message);
  }
};

productController.editChosenProduct = async (req, res) => {
  try {
    console.log("POST cont.editChosenProduct");
  } catch (err) {
    console.log("ERROR: cont.editChosenProduct", err.message);
  }
};
