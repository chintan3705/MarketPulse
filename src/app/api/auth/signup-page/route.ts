
// This is a simple HTML page for admin signup, primarily for development/initial setup.
// In a production environment, admin creation should be handled more securely (e.g., CLI command, invitation system).
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Create Admin Account</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f3f4f6; padding: 1rem; }
        .container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); max-width: 400px; width: 100%; }
        h1 { font-size: 1.5rem; font-weight: bold; text-align: center; margin-bottom: 1.5rem; }
        label { display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem; }
        input[type="email"], input[type="password"] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #2563eb;
          color: white;
          font-weight: 500;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover { background-color: #1d4ed8; }
        .message { margin-top: 1rem; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; }
        .success { background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;}
        .error { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;}
        .note { font-size: 0.75rem; color: #6b7280; text-align: center; margin-top: 1.5rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Create Initial Admin Account</h1>
        <form id="signupForm">
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div>
            <label for="password">Password (min 6 characters):</label>
            <input type="password" id="password" name="password" required minlength="6">
          </div>
          <button type="submit">Create Admin</button>
        </form>
        <div id="responseMessage" class="message" style="display:none;"></div>
        <p class="note">This page is for initial admin setup. For security, it might be disabled or restricted in production.</p>
      </div>

      <script>
        document.getElementById('signupForm').addEventListener('submit', async function(event) {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const responseMessageDiv = document.getElementById('responseMessage');
          responseMessageDiv.style.display = 'none';
          responseMessageDiv.className = 'message';

          try {
            const response = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, role: 'admin' }) // Explicitly set role to admin
            });
            const result = await response.json();

            if (response.ok) {
              responseMessageDiv.textContent = result.message || 'Admin account created successfully!';
              responseMessageDiv.classList.add('success');
              document.getElementById('signupForm').reset();
               setTimeout(() => { window.location.href = '/login'; }, 2000);
            } else {
              responseMessageDiv.textContent = result.message || 'Error creating account.';
              if (result.errors) {
                let errorText = result.message;
                if (result.errors.email) errorText += " Email: " + result.errors.email._errors.join(', ');
                if (result.errors.password) errorText += " Password: " + result.errors.password._errors.join(', ');
                responseMessageDiv.textContent = errorText;
              }
              responseMessageDiv.classList.add('error');
            }
          } catch (error) {
            responseMessageDiv.textContent = 'An unexpected error occurred: ' + error.message;
            responseMessageDiv.classList.add('error');
          }
          responseMessageDiv.style.display = 'block';
        });
      </script>
    </body>
    </html>
  `;
  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
