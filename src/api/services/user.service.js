'use strict'

const bcrypt = require('bcrypt');
const client = require('../../database/init.redis');
const OtpGenerator = require('otp-generator');
const {
    google
} = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();
// services
const {
    signAccessToken,
    signRefreshToken
} = require('./jwt.service');
const {
    insertOtp,
    validOtp
} = require('../services/otp.service');
// models
const _User = require('../models/user.model');
const _Cart = require('../models/cart.model');
const _Otp = require('../models/otp.model');
const _BlackList = require('../models/blackList.model');
// utils
const { getData } = require('../utils');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oAuth2CLient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2CLient.setCredentials({refresh_token: REFRESH_TOKEN});
// send email
const sendMail = async ({email, otp, subject}) => {
    const accessToken = await oAuth2CLient.getAccessToken();
    // create reusable transporter object using the default SMTP transport
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'np.appliancestore@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    });
    // send mail with defined transport object
    await transport.sendMail({
        from: '"Cửa hàng Nguyên Phát" <np.appliancestore@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: `Bạn nhận được email từ ${email}`, // plain text body
        html: `<b>Xin chào ,</b><br><p>Bạn vừa nhận được mã OTP xác nhận tại Cửa hàng Nguyên Phát</p><br><p>${otp}</p>` // html body
    });
};
// get all users
const get_all_users = async () => {
    const users = await _User.find({});
    if (users.length === 0) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    return {
        code: 200,
        metadata: {
            users: users.map(user => (
                getData({
                    fields: ['_id', 'name', 'email', 'role', 'username'],
                    object: user
                })
            ))
        }
    }
};
// get user by id
const get_user_by_id = async ({id}) => {
    const user = await _User.findOne({_id: id});
    if (!user) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    
    return {
        code: 200,
        metadata: {
            user: getData({
                    fields: ['_id', 'name', 'email', 'role'],
                    object: user
                })
        }
    }
};
// admin get user by id
const get_user_by_admin = async ({id}) => {
    const user = await _User.findOne({_id: id});
    if (!user) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    
    return {
        code: 200,
        metadata: {
            user: getData({
                    fields: ['_id', 'name', 'email', 'role'],
                    object: user
                })
        }
    }
};
// login
const login = async ({us, pwd}) => {
    // find user by username
    const user = await _User.findOne({username: us});
    if (!user) {
        return {
            code: 403,
            message: "Wrong username or password"
        }
    }
    // check password is valid
    const isValid = await bcrypt.compare(pwd, user.password);
    if (!isValid) {
        return {
            code: 403,
            message: "Wrong username or password"
        }
    }
    // get token
    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    return {
        code: 200,
        metadata: {
            user: getData({
                fields: ['_id', 'name', 'role'],
                object: user
            }),
            refreshToken,
            accessToken
        },
        message: `${user.name} Login Successfully`
    }

};
// create new password
const forgot_pasword = async ({ email }) => {
    // check email in blacklist
    const checkEmail = await _BlackList.findOne({email});
    if (checkEmail) {
        return {
            code: 400,
            message: "email in Blacklist"
        }
    }
    // check limit OTP generate
    const listOtp = await _Otp.find({email});
    if (listOtp.length > 2) {
        if (Date.now() - listOtp[listOtp.length - 3].createdAt < 5*60*1000 || listOtp.length > 4) {
  
            await _Otp.deleteMany({ email });
            await _BlackList.create({ email });

            return {
                code: 429,
                message: "over limit sending otp"
            }
        }
    }
    // generate otp
    const otp = OtpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    
    const subject = "Mã OTP xác nhận tạo mới mật khẩu";
    await sendMail({email, otp, subject});
    

    const insert_otp = await insertOtp({
        otp, email
    })

    return {
        code: 200,
        metadata: {
            otp: insert_otp
        }
    }
};
// password verify otp 
const password_verify_otp = async ({otp, password, email}) => {
    // check email in Otps
    const listOtp = await _Otp.find({email});
    if (!listOtp.length) {
        return {
            code: 404,
            message: 'Expired OTP!'
        }
    }
    // get last otp
    const lastOtp = listOtp[listOtp.length - 1];
    // check otp is valid
    const isValid = await validOtp({otp, hashOtp: lastOtp.otp});
    if (!isValid) {
        if (lastOtp.wrongs > 2) {
            await _BlackList.create({ email });

            await _Otp.deleteMany({ email });
            return {
                code: 429,
                message: "over limit entering otp"
            }
        }
        // count the number of wrong entering otp
        await _Otp.updateOne({otp: lastOtp.otp}, {$set:{wrongs: lastOtp.wrongs+1}});
        return {
            code: 401,
            message: 'Invalid Otp!'
        }
    } 
    if (isValid && email === lastOtp.email) {
        // hash password
        const hashPw = await bcrypt.hash(password, 10);

        await _User.updateOne({email}, {$set: {password: hashPw}});

        await _Otp.deleteMany({ email });

        return {
            code: 201,
            message: "New password successfully created"
        }
    }
}
// Log out
const logout = ({ id }) => {
    // delete in redis
    client.del(id.toString());
    
    return {
        code: 201,
        message: `Logout Successfully!`
    }
};
// register guest account
const sign_up_guest = async ({
    email
}) => {
    // check email in blacklist
    const checkEmail = await _BlackList.findOne({email});
    if (checkEmail) {
        return {
            code: 400,
            message: "email in Blacklist"
        }
    }
    // check limit OTP generate
    const listOtp = await _Otp.find({email});
    if (listOtp.length > 2) {
        if (Date.now() - listOtp[listOtp.length - 3].createdAt < 5*60*1000 || listOtp.length > 4) {
            // deleteMany Otp in Data
            await _Otp.deleteMany({ email });
            await _BlackList.create({ email });

            return {
                code: 429,
                message: "over limit sending otp"
            }
        }
    }
    // generate otp
    const otp = OtpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });

    const subject = "Mã OTP xác nhận đăng ký";
    await sendMail({email, otp, subject});
    

    const insert_otp = await insertOtp({
        otp, email
    })

    return {
        code: 200,
        metadata: {
            otp: insert_otp
        }
    }
};
// register verify otp 
const register_verify_otp = async ({otp, name, username, password, email}) => {
    // check email in Otps
    const listOtp = await _Otp.find({email});
    if (!listOtp.length) {
        return {
            code: 404,
            message: 'Expired OTP!'
        }
    }
    // get last otp
    const lastOtp = listOtp[listOtp.length - 1];
    // check otp is valid
    const isValid = await validOtp({otp, hashOtp: lastOtp.otp});
    if (!isValid) {
        if (lastOtp.wrongs > 2) {
            await _BlackList.create({ email });
            // deleteMany Otp in Data
            await _Otp.deleteMany({ email });
            return {
                code: 429,
                message: "over limit entering otp"
            }
        }
        // count the number of wrong entering otp
        await _Otp.updateOne({otp: lastOtp.otp}, {$set:{wrongs: lastOtp.wrongs+1}});
        return {
            code: 401,
            message: 'Invalid Otp!'
        }
    } 
    if (isValid && email === lastOtp.email) {
        // hash password
        const hashPw = await bcrypt.hash(password, 10);

        const newUser = {
            name: name,
            username: username,
            password: hashPw,
            email: email,
            role: "Guest"
        }

        const user = await _User.create(newUser);

        if (user) {
            await _Otp.deleteMany({ email });
        }

        const cart = {
            id: user._id,
            cart: []
        };

        await _Cart.create(cart);

        return {
            code: 201,
            message: "Your account has been successfully created",
            metadata: {
                user: getData({
                    fields: ['_id', 'name', 'email', 'role'],
                    object: user
                })
            }
        }
    }
}
// create user by admin rights
const create_user_by_admin = async ({
    name, username, password, email, role
}) => {
    // hash password
    const hashPw = await bcrypt.hash(password, 10);

    const newUser = {
        name: name,
        username: username,
        password: hashPw,
        email: email,
        role: role
    }

    const user = await _User.create(newUser);

    const cart = {
        id: user._id,
        cart: []
    };

    await _Cart.create(cart);

    return {
        code: 201,
        message: "Your account has been successfully created",
        metadata: user
    }
};
// delete user
const delete_user = async ({id}) => {
    const user = await _User.findOne({_id: id});
    if (!user) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }

    await _User.deleteOne({_id: id});
    await _Cart.deleteOne({id});
    client.del(id.toString());
    return {
        code: 201,
        message: "User delete Successfully!"
    }
};
// change password
const change_password = async ({id, password}) => {
    const user = await _User.findOne({_id: id});
    if (!user) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    // hash password
    const hashPw = await bcrypt.hash(password, 10);

    await _User.updateOne({_id: id}, {$set: {password: hashPw}});

    return {
        code: 201,
        message: "password has been changed"
    }
}

// export module
module.exports = {
    get_all_users,
    get_user_by_id,
    get_user_by_admin,
    login,
    forgot_pasword,
    password_verify_otp,
    logout,
    sign_up_guest,
    register_verify_otp,
    create_user_by_admin,
    delete_user,
    change_password
}