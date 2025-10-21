import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Search, RefreshCw, Route as RouteIcon, Filter, Globe} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCountry } from "@/hooks/useCountry";
import { mockRoutes, mockGlobalFilters } from "@/mocks/Routes";


export default function SpringRoutes() {
  const country = useCountry();
  const [routes, setRoutes] = useState([]);
  const [globalFilters, setGlobalFilters] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTarget, setSearchTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [selectedUris, setSelectedUris] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showAllTargets, setShowAllTargets] = useState(false);

  
  useEffect(() => {
    fetchRoutesAndFilters();
  }, [country]);

  console.log(country);

  useEffect(() => {
    let filtered = routes;

    // ALL 버튼이 눌리지 않았고 선택된 URI도 없으면 → 빈 리스트
    if (!showAll && selectedUris.length === 0) {
      setFilteredRoutes([]);
      return;
    }

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (route) =>
          route.routeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.uri.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.predicates.some((p) =>
            JSON.stringify(p.name)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
      );
    }

    // Target URI 필터
    if (!showAll && selectedUris.length > 0) {
      filtered = filtered.filter((route) => selectedUris.includes(route.uri));
    }

    setFilteredRoutes(filtered);
  }, [searchTerm, routes, selectedUris, showAll]);

  const fetchRoutesAndFilters = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation:
      // const routesResponse = await fetch('/actuator/gateway/routes');
      // const filtersResponse = await fetch('/actuator/gateway/globalfilters');

      // 1. mockRoutes 변환
      const convertedRoutes = mockRoutes.map((r) => ({
        routeId: r.route_id,
        uri: parseUri(r.uri),
        order: r.order,
        predicates: [
          {
            name: parsePredicate(r.predicate),
            args: {},
          },
        ],
        filters: r.filters.map((f) => ({
          name: parseFilterName(f),
          order: parseFilterOrder(f),
          args: {},
        })),
      }));

      // 2. mockGlobalFilters 변환
      const convertedGlobalFilters = Object.entries(mockGlobalFilters[0]).map(
        ([name, order]) => ({
          name: parseFilterName(name), // ← 글로벌 필터도 동일 적용 가능
          order,
        })
      );

      setRoutes(convertedRoutes);
      setGlobalFilters(convertedGlobalFilters);

      toast({
        title: "Routes Loaded",
        description: `Loaded ${convertedRoutes.length} routes and ${convertedGlobalFilters.length} global filters`,
      });
    } catch (err) {
      setError("Failed to fetch routes and filters from Spring Cloud Gateway");
      toast({
        title: "Error",
        description: "Failed to load route configurations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseUri = (uri) => {
    return uri.replace("lb://", "");
  };

  const parsePredicate = (predicate) => {
    let predicates = [];

    // 조건들을 && 기준으로 분리
    const parts = predicate.split("&&").map((p) => p.trim());

    parts.forEach((part) => {
      if (part.includes("Paths")) {
        const match = part.match(/Paths:\s*\[([^\]]+)\]/);
        if (match) {
          predicates.push(`Path: ${match[1]}`);
        }
      } else if (part.includes("Header")) {
        const match = part.match(/Header:\s*(.*)/);
        if (match) {
          predicates.push(`Header: ${match[1]}`);
        }
      } else if (part.includes("Methods")) {
        const match = part.match(/Methods?\s*:\s*\[?([^\]]+)\]?/);
        if (match) {
          predicates.push(`Method: ${match[1]}`);
        }
      }
    });

    // 콤마로 합쳐서 반환하거나, 배열 그대로 반환 가능
    return predicates.join(", ");
  };

  const parseFilterName = (fullName) => {
    if (fullName.includes("RewritePath")) {
      const match = fullName.match(/=\s*\/[^\],]+/);
      return match ? match[0].replace("= ", "Out Path = ") : null;
    }
    if (!fullName) return "";
    // 마지막 점(.) 뒤 문자열 추출
    const lastPart = fullName.split(".").pop();
    if (lastPart.includes("[")) return lastPart.replace("[", "").split(" ")[0];
    // $$Lambda 앞까지만 남기기
    return lastPart.split("$$")[0].split("@")[0];
  };

  const parseFilterOrder = (filterInfo) => {
    if (filterInfo.includes("order")) {
      const order = filterInfo.split("order = ")[1];
      return order.replace("]", "");
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>MSA API GATEWAY 라우터 정보 | MSA API GATEWAY Routes</title>
        <meta
          name="description"
          content="View and search Spring Cloud Gateway route configurations and global filters"
        />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : "/"}
        />
      </Helmet>

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

        {/*  */}
        <TabsContent value="routes">
          {/* Search */}
          <Card className="dashboard-card bg-accent">
            <CardHeader>
              {/* Header */}
              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="py-2">
                  <CardTitle>MSA API GATEWAY Routes</CardTitle>
                  <p className="text-muted-foreground">
                    타겟 서비스 선택 후 타겟 내 정보 검색
                  </p>
                </div>
                <Button
                  onClick={fetchRoutesAndFilters}
                  disabled={isLoading}
                  className="action-button flex ml-auto"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 ">
              {/* Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 h-full">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder=" Search target Services"
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                    onFocus={() => setShowAllTargets(true)}
                    onBlur={() =>
                      setTimeout(() => setShowAllTargets(false), 200)
                    }
                    className="pl-10 "
                  />
                  {/* 검색 결과 드롭다운 */}
                  {(showAllTargets || searchTarget) && (
                    <div className="absolute z-10 w-full mt-1 border rounded shadow-lg max-h-60 overflow-auto">
                      {[...new Set(routes.map((r) => r.uri))]
                        .filter((uri) =>
                          uri.toLowerCase().includes(searchTarget.toLowerCase())
                        )
                        .map((uri) => (
                          <div
                            key={uri}
                            onClick={() => {
                              setShowAll(false);
                              setSelectedUris((prev) =>
                                prev.includes(uri) ? prev : [...prev, uri]
                              );
                              setSearchTarget(""); // 선택하면 검색창 초기화
                              setShowAllTargets(false);
                            }}
                            className="flex justify-between px-3 py-2 cursor-pointer bg-secondary hover:bg-accent"
                          >
                            {uri}
                            {selectedUris.includes(uri) && (
                              <Badge variant="secondary" className="text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {/* Search */}
                {/* Search Input */}
                <div className="relative flex-1 h-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder=" Search routes by ID, URI, or predicates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 "
                  />
                </div>

                {/* Summary */}
                {!isLoading && (
                  <div className="flex items-center px-4 py-2 rounded-md border bg-background text-sm text-muted-foreground h-full">
                    Showing {filteredRoutes.length} of {routes.length} routes
                  </div>
                )}
              </div>

              {/* Target URI 필터 */}
              {routes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 pt-4">
                  {[...new Set(routes.map((r) => r.uri))].map((uri) => (
                    <Button
                      key={uri}
                      variant={
                        selectedUris.includes(uri) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setShowAll(false); // ALL 모드 해제
                        setSelectedUris(
                          (prev) =>
                            prev.includes(uri)
                              ? prev.filter((u) => u !== uri) // 토글 해제
                              : [...prev, uri] // 복수 선택 허용
                        );
                      }}
                    >
                      {uri}
                    </Button>
                  ))}
                  {/* ALL 버튼 */}
                  <Badge
                    variant={showAll ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1 text-sm transition 
                ${
                  showAll ? "bg-primary text-white" : "bg-muted hover:bg-accent"
                }`}
                    onClick={() => {
                      setShowAll(true);
                      setSelectedUris([]);
                    }}
                  >
                    ALL
                  </Badge>
                  {(showAll || selectedUris.length) > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAll(false);
                        setSelectedUris([]);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
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
                    <Card
                      key={route.routeId}
                      className="dashboard-card hover:shadow-lg transition-all duration-200"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl flex items-center gap-2">
                              <RouteIcon className="w-5 h-5 text-primary" />
                              {route.routeId}
                              <div className="flex items-center mt-2 gap-2">
                                <Badge variant="outline">
                                  Order: {route.order}
                                </Badge>
                              </div>
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* URI */}
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Target Service
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="w-4 h-4 text-primary" />
                            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                              {route.uri}
                            </code>
                          </div>
                        </div>

                        {/* Predicates */}
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Predicates
                          </label>
                          <div className="mt-1 space-y-1">
                            {route.predicates.map((predicate, index) => (
                              <div
                                key={index}
                                className="text-sm bg-accent/50 px-3 py-2 rounded border"
                              >
                                <span className="font-medium">
                                  {predicate.name}
                                </span>
                                <span className="ml-2 font-mono">
                                  {Object.entries(predicate.args)
                                    .map(([key, value]) => `${key}=${value}`)
                                    .join(", ")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Filters */}
                        {route.filters.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Filters (Global + Route Specific)
                            </label>
                            <div className="mt-1 space-y-1">
                              {[
                                ...globalFilters.map((f) => ({
                                  ...f,
                                  isGlobal: true,
                                })),
                                ...route.filters.map((f) => ({
                                  ...f,
                                  isGlobal: false,
                                })),
                              ]
                                // order 순으로 정렬
                                .sort((a, b) => a.order - b.order)
                                .map((filter, index) => (
                                  <div
                                    key={index}
                                    className={`text-sm px-3 py-2 rounded border flex items-center justify-between ${
                                      filter.isGlobal
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-primary/10 border-primary/20"
                                    }`}
                                  >
                                    <div>
                                      <span
                                        className={`font-medium ${
                                          filter.isGlobal
                                            ? "text-blue-700"
                                            : "text-primary"
                                        }`}
                                      >
                                        {filter.name}
                                      </span>
                                      {filter.args &&
                                        Object.keys(filter.args).length > 0 && (
                                          <span className="ml-2 font-mono text-xs">
                                            (
                                            {Object.entries(filter.args)
                                              .map(
                                                ([key, value]) =>
                                                  `${key}=${value}`
                                              )
                                              .join(", ")}
                                            )
                                          </span>
                                        )}
                                    </div>
                                    {/* order 값 표시 */}
                                    <Badge variant="outline">
                                      Order: {filter.order}
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        {route.metadata &&
                          Object.keys(route.metadata).length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                Metadata
                              </label>
                              <div className="mt-1 grid grid-cols-2 gap-2">
                                {Object.entries(route.metadata).map(
                                  ([key, value]) => (
                                    <div key={key} className="text-sm">
                                      <span className="text-muted-foreground">
                                        {key}:
                                      </span>
                                      <span className="ml-2 font-mono">
                                        {value}
                                      </span>
                                    </div>
                                  )
                                )}
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
                        <h3 className="text-lg font-medium mb-2">
                          No Routes Found
                        </h3>
                        <p className="text-muted-foreground">
                          {searchTerm
                            ? "No routes match your search criteria."
                            : "No routes are currently configured."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
                  {[1, 2, 3, 4, 5].map((i) => (
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
                          {filter.order < 0 ? "Pre-filter" : "Post-filter"}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
