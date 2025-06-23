# MarketPulse - Financial News Blog Platform

MarketPulse is a modern financial news blog platform built with Next.js, React, Tailwind CSS, and ShadCN UI components. It leverages Genkit for AI-powered content generation and MongoDB for data persistence. The platform includes features for browsing articles, an admin panel for managing blog posts (including manual creation and AI generation), user authentication for the admin area, and MarketAux API integration for news suggestions.

## Features

- **Next.js App Router:** Utilizes the latest Next.js features for optimal performance and developer experience.
- **React & TypeScript:** Modern frontend development with strong typing.
- **Tailwind CSS & ShadCN UI:** A utility-first CSS framework and a collection of beautifully designed, accessible UI components.
- **Genkit Integration:** AI-powered blog post generation (text and images) and article summarization.
- **MongoDB Database:** Stores blog posts, categories, and user data.
- **MarketAux API Integration:** Fetches real-time financial news headlines to inspire blog content (Admin Dashboard).
- **Admin Panel:**
  - Dashboard overview with dynamic stats and news suggestions.
  - Manage blog posts:
    - List all blog posts.
    - AI-generate single or multiple blog posts.
    - Manually create blog posts.
    - Edit existing blog posts.
    - Delete blog posts with confirmation.
  - Secure login for administrators.
- **SEO Optimized:**
  - Dynamic sitemap generation (`/sitemap.xml`).
  - JSON-LD schema markup for blog posts.
  - Dynamic meta tags (title, description, canonical URLs).
- **Responsive Design:** Adapts to various screen sizes.
- **Theme Toggle:** Light and dark mode support.

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **UI:** React, ShadCN UI
- **Styling:** Tailwind CSS
- **AI Integration:** Genkit (with Google AI/Gemini models)
- **News API:** MarketAux
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies
- **Image Hosting (for AI-generated images):** Cloudinary

## Getting Started

To get the project up and running locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd marketpulse-financial-blog
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add the following variables. Replace placeholder values with your actual credentials and settings.

    ```env
    # MongoDB Connection String
    MONGODB_URI=your_mongodb_connection_string_here

    # JWT Authentication
    JWT_SECRET=your_very_long_random_secure_jwt_secret_string_here
    JWT_EXPIRES_IN=7d # Example: 7 days

    # Google AI API Key (for Genkit)
    # Ensure the Gemini API is enabled in your Google Cloud Project.
    GOOGLE_API_KEY=your_google_ai_api_key_here

    # Cloudinary Credentials (for AI-generated image uploads)
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # MarketAux API Token (for news suggestions in Admin Dashboard)
    MARKETAUX_API_TOKEN=your_marketaux_api_token_here

    # Next.js Public Site URL (used for absolute URLs in metadata, sitemap, etc.)
    # For local development:
    NEXT_PUBLIC_SITE_URL=http://localhost:9002
    # For production, set this to your actual deployed site URL.
    ```

    - **`JWT_SECRET`**: Generate a long, random, and secure string.
    - **`GOOGLE_API_KEY`**: Obtain this from your Google AI Studio or Google Cloud Console. Make sure the Gemini API is enabled for your project.
    - **`CLOUDINARY_...`**: Sign up for a Cloudinary account to get these credentials if you want to use AI-generated images.
    - **`MARKETAUX_API_TOKEN`**: Get this from [MarketAux](https://marketaux.com/). The free tier has limitations.

4.  **Run the development server:**
    The application runs on port `9002` by default (as specified in `package.json`).

    ```bash
    npm run dev
    ```

    This will start the Next.js application.

5.  **Run the Genkit development server (optional, for AI features):**
    If you plan to use or develop AI features, run the Genkit development server in a separate terminal:

    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes
    npm run genkit:watch
    ```

6.  **Initial Admin User Setup:**

    - Once the main application is running, navigate to `/signup-admin` in your browser.
    - Use the form on this page to create your first admin user.
    - **Important:** In a production environment, you should disable or secure this signup route after creating the necessary admin accounts.

7.  **Access the Application:**
    - **Main Site:** Open [http://localhost:9002](http://localhost:9002)
    - **Admin Panel:** Open [http://localhost:9002/admin](http://localhost:9002/admin) (you will be redirected to `/login` if not authenticated).

## Available Scripts

- `npm run dev`: Starts the Next.js development server (on port 9002).
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run genkit:watch`: Starts the Genkit development server with auto-reloading.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server (after running `build`).
- `npm run lint`: Lints the codebase using ESLint.
- `npm run lint:fix`: Lints and automatically fixes ESLint issues.
- `npm run typecheck`: Checks for TypeScript errors.
- `npm run format:check`: Checks for Prettier formatting issues.
- `npm run format:fix`: Formats the code using Prettier.

## Project Structure Highlights

- `src/app/`: Main application routes using Next.js App Router.
  - `src/app/(main)/`: Routes for the public-facing website.
  - `src/app/admin/`: Routes for the admin panel.
  - `src/app/api/`: API routes.
- `src/components/`: Shared UI components.
  - `src/components/ui/`: ShadCN UI components.
- `src/ai/`: Genkit AI flows and schemas.
  - `src/ai/flows/`: Genkit flow definitions.
  - `src/ai/schemas/`: Zod schemas for AI inputs/outputs.
- `src/lib/`: Utility functions, data definitions, MongoDB connection.
- `src/models/`: Mongoose models for database schemas.
- `src/hooks/`: Custom React hooks.
- `src/types/`: TypeScript type definitions.
- `public/`: Static assets.

## Contributing

Contributions are welcome! Please follow standard coding practices and ensure your code passes linting and type checks.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details (if one exists, otherwise assume private).
