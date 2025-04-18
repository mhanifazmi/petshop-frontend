# Vue Project Setup

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mhanifazmi/petshop-frontend.git
   cd petshop-frontend
2. **Install dependencies**
    
    ```bash
    npm install
3. **Development**

    ```bash
    npm run dev
4. **Build for Production**

    ```bash
    npm run build
## Environment Variables

1. Set up the environment file. Copy the .env.example file to .env. Do the same for .env.production if needed.

    ```bash
    cp .env.example .env
2. Make sure to set the following variables in your .env file:

    ```bash
    VITE_API_URL=https://your-api-url.com
    VUE_APP_API_URL=https://your-api-url.com
    VUE_APP_ENV=development

## Admin Credential

1. Access the admin panel using the following credentials:

    ```bash
    Route: {{ your-url.test }}/admin
    Username: superadmin@example.com
    Password: 12341234