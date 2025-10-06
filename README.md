# Nexus Commerce

An all-in-one, serverless ERP for managing products, sales, customers, and finances for modern e-commerce businesses.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/audesteurin/generated-app-20251006-204129)

Nexus Commerce is a comprehensive, all-in-one web application designed for the complete management of an online store. It serves as a central hub (ERP/CRM) for e-commerce operations, providing a suite of powerful tools within a single, intuitive interface. The application is built on a modern, serverless architecture using Cloudflare Workers, ensuring high performance and scalability.

## Key Features

-   **Dashboard**: A central hub with KPIs, financial summaries, top products, and recent activities.
-   **Product Management**: Full CRUD for products, including stock tracking, variants, categories, and images.
-   **Sales & Order Processing**: Manage sales orders, track payments, generate invoices, and monitor statuses.
-   **Customer Management (CRM)**: Manage customer information, view purchase history, and track interactions.
-   **Supplier & Procurement**: Manage supplier information, purchase orders, and delivery tracking.
-   **Financial Tracking**: Record all revenues and expenses for a clear view of cash flow.
-   **Reporting & Analytics**: Generate detailed reports, statistics, and data exports (PDF/Excel).
-   **Settings & Users**: Configure the application, manage user accounts, and define granular roles and permissions.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, React Router
-   **Backend**: Hono on Cloudflare Workers
-   **Storage**: Cloudflare Durable Objects
-   **UI**: Tailwind CSS, shadcn/ui, Radix UI
-   **State Management**: Zustand
-   **Forms**: React Hook Form with Zod for validation
-   **Data Fetching**: Tanstack Query (React Query)
-   **Charting**: Recharts
-   **Animations**: Framer Motion
-   **Icons**: Lucide React

## Project Structure

The project is a monorepo with a clear separation of concerns:

-   `src/`: Contains the entire React frontend application.
    -   `pages/`: Top-level page components for each route.
    -   `components/`: Reusable React components, including shadcn/ui components.
    -   `store/`: Zustand stores for global state management.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the Hono backend application running on Cloudflare Workers.
    -   `index.ts`: The main worker entry point (do not modify).
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Data entity definitions for Durable Object storage.
-   `shared/`: TypeScript types and mock data shared between the frontend and backend.

## Getting Started

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nexus_commerce
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running Locally

To start the development server, which includes the Vite frontend and a local Wrangler instance for the backend, run:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Development

### Adding a New API Endpoint

1.  **Define the Entity (if needed)**: In `worker/entities.ts`, create or modify an `IndexedEntity` class to manage your data model.
2.  **Define Shared Types**: In `shared/types.ts`, add or update the TypeScript interfaces for your data.
3.  **Add the Route**: In `worker/user-routes.ts`, add your new Hono route, using the entity helpers to interact with the Durable Object.

### Creating a New Frontend Page

1.  Create a new component in `src/pages/`.
2.  Add the route to the `createBrowserRouter` configuration in `src/main.tsx`.
3.  Use the `api` client from `src/lib/api-client.ts` to fetch data from your backend endpoints.

## Available Scripts

-   `bun run dev`: Starts the local development server.
-   `bun run build`: Builds the frontend application for production.
-   `bun run deploy`: Deploys the application to Cloudflare Workers.
-   `bun run lint`: Lints the codebase.

## Deployment

This project is designed for seamless deployment to the Cloudflare ecosystem.

1.  **Build the application:**
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    ```bash
    bun run deploy
    ```

This command will deploy your Hono backend to Cloudflare Workers and your static React frontend to Cloudflare Pages.

Alternatively, you can deploy directly from your GitHub repository with a single click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/audesteurin/generated-app-20251006-204129)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.