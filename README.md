# StressAPI Dashboard

A modern, responsive dashboard for visualizing performance metrics from StressAPI load tests. Built with React, TypeScript, and Tailwind CSS, this dashboard provides real-time insights into API performance through interactive charts and detailed metrics.

![Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000)

## Features

- 📊 Real-time performance metrics visualization
- 📈 Interactive charts for response times, throughput, and system resources
- 🎯 Key performance indicators (KPIs) at a glance
- 📱 Fully responsive design
- 🎨 Clean, modern UI with Tailwind CSS
- 📊 Powered by Recharts for smooth, interactive data visualization

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Recharts
- Lucide React (for icons)
- date-fns (for date formatting)

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stress-api-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server URL provided by Vite.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint to check code quality

## Project Structure

```
stress-api-dashboard/
├── src/
│   ├── components/     # React components
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── package.json       # Project dependencies and scripts
```

## Dashboard Components

### Performance Metrics
- Response Time Trends
- System Resource Usage
- Throughput Analysis
- Response Time Distribution

### Key Statistics
- Average Response Time
- Peak Throughput
- Error Rate
- Concurrent Users

## Deployment

The dashboard can be deployed to any static hosting service. For Netlify deployment:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service of choice.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this code for your own projects.

## Support

For issues and feature requests, please open an issue in the repository.