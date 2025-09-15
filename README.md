# Dynamic Next.js App for Azure App Services

A highly interactive and dynamic Next.js application optimized for deployment on Azure App Services with Node.js 22 LTS.

## 🚀 Features

### Interactive Components

- **Real-time Counter** - Interactive counter with auto-increment functionality
- **Dynamic Form** - Advanced form with real-time validation and animations
- **Data Visualization** - Live charts with Chart.js integration (Line, Bar, Doughnut)
- **Drag & Drop** - Task management with beautiful drag-and-drop interface
- **Search & Filter** - Advanced filtering and search functionality
- **Real-time Chat** - Interactive chat interface with bot responses
- **Animated Cards** - Responsive metric cards with hover effects
- **Modal System** - Feature showcase modal with interactive demos

### Technical Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Chart.js** for data visualization
- **React Beautiful DnD** for drag-and-drop
- **Health Check APIs** for monitoring

## 🏥 Health Check Endpoints

The application includes comprehensive health check endpoints for Azure monitoring:

### Available Endpoints

1. **`/api/health`** - Basic health check

   - Returns application status, memory usage, uptime
   - Includes Azure environment information when deployed

2. **`/api/healthz`** - Comprehensive health check

   - Detailed system checks (memory, uptime, response time)
   - Returns HTTP 200 for healthy, 503 for unhealthy
   - Includes Azure-specific metadata

3. **`/api/ready`** - Readiness probe

   - Checks if application is ready to serve traffic
   - Memory usage validation
   - Basic functionality tests

4. **`/api/live`** - Liveness probe
   - Simple check to verify application is alive
   - Minimal overhead for frequent checks

### Health Check Response Example

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "memory": {
    "used": 45,
    "total": 128,
    "external": 2,
    "rss": 67
  },
  "azure": {
    "siteName": "my-nextjs-app",
    "hostname": "my-nextjs-app.azurewebsites.net",
    "instanceId": "abc123"
  }
}
```

## 🔧 Prerequisites

- Node.js 22.x LTS
- npm or yarn
- Azure CLI (for deployment)
- Azure subscription

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dynamic-nextjs-azure
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Azure App Services Deployment

### Method 1: Azure CLI Deployment

1. **Login to Azure**

   ```bash
   az login
   ```

2. **Create Resource Group**

   ```bash
   az group create --name myResourceGroup --location "East US"
   ```

3. **Create App Service Plan**

   ```bash
   az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux
   ```

4. **Create Web App**

   ```bash
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myNextjsApp --runtime "NODE:22-lts" --deployment-local-git
   ```

5. **Configure App Settings**

   ```bash
   az webapp config appsettings set --resource-group myResourceGroup --name myNextjsApp --settings NODE_ENV=production
   ```

6. **Deploy Application**

   ```bash
   # Add Azure remote
   git remote add azure https://<deployment-username>@<app-name>.scm.azurewebsites.net/<app-name>.git

   # Push to Azure
   git push azure main
   ```

### Method 2: GitHub Actions (Recommended)

1. **Create `.github/workflows/azure-deploy.yml`**

   ```yaml
   name: Deploy to Azure App Service

   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: "22"

         - name: Install dependencies
           run: npm ci

         - name: Build application
           run: npm run build

         - name: Deploy to Azure
           uses: azure/webapps-deploy@v2
           with:
             app-name: "your-app-name"
             publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
   ```

### Method 3: ZIP Deploy

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Create deployment package**

   ```bash
   zip -r app.zip . -x "node_modules/*" ".git/*" ".next/cache/*"
   ```

3. **Deploy using Azure CLI**
   ```bash
   az webapp deployment source config-zip --resource-group myResourceGroup --name myNextjsApp --src app.zip
   ```

## ⚙️ Azure Configuration

### App Settings

Configure these settings in Azure Portal or via CLI:

```bash
az webapp config appsettings set --resource-group myResourceGroup --name myNextjsApp --settings \
  NODE_ENV=production \
  WEBSITE_NODE_DEFAULT_VERSION=22-lts \
  SCM_DO_BUILD_DURING_DEPLOYMENT=true \
  WEBSITE_RUN_FROM_PACKAGE=1
