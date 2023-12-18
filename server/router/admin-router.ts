import notFound from '../middlewares/not-found';
import erroHandler from '../middlewares/errors';
import multer from 'multer';
import admin from '../middlewares/admin';
import { changeAvailability, home, index } from '../controller/admin-controller';
const express = require('express')

const adminRouter = express.Router();
adminRouter.use(express.json())
adminRouter.use(admin)

adminRouter.get('/', home)
adminRouter.get('/photos', index)
adminRouter.post('/photos/:id', changeAvailability)

adminRouter.use(notFound)
adminRouter.use(erroHandler)



export { adminRouter };