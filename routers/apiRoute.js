const { Router } = require("express");
const router = Router();
const ApiController = require("../controllers/ApiController");

router.get("/", ApiController.root);
router.post("/ask", ApiController.ask);
router.post("/add/urls", ApiController.addUrls);
router.post("/add/pdfs", ApiController.addPdfs);
router.delete("/delete/by-source", ApiController.deleteBySource);
router.get("/list-sources", ApiController.listSources);
router.get("/count-documents", ApiController.countDocuments);
router.post("/reset", ApiController.reset);

module.exports = router;