```

### Health Check Configuration

In Azure Portal:

1. Go to your App Service
2. Navigate to **Monitoring** > **Health check**
3. Enable health check
4. Set health check path to `/api/health`
5. Configure check interval (recommended: 5 minutes)

### Application Insights (Optional)

1. **Create Application Insights resource**

   ```bash
   az monitor app-insights component create --app myNextjsApp --location eastus --resource-group myResourceGroup
   ```

2. **Get instrumentation key and configure**
   ```bash
   az webapp config appsettings set --resource-group myResourceGroup --name myNextjsApp --settings \
     APPINSIGHTS_INSTRUMENTATIONKEY=<your-key>
   ```

## 🔍 Monitoring and Troubleshooting

### Health Check Monitoring

- **Health Check**: `https://your-app.azurewebsites.net/api/health`
- **Readiness**: `https://your-app.azurewebsites.net/api/ready`
- **Liveness**: `https://your-app.azurewebsites.net/api/live`
- **Detailed Health**: `https://your-app.azurewebsites.net/api/healthz`

### Common Issues

1. **Build Failures**

   - Ensure Node.js 22 is specified in `package.json` engines
   - Check build logs in Azure Portal > Deployment Center

2. **Memory Issues**

   - Monitor `/api/healthz` endpoint for memory usage
   - Consider upgrading App Service Plan if needed

3. **Startup Issues**
   - Check Application Logs in Azure Portal
   - Verify `server.js` is correctly configured
   - Ensure `web.config` is present for IIS integration

### Log Analysis

```bash
# Stream logs
az webapp log tail --resource-group myResourceGroup --name myNextjsApp

# Download logs
az webapp log download --resource-group myResourceGroup --name myNextjsApp
```

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── health/          # Basic health check
│   │   ├── healthz/         # Comprehensive health check
│   │   ├── ready/           # Readiness probe
│   │   └── live/            # Liveness probe
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/              # React components
│   ├── Header.tsx
│   ├── InteractiveCounter.tsx
│   ├── DynamicForm.tsx
│   ├── DataVisualization.tsx
│   ├── DragDropList.tsx
│   ├── SearchFilter.tsx
│   ├── Modal.tsx
│   ├── AnimatedCards.tsx
│   └── RealTimeChat.tsx
├── lib/
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── .deployment              # Azure deployment config
├── deploy.cmd               # Azure deployment script
├── server.js                # Production server
├── web.config               # IIS configuration
├── azure-health-config.json # Health check configuration
└── package.json
```

## 🎯 Performance Optimization

### Azure-Specific Optimizations

1. **Enable compression** in `web.config`
2. **Use CDN** for static assets
3. **Configure caching** headers
4. **Enable Application Insights** for monitoring
5. **Use health checks** for automatic recovery

### Next.js Optimizations

1. **Image optimization** with Next.js Image component
2. **Code splitting** with dynamic imports
3. **Bundle analysis** with `@next/bundle-analyzer`
4. **Static generation** where possible

## 🔒 Security Considerations

1. **Environment Variables** - Store sensitive data in Azure App Settings
2. **HTTPS** - Enable HTTPS redirect in Azure
3. **Authentication** - Implement Azure AD if needed
4. **CORS** - Configure appropriate CORS policies
5. **Rate Limiting** - Implement rate limiting for APIs

## 📊 Scaling

### Horizontal Scaling

- Configure auto-scaling rules in Azure
- Monitor CPU and memory usage
- Use health checks for load balancer decisions

### Vertical Scaling

- Upgrade App Service Plan when needed
- Monitor application performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check Azure App Service logs
2. Monitor health check endpoints
3. Review Application Insights telemetry
4. Open GitHub issues for application bugs

---

**Built with ❤️ for Azure App Services**
