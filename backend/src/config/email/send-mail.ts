const nodemailer = require("nodemailer");
require("dotenv").config();


type emailType = {
    to:string;
    sub:string;
    token:string;
}

const transporter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user:process.env.NODEMAILER_EMAIL,
            pass:process.env.NODEMAILER_PASSWORD
        }
    }
);


const sendEmail = async({to, sub, token}:emailType)=>{
    await transporter.sendMail({
        to:to,
        subject:sub,
        html: `
            <h1>Your Verification Link</h1>
            <div>
                <button style="background: blue; border: none; padding: 10px; border-radius: 5px;">
                    <a href="http://localhost:5173/verify-token?token=${token}" style="text-decoration: none; color: white;">
                        Verify
                    </a>
                </button>
            </div>
        `
    });
    console.log("Email sent");
}

export default sendEmail;

