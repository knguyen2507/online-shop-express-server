'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../api/configs/config.mongodb');
// models
const _User = require('../api/models/user.model');
const _Role = require('../api/models/role.model');
const _Brand = require('../api/models/brand.model');
const _Category = require('../api/models/category.model');
const _Product = require('../api/models/product.model');
// json data
const dbUser = require('./db/user.db.json');
const dbRole = require('./db/role.db.json');
const dbBrand = require('./db/brand.db.json');
const dbCategory = require('./db/category.db.json');
const dbProduct = require('./db/product.db.json');

const MONGO_URI = `${config.db}`;
// connect mongodb
mongoose
    .connect(MONGO_URI)
    .then(_ => console.log(`Connected mongoose success!...`))
    .catch(err => console.error(`Error: connect:::`, err))
// all executed methods log output to console
mongoose.set('debug', true)
// disable colors in debug mode
mongoose.set('debug', { color: false })
// get mongodb-shell friendly output (ISODate)
mongoose.set('debug', { shell: true })
const db = mongoose.connection;
// insert database Roles
_Role.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
        await db.collection('Roles').insertMany(dbRole, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("add Roles database to collection");
            }
        });
    }
});
// insert database Users
_User.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
        for (let i of dbUser) {
            const hashPw = await bcrypt.hash(i.password, 10);
            i.password = hashPw;
        }
        await db.collection('Users').insertMany(dbUser, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("add Users database to collection");
            }
        });
    }
});
// insert database Brands
_Brand.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
        await db.collection('Brands').insertMany(dbBrand, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("add Brands database to collection");
            }
        });
    }
});
// insert database Categories
_Category.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
        await db.collection('Categories').insertMany(dbCategory, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("add Categories database to collection");
            }
        });
    }
});
// insert databse products
_Product.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
        await db.collection('Products').insertMany(dbProduct, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("add Products database to collection");
            }
        });
    }
});
// export module
module.exports = db;
