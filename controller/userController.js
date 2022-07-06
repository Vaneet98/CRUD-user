const Service = require("../service");
const Model = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')
module.exports = {
  Registration: async (data) => {
    let userData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    const user = await Service.userService.getUser(userData);
    if (user) {
      return { status: "failed", message: "Email already exists " };
    } else {
      if (data.email && data.password) {
        try {
          var value = data.password;
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(value, salt);
          let userData = {
            name: data.name,
            email: data.email,
            password: hashPassword,
          };
          //Dynamic message send on mail
          let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Registration Succesful",
            html: `<p>Hi <b>${data.name}</b>, Thank you for registering with <b>Applify</b></p>`,
          });
          let users = await Service.userService.addUser(userData);
          let emails = await Service.userService.getUser(userData);
          //Gernate token
          const token = jwt.sign(
            { userId: emails.userId },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "5d",
            }
          );
          return {
            status: "Success",
            message: "Registeration successfull",
            token: token,
          };
        } catch (error) {
          return { status: "failed", message: "Unable to register" };
        }
      } else {
        return { status: "failed", message: "All fields are required" };
      }
    }
  },
  loginUsers: async (req, res, data) => {
    try {
      const userdata = {
        email: data.email,
        password: data.password,
      };
      if (data.email && data.password) {
        const useremail = await Service.userService.logUseremail(userdata);
        if (useremail != null) {
          const isMatch = await bcrypt.compare(
            data.password,
            useremail.password
          );

          if (useremail.email && isMatch) {
            //Genterate token
            const token = jwt.sign(
              { userId: useremail.userId },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "5d",
              }
            );
            // Put token into cookie
            res.cookie("token", token, { expire: new Date() + 9999 });
            return {
              status: "Success",
              message: "Login success",
              token: token,
            };
          } else {
            return {
              status: "failed",
              message: "Email or Password is not Valid",
            };
          }
        } else {
          return { status: "failed", message: "You are not Registered User" };
        }
      } else {
        return { status: "failed", message: "All fields are required" };
      }
    } catch (error) {
      return { status: "failed", message: "Unabale to login" };
    }
  },
  changeUserPassword: async (req, res, data) => {
    const { password } = data;
    if (password) {
      var value = data.password;
      const salt = await bcrypt.genSalt(10);
      const newhashPassword = await bcrypt.hash(value, salt);

      await Service.userService.updatepassword(
        req.datas.userId,
        newhashPassword
      );

      return { status: "Success", message: "Password change successfull" };
    }
  },
  loggedOut: async (req, res) => {
    res.clearCookie("token");
    return { status: "Success", message: "Logged Out successfull" };
  },
  loggedUserDetail: async (req, res) => {
    res.send({ User: req.datas });
  },
  sendUserPasswordResetEmail: async (req, res, data) => {
    const { email } = data;

    if (email) {
      const user = await Service.userService.getUsers(email);

      if (user) {
        const secret = user.userId + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: user.userId }, secret, {
          expiresIn: "15m",
        });
        // --- create frontend link ----
        const link = `http://127.0.0.1:3000/api/user/reset/${user.userId}/${token}`;
        //-- But in ReactJS link link it /api/user/reset/:id/:token---

       otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

        //Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          OTP: otp,
          subject: "Password Reset link",
          html: `<b><p>OTP for rest the password <br/>${otp}</p></b><a href=${link}>Click here</a> to Reset your password`,
        });
        return {
          status: "Success",
          message: "Password Reset Email send....Please check the email",
          info: "info",
        };
      } else {
        return { status: "failed", message: "Email doesn't exists" };
      }
    } else {
      return { status: "failed", message: "Email field is Required" };
    }
  },
  userPasswordReset: async (req, res, data) => {
    const { password } = req.body;
    const { id, token } = req.params;
    const user = await Service.userService.getdatas(id);
    console.log(user);
    const new_secret = user.userId + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      if (password) {
        /* if (password !== conf_password) {
          return {
            status: "failed",
            message: "Password and conferm password not same",
          };
        } */ // else {
        var value = data.password;
        const salt = await bcrypt.genSalt(10);
        const newhashPassword = await bcrypt.hash(value, salt);

        await Service.userService.updatepassword(user.userId, newhashPassword);
        return {
          status: "Success",
          message: "Password Reset successfully",
        };
        //}
      } else {
        return { status: "failed", message: "All field is Required" };
      }
    } catch (error) {
      return { status: "failed", message: "Invalid token" };
    }
  },
};
