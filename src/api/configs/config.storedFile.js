'use strict'

const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const firebaseConfig = require('./config.firebase');
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

dotenv.config();

const config = (env) => {
    if (env === 'dev') {
        const multerStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, '../../../public/'));
            },
            filename: (req, file, cb) => {
                const dir = path.join(__dirname, `../../../public/uploads/products/${req.body.id}`);
                fs.mkdirSync(dir)
                cb(null, `uploads/products/${req.body.id}/${file.originalname}`);
            }
        });
        
        const multerFilter = (req, file, cb) => {
            if (file.mimetype.split('/')[1] === 'jpeg') {
                cb(null, true);
            } else {
                cb(new Error('Not a JPG File!!!'), false)
            }
        };

        const upload = multer({
            storage: multerStorage,
            fileFilter: multerFilter
        });

        return { 
            upload,
            storage: false
        };
    } else {  
        const multerFilter = (req, file, cb) => {
            if (file.mimetype.split('/')[1] === 'jpeg') {
                cb(null, true);
            } else {
                cb(new Error('Not a JPG File!!!'), false)
            }
        };

        const upload = multer({
            storage: multer.memoryStorage(),
            fileFilter: multerFilter
        });

        const app = initializeApp(firebaseConfig);    
        const storage = getStorage(app);

        return {
            upload,
            storage
        };
    }
}

const env = process.env.NODE_ENV || 'dev';

// export module
module.exports = config(env);