var express = require('express');
var router = express.Router();
var indexController = require("../controllers/indexController");
/* GET home page. */
router.use(indexController.common);
router.get('/', indexController.index);
router.get("/blog/:id",indexController.detail_blog);
router.get("/cate/:id",indexController.show_cate);
module.exports = router;
