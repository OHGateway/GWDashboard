import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, Route as RouteIcon, Filter, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SpringRoutes() {
  const [routes, setRoutes] = useState([]);
  const [globalFilters, setGlobalFilters] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockRoutes = [
    {
      routeId: 'user-service',
      uri: 'lb://user-service',
      predicates: [
        {
          name: 'Path',
          args: { pattern: '/api/v1/users/**' }
        },
        {
          name: 'Method',
          args: { methods: 'GET,POST,PUT,DELETE' }
        }
      ],
      filters: [
        {
          name: 'StripPrefix',
          args: { parts: 1 }
        },
        {
          name: 'CircuitBreaker',
          args: { name: 'user-service-cb', fallbackUri: 'forward:/fallback/users' }
        }
      ],
      metadata: {
        'connect-timeout': 1000,
        'response-timeout': 5000
      },
      order: 0
    },
    {
      routeId: 'order-service',
      uri: 'lb://order-service',
      predicates: [
        {
          name: 'Path',
          args: { pattern: '/api/v1/orders/**' }
        },
        {
          name: 'Header',
          args: { header: 'X-Request-Id', regexp: '\\d+' }
        }
      ],
      filters: [
        {
          name: 'StripPrefix',
          args: { parts: 1 }
        },
        {
          name: 'AddRequestHeader',
          args: { name: 'X-Gateway-Source', value: 'spring-cloud-gateway' }
        },
        {
          name: 'RequestRateLimiter',
          args: { 
            'redis-rate-limiter.replenishRate': 10,
            'redis-rate-limiter.burstCapacity': 20
          }
        }
      ],
      metadata: {
        'connect-timeout': 2000,
        'response-timeout': 10000
      },
      order: 1
    },
    {
      routeId: 'payment-service',
      uri: 'https://payment-api.external.com',
      predicates: [
        {
          name: 'Path',
          args: { pattern: '/api/v2/payments/**' }
        },
        {
          name: 'Method',
          args: { methods: 'POST,PUT' }
        }
      ],
      filters: [
        {
          name: 'RewritePath',
          args: { regexp: '/api/v2/payments/(?<segment>.*)', replacement: '/payments/${segment}' }
        },
        {
          name: 'AddRequestHeader',
          args: { name: 'Authorization', value: 'Bearer ${jwt.token}' }
        }
      ],
      metadata: {
        'connect-timeout': 3000,
        'response-timeout': 15000
      },
      order: 2
    }
  ];

  const mockGlobalFilters = [
    {
      name: 'LoadBalancerClientFilter',
      order: 10100
    },
    {
      name: 'RouteToRequestUrlFilter',
      order: 10000
    },
    {
      name: 'NettyRoutingFilter',
      order: 2147483647
    },
    {
      name: 'GlobalLoggingFilter',
      order: -1000
    },
    {
      name: 'GlobalAuthenticationFilter',
      order: -500
    }
  ];

  useEffect(() => {
    fetchRoutesAndFilters();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = routes.filter(route => 
        route.routeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.uri.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.predicates.some(p => 
          JSON.stringify(p.args).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(routes);
    }
  }, [searchTerm, routes]);

  const fetchRoutesAndFilters = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation:
      // const routesResponse = await fetch('/actuator/gateway/routes');
      // const filtersResponse = await fetch('/actuator/gateway/globalfilters');
      
      setRoutes(mockRoutes);
      setGlobalFilters(mockGlobalFilters);
      
      toast({
        title: 'Routes Loaded',
        description: `Loaded ${mockRoutes.length} routes and ${mockGlobalFilters.length} global filters`,
      });
    } catch (err) {
      setError('Failed to fetch routes and filters from Spring Cloud Gateway');
      toast({
        title: 'Error',
        description: 'Failed to load route configurations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPredicates = (predicates) => {
    return predicates.map(predicate => {
      const args = Object.entries(predicate.args)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return `${predicate.name}(${args})`;
    }).join(' AND ');
  };

  const formatFilters = (filters) => {
    return filters.map(filter => {
      const args = Object.entries(filter.args || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return args ? `${filter.name}(${args})` : filter.name;
    });
  };

  const getUriType = (uri) => {
    if (uri.startsWith('lb://')) return 'Load Balanced';
    if (uri.startsWith('https://') || uri.startsWith('http://')) return 'Direct';
    return 'Unknown';
  };

  const getUriColor = (uri) => {
    if (uri.startsWith('lb://')) return 'default';
    if (uri.startsWith('https://')) return 'success';
    if (uri.startsWith('http://')) return 'warning';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>SCG 라우터 정보 | Spring Cloud Gateway Routes</title>
        <meta name="description" content="View and search Spring Cloud Gateway route configurations and global filters" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Spring Cloud Gateway Routes</h1>
          <p className="text-muted-foreground">
            View and search route configurations and global filters
          </p>
        </div>
        <Button onClick={fetchRoutesAndFilters} disabled={isLoading} className="action-button">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card className="dashboard-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search routes by ID, URI, or predicates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabs for Routes and Global Filters */}
      <Tabs defaultValue="routes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <RouteIcon className="w-4 h-4" />
            Routes ({filteredRoutes.length})
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Global Filters ({globalFilters.length})
          </TabsTrigger>
        </TabsList>

        {/* Routes Tab */}
        <TabsContent value="routes">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="dashboard-card">
                  <CardContent className="pt-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRoutes.map((route) => (
                <Card key={route.routeId} className="dashboard-card hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <RouteIcon className="w-5 h-5 text-primary" />
                          {route.routeId}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getUriColor(route.uri)}>
                            {getUriType(route.uri)}
                          </Badge>
                          <Badge variant="outline">Order: {route.order}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* URI */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Target URI</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-4 h-4 text-primary" />
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {route.uri}
                        </code>
                      </div>
                    </div>

                    {/* Predicates */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Predicates</label>
                      <div className="mt-1 space-y-1">
                        {route.predicates.map((predicate, index) => (
                          <div key={index} className="text-sm bg-accent/50 px-3 py-2 rounded border">
                            <span className="font-medium">{predicate.name}:</span>
                            <span className="ml-2 font-mono">
                              {Object.entries(predicate.args).map(([key, value]) => 
                                `${key}=${value}`
                              ).join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filters */}
                    {route.filters.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Filters</label>
                        <div className="mt-1 space-y-1">
                          {route.filters.map((filter, index) => (
                            <div key={index} className="text-sm bg-primary/10 px-3 py-2 rounded border border-primary/20">
                              <span className="font-medium text-primary">{filter.name}</span>
                              {filter.args && Object.keys(filter.args).length > 0 && (
                                <span className="ml-2 font-mono text-xs">
                                  ({Object.entries(filter.args).map(([key, value]) => 
                                    `${key}=${value}`
                                  ).join(', ')})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    {route.metadata && Object.keys(route.metadata).length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          {Object.entries(route.metadata).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="ml-2 font-mono">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredRoutes.length === 0 && !isLoading && (
                <Card className="dashboard-card">
                  <CardContent className="pt-6 text-center py-12">
                    <RouteIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Routes Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No routes match your search criteria.' : 'No routes are currently configured.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Global Filters Tab */}
        <TabsContent value="filters">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Global Filters
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Filters that apply to all routes, ordered by execution priority
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {globalFilters
                    .sort((a, b) => a.order - b.order)
                    .map((filter, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <Filter className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{filter.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Execution order: {filter.order}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {filter.order < 0 ? 'Pre-filter' : 'Post-filter'}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      {!isLoading && filteredRoutes.length > 0 && (
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredRoutes.length} of {routes.length} routes
              </span>
              <div className="flex items-center gap-4">
                <span>Load Balanced: {routes.filter(r => r.uri.startsWith('lb://')).length}</span>
                <span>Direct: {routes.filter(r => r.uri.startsWith('http')).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
