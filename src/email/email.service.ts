import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Servidor SMTP
      port: parseInt(process.env.EMAIL_PORT, 587),
      secure: false, // Use SSL ou TLS (para ambientes de produção, certifique-se de usar "true" se o SMTP suportar SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, content: string) {
    const mailOptions = {
      from: `"No Reply" <${process.env.EMAIL_FROM}>`, // De quem está enviando
      to, // Destinatário
      subject, // Assunto
      text: content, // Conteúdo do e-mail em texto simples
      // Se precisar enviar HTML, pode adicionar a propriedade "html"
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body p {
            margin: 0 0 10px;
        }
        .email-footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 10px;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${subject}</h1>
        </div>
        <div class="email-body">
            <p>${content}</p>
            <a href="#" class="button">Entre para le-lo</a>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 Nestjs curse. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
