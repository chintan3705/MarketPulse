
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
      <title>Create Initial Admin Account - MarketPulse</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: Inter, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f3f4f6; padding: 1rem; }
        .container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); max-width: 400px; width: 100%; }
        h1 { font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; color: #111827; }
        p.subtitle { text-align: center; color: #6b7280; font-size: 0.875rem; margin-bottom: 1.5rem; }
        label { display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem; color: #374151;}
        input[type="email"], input[type="password"] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        input:focus { border-color: #2563eb; outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 2px #2563eb; }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #1e40af; /* Darker blue */
          color: white;
          font-weight: 600;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        button:hover { background-color: #1c3a94; }
        button:disabled { background-color: #9ca3af; cursor: not-allowed; }
        .loader {
            width: 16px;
            height: 16px;
            border: 2px solid #FFF;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
            margin-right: 0.5rem;
        }
        @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .message { margin-top: 1rem; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; }
        .success { background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;}
        .error { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;}
        .note { font-size: 0.75rem; color: #6b7280; text-align: center; margin-top: 1.5rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Create Initial Admin</h1>
        <p class="subtitle">This page is for initial MarketPulse admin setup.</p>
        <form id="signupForm">
          <div>
            <label for="email">Admin Email:</label>
            <input type="email" id="email" name="email" required autocomplete="email">
          </div>
          <div>
            <label for="password">Password (min 6 characters):</label>
            <input type="password" id="password" name="password" required minlength="6" autocomplete="new-password">
          </div>
          <button type="submit" id="submitButton">
            <span id="buttonText">Create Admin Account</span>
            <span id="buttonLoader" class="loader" style="display:none;"></span>
          </button>
        </form>
        <div id="responseMessage" class="message" style="display:none;"></div>
        <p class="note">For security, this page might be disabled or restricted in production environments.</p>
      </div>

      <script>
        document.getElementById('signupForm').addEventListener('submit', async function(event) {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const responseMessageDiv = document.getElementById('responseMessage');
          const submitButton = document.getElementById('submitButton');
          const buttonText = document.getElementById('buttonText');
          const buttonLoader = document.getElementById('buttonLoader');

          responseMessageDiv.style.display = 'none';
          responseMessageDiv.className = 'message'; // Reset classes
          submitButton.disabled = true;
          buttonText.style.display = 'none';
          buttonLoader.style.display = 'inline-block';


          try {
            const response = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, role: 'admin' }) // Explicitly set role to admin
            });
            const result = await response.json();

            if (response.ok) {
              responseMessageDiv.textContent = result.message || 'Admin account created successfully! Redirecting to login...';
              responseMessageDiv.classList.add('success');
              document.getElementById('signupForm').reset();
              setTimeout(() => { window.location.href = '/login'; }, 2500);
            } else {
              let errorMsg = result.message || 'Error creating account.';
              if (result.errors) {
                if (result.errors.email) errorMsg += " Email: " + result.errors.email._errors.join(', ');
                if (result.errors.password) errorMsg += " Password: " + result.errors.password._errors.join(', ');
              }
              responseMessageDiv.textContent = errorMsg;
              responseMessageDiv.classList.add('error');
            }
          } catch (error) {
            responseMessageDiv.textContent = 'An unexpected error occurred: ' + error.message;
            responseMessageDiv.classList.add('error');
          } finally {
            responseMessageDiv.style.display = 'block';
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
          }
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
