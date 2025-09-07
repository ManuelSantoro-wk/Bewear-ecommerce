import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter
  .sendMail({
    from: `"Minha Loja" <${process.env.EMAIL_USER}>`,
    to: "manuelsantoro@hotmail.com",
    subject: "Teste Email Next.js",
    text: "Funcionou via Next.js?",
  })
  .then((info) => console.log("Email enviado:", info.response))
  .catch((err) => {
    console.error("Erro:", err);
    if (err instanceof Error) console.error(err.stack);
  });
