const express = require("express");
const router = express.Router();
const loginController=require("../../controllers/loginController");
const indexController=  require("../../controllers/indexController");
const ManagerController = require("../../controllers/ManagerController");
const CateController = require("../../controllers/CateController");
const TagController = require("../../controllers/TagController");
const BlogController = require("../../controllers/BlogController");

router.post("/login",loginController.login);
router.post("/loginByCookie",loginController.loginByCookie);

router.post("/",indexController.index);

router.post("/manager/add",ManagerController.add);
router.post("/manager/list",ManagerController.list);
router.post("/manager/upload/avatar",ManagerController.upload.avatar);
router.post('/manager/findById',ManagerController.findById)
router.post('/manager/delById',ManagerController.delById);
router.post('/manager/saveById',ManagerController.saveById);


router.post("/cate/add",CateController.add);
router.post("/cate/list",CateController.list);

router.post('/cate/findById',CateController.findById)
router.post('/cate/delById',CateController.delById);
router.post('/cate/save',CateController.save);


router.post("/tag/add",TagController.add);
router.post("/tag/list",TagController.list);

router.post('/tag/findById',TagController.findById)
router.post('/tag/delById',TagController.delById);
router.post('/tag/save',TagController.save);


router.post("/blog/add",BlogController.add);
router.post("/blog/list",BlogController.list);

router.post('/blog/findById',BlogController.findById)
router.post('/blog/delById',BlogController.delById);
router.post('/blog/save',BlogController.save);

router.post('/blog/upload/img',BlogController.upload.contentImg); //内容上面上传的图片





module.exports=router;