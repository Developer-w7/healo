
const UserOtp = require("../models/Auth/userOtp");
const UserModel = require("../models/user");

// Auth
var jwt = require('jsonwebtoken');

// user send otp
exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }


    try {
        const presuer = await UserModel.findOne({ email: email });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await UserOtp.findOne({ email: email });


            if (existEmail) {
                const updateData = await UserOtp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For Otp Validation",
                    text: `OTP:- ${OTP}`
                }


                // tarnsporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         console.log("error", error);
                //         res.status(400).json({ error: "email not send" })
                //     } else {
                //         console.log("Email sent", info.response);
                //         res.status(200).json({ message: "Email sent Successfully" })
                //     }
                // })
   
                return res.status(200).json({ status: "Email Sent", otp:OTP });

            } else {

                const saveOtpData = new UserOtp({
                    email, otp: OTP
                });

                await saveOtpData.save();
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Eamil For Otp Validation",
                    text: `OTP:- ${OTP}`
                }
                return res.status(200).json({ status: "Email Sent", otp:OTP });
                // tarnsporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         console.log("error", error);
                //         res.status(400).json({ error: "email not send" })
                //     } else {
                //         console.log("Email sent", info.response);
                //         res.status(200).json({ message: "Email sent Successfully" })
                //     }
                // })
            }

        } else {
            res.status(400).json({ status: "This User Not Exist In our Db" })
        }
    } catch (error) {
        res.status(400).json({ status: "Invalid Details", error })
    }
};


exports.userLoginWithOtp = async(req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await UserOtp.findOne({email:email});

        if(otpverification.otp === otp){
            const user = await UserModel.findOne({email:email});

            const token = jwt.sign(
                { userId: user._id, email },
                process.env.JWT_SECRET_KEY,
                {
                  expiresIn: "5h",
                }
              );
              user.token = token;
              res.set({'X-AuthToken':token})
          

            // token generate
            
            return res.status(200).json(user);
      

        }else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        return res.status(400).send("Login Failed");
    }
}
