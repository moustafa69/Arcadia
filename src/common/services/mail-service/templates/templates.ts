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
