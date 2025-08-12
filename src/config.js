// src/config.ts
// Mock configuration and data for the Gateway Dashboard

export const API_BASE_URLS = {
  TYK_GATEWAY: "https://api.mock.tyk-gateway.com",
  SPRING_CLOUD_GATEWAY: "https://api.mock.spring-cloud-gateway.com",
  JIRA: "https://your-company.atlassian.net",
};

export const MOCK_DATA = {
  tykApis: [
    { id: 1, name: "User Service", listen_path: "/user-service/", status: "active" },
    { id: 2, name: "Order Service", listen_path: "/order-service/v1/", status: "active" },
    { id: 3, name: "Payment Service", listen_path: "/payment/", status: "inactive" },
    { id: 4, name: "Inventory", listen_path: "/inventory/", status: "active" },
    { id: 5, name: "Notification", listen_path: "/notify/v2/", status: "active" },
  ],
  scgRoutes: [
    { id: "user_route", uri: "lb://user-service", predicates: ["Path=/api/users/**"], filters: ["StripPrefix=2"] },
    { id: "product_route", uri: "lb://product-service", predicates: ["Path=/api/products/**"], filters: ["StripPrefix=2"] },
    { id: "order_route", uri: "lb://order-service", predicates: ["Path=/api/orders/**"], filters: ["StripPrefix=2", "Retry=3"] },
  ],
  scgGlobalFilters: [
    { name: "RequestLogger", args: { level: "INFO" } },
    { name: "RequestRateLimiter", args: { replenishRate: 10, burstCapacity: 20 } },
  ],
  tykCerts: [
    { id: "cert-001", commonName: "*.example.com", expiresAt: "2026-05-01", issuer: "Let's Encrypt" },
    { id: "cert-002", commonName: "api.example.com", expiresAt: "2025-12-15", issuer: "DigiCert" },
  ],
  scgHealthEndpoints: [
    "https://service-a.example.com/health",
    "https://service-b.example.com/health",
    "https://service-c.example.com/health",
  ],
  jiraTickets: [
    {
      id: "GW-101",
      title: "Add new route for analytics service",
      assignee: "ccsgateway",
      reporter: "John Doe",
      status: "In Progress",
      duedate: "2025-08-15",
      description: "Create SCG route for analytics-service with StripPrefix=2",
      type: "Task",
    },
    {
      id: "GW-102",
      title: "Rotate TLS certificate (*.example.com)",
      assignee: "Jane Smith",
      reporter: "ccsgateway",
      status: "To Do",
      duedate: "2025-08-18",
      description: "Upload and validate new cert in TYK cert store",
      type: "Task",
    },
    {
      id: "GW-103",
      title: "Fix payment listen path",
      assignee: "ccsgateway",
      reporter: "Alice",
      status: "Done",
      duedate: "2025-08-10",
      description: "Change /payment/ to /payment/v2/",
      type: "Bug",
    },
  ],
};
