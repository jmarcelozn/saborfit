import { env } from '../../config/env.js';

export class EmailService {
  constructor() {
    this.service = env.email.service;
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      switch (this.service) {
        case 'ses':
          return this.sendViaSES({ to, subject, html, text });
        case 'sendgrid':
          return this.sendViaSendGrid({ to, subject, html, text });
        case 'smtp':
          return this.sendViaSMTP({ to, subject, html, text });
        case 'console':
        default:
          return this.sendToConsole({ to, subject, html, text });
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha ao enviar e-mail');
    }
  }

  async sendViaSES({ to, subject, html, text }) {
    console.log('📧 Enviando e-mail via AWS SES...');
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);

    if (!env.email.awsAccessKeyId || !env.email.awsSecretAccessKey) {
      throw new Error('Credenciais AWS SES não configuradas');
    }

    try {
      const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
      const sesClient = new SESClient({
        region: env.email.awsSesRegion,
        credentials: {
          accessKeyId: env.email.awsAccessKeyId,
          secretAccessKey: env.email.awsSecretAccessKey,
        },
      });

      const command = new SendEmailCommand({
        Source: env.email.from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: html, Charset: 'UTF-8' },
            Text: { Data: text, Charset: 'UTF-8' },
          },
        },
      });

      await sesClient.send(command);
      console.log('✅ E-mail enviado via AWS SES');
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.error('❌ @aws-sdk/client-ses não instalado. Execute: npm install @aws-sdk/client-ses');
      }
      throw error;
    }
  }

  async sendViaSendGrid({ to, subject, html, text }) {
    console.log('📧 Enviando e-mail via SendGrid...');
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);

    if (!env.email.sendgridApiKey) {
      throw new Error('API Key do SendGrid não configurada');
    }

    try {
      const sgMail = await import('@sendgrid/mail');
      sgMail.setApiKey(env.email.sendgridApiKey);

      await sgMail.send({
        to,
        from: env.email.from,
        subject,
        html,
        text,
      });

      console.log('✅ E-mail enviado via SendGrid');
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.error('❌ @sendgrid/mail não instalado. Execute: npm install @sendgrid/mail');
      }
      throw error;
    }
  }

  async sendViaSMTP({ to, subject, html, text }) {
    console.log('📧 Enviando e-mail via SMTP...');
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);

    if (!env.email.smtpHost || !env.email.smtpUser || !env.email.smtpPass) {
      throw new Error('Credenciais SMTP não configuradas');
    }

    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: env.email.smtpHost,
        port: env.email.smtpPort,
        secure: env.email.smtpPort === 465,
        auth: {
          user: env.email.smtpUser,
          pass: env.email.smtpPass,
        },
      });

      await transporter.sendMail({
        from: env.email.from,
        to,
        subject,
        html,
        text,
      });

      console.log('✅ E-mail enviado via SMTP');
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.error('❌ nodemailer não instalado. Execute: npm install nodemailer');
      }
      throw error;
    }
  }

  async sendToConsole({ to, subject, html, text }) {
    console.log('📧 [MODO CONSOLE] E-mail não enviado (apenas log)');
    console.log(`Para: ${to}`);
    console.log(`De: ${env.email.from}`);
    console.log(`Assunto: ${subject}`);
    console.log('--- HTML ---');
    console.log(html);
    console.log('--- Texto ---');
    console.log(text);
    console.log('--- FIM ---');
  }

  async sendVerificationEmail({ to, token, userName }) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SaborFit</h1>
          </div>
          <div class="content">
            <h2>Verifique seu e-mail</h2>
            <p>Olá, ${userName}!</p>
            <p>Obrigado por se cadastrar no SaborFit. Para completar seu cadastro, por favor clique no botão abaixo para verificar seu e-mail:</p>
            <a href="${verificationUrl}" class="button">Verificar E-mail</a>
            <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
            <p>${verificationUrl}</p>
            <p>Este link expirará em 1 hora.</p>
          </div>
          <div class="footer">
            <p>Se você não se cadastrou no SaborFit, ignore este e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      SaborFit - Verifique seu e-mail
      
      Olá, ${userName}!
      
      Obrigado por se cadastrar no SaborFit. Para completar seu cadastro, acesse o link abaixo:
      
      ${verificationUrl}
      
      Este link expirará em 1 hora.
      
      Se você não se cadastrou no SaborFit, ignore este e-mail.
    `;

    return this.sendEmail({
      to,
      subject: 'SaborFit - Verifique seu e-mail',
      html,
      text,
    });
  }

  async sendPasswordResetEmail({ to, token, userName }) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SaborFit</h1>
          </div>
          <div class="content">
            <h2>Redefinição de Senha</h2>
            <p>Olá, ${userName}!</p>
            <p>Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, ignore este e-mail.</p>
            <p>Para redefinir sua senha, clique no botão abaixo:</p>
            <a href="${resetUrl}" class="button">Redefinir Senha</a>
            <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
            <p>${resetUrl}</p>
            <p>Este link expirará em 1 hora.</p>
          </div>
          <div class="footer">
            <p>Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      SaborFit - Redefinição de Senha
      
      Olá, ${userName}!
      
      Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, ignore este e-mail.
      
      Para redefinir sua senha, acesse o link abaixo:
      
      ${resetUrl}
      
      Este link expirará em 1 hora.
      
      Se você não solicitou a redefinição de senha, ignore este e-mail.
    `;

    return this.sendEmail({
      to,
      subject: 'SaborFit - Redefinição de Senha',
      html,
      text,
    });
  }
}

export default new EmailService();
