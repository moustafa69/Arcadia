export function resetPasswordTemplate(code: number) {
  return `<!DOCTYPE html>
<html>
<head>
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
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .email-header {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .email-body {
      font-size: 16px;
      color: #333333;
      line-height: 1.5;
    }
    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">Reset Your Password</div>
    <div class="email-body">
      <p>Use this code <strong>${code}</strong> to reset your password.</p>
      <p>This code will expire in <strong>5 minutes</strong>.</p>
    </div>
    <div class="email-footer">
      If you didn’t request this, please ignore this email.
    </div>
  </div>
</body>
</html>
`;
}

export function verifyEmailTemplate(code: number) {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #333333;
        }
        .content {
            text-align: center;
            color: #555555;
            line-height: 1.6;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            color: #2d89ef;
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777777;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p>Hi</p>
            <p>Thank you for signing up with <strong>Arcadia</strong>!</p>
            <p>To complete your registration, please verify your email address using the code below:</p>
            <div class="code">${code}</div>
            <p>This code will expire in <strong>5 minutes</strong>.</p>
            <p>If you did not request this email, please ignore it.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Arcadia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
}
