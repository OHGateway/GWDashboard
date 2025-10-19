import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";
import { useCountry } from "@/hooks/useCountry";
import { MSA_GATEWAY_HOSTS } from "@/config/msaHosts";

const HOST_LABELS = {
  igw: "IGW",
  eigw: "EIGW",
  ogw: "OGW",
};

const HEALTH_PATH = "/check/hostHealth";

const buildHealthUrl = (baseUrl) => {
  if (!baseUrl) return "";
  return `${baseUrl.replace(/\/$/, "")}${HEALTH_PATH}`;
};

const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) return [];

  return rows.map((row, index) => {
    if (Array.isArray(row)) {
      const [name = `host-${index}`, status = "unknown"] = row;
      return { key: `${name}-${index}`, name, status };
    }

    if (row && typeof row === "object") {
      const name = row.name ?? row.id ?? row.host ?? `host-${index}`;
      const status =
        row.status ??
        row.value ??
        row.state ??
        row.connection ??
        row.result ??
        "unknown";
      return { key: `${name}-${index}`, name, status };
    }

    return {
      key: `host-${index}`,
      name: String(row ?? `host-${index}`),
      status: "unknown",
    };
  });
};

const statusMeta = (rawStatus) => {
  const normalized = String(rawStatus ?? "").toLowerCase();

  if (normalized === "connected") {
    return { label: "연결", variant: "success" };
  }

  if (normalized === "disconnected") {
    return { label: "연결 끊김", variant: "destructive" };
  }

  if (normalized === "connecting") {
    return { label: "연결 중", variant: "warning" };
  }

  return { label: rawStatus ?? "알 수 없음", variant: "outline" };
};

export default function ScgHealthCheck() {
  const country = useCountry();
  const selectedCountry = (country || "").toUpperCase();
  const [hosts, setHosts] = useState({});
  const [hostResults, setHostResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const handleRefreshAll = () => setRefreshIndex((prev) => prev + 1);

  const fetchHostHealth = useCallback(async (key, baseUrl, signal) => {
    if (!baseUrl) {
      setHostResults((prev) => ({
        ...prev,
        [key]: {
          status: "missing",
          data: [],
          message: "호스트 정보가 없습니다.",
        },
      }));
      return;
    }

    setHostResults((prev) => ({
      ...prev,
      [key]: { status: "loading", data: [] },
    }));

    try {
      const response = await fetch(buildHealthUrl(baseUrl), { signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (signal?.aborted) return;

      setHostResults((prev) => ({
        ...prev,
        [key]: { status: "success", data: normalizeRows(payload) },
      }));
    } catch (err) {
      if (signal?.aborted) return;

      setHostResults((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          data: [],
          message: err instanceof Error ? err.message : "상태 정보를 가져오지 못했습니다.",
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    const controller = new AbortController();
    const { signal } = controller;

    setIsLoading(true);
    setError("");
    setHostResults({});

    const hostConfig = MSA_GATEWAY_HOSTS[selectedCountry];
    if (!hostConfig) {
      setHosts({});
      setError(`선택한 국가(${selectedCountry})에 대한 호스트 정보가 없습니다.`);
      setIsLoading(false);
      return () => controller.abort();
    }

    setHosts(hostConfig);

    const entries = Object.entries(hostConfig);
    if (entries.length === 0) {
      setIsLoading(false);
      return () => controller.abort();
    }

    (async () => {
      await Promise.all(
        entries.map(([key, url]) => fetchHostHealth(key, url, signal))
      );
      if (!signal.aborted) {
        setIsLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [selectedCountry, refreshIndex, fetchHostHealth]);

  const hostEntries = useMemo(() => {
    const priority = ["igw", "eigw", "ogw"];
    const seen = new Set();
    const entries = [];

    priority.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(hosts, key)) {
        entries.push([key, hosts[key]]);
        seen.add(key);
      }
    });

    Object.entries(hosts).forEach(([key, url]) => {
      if (!seen.has(key)) {
        entries.push([key, url]);
      }
    });

    return entries;
  }, [hosts]);

  return (
    <>
      <Helmet>
        <title>MSA API GATEWAY 통신 상태</title>
        <meta
          name="description"
          content="선택한 국가의 MSA API Gateway 호스트 상태를 확인합니다."
        />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : "/"}
        />
      </Helmet>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>호스트 상태</CardTitle>
              <CardDescription>
                선택한 국가: <span className="font-medium">{selectedCountry || "—"}</span>
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleRefreshAll}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  갱신 중...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  상태 다시 확인
                </>
              )}
            </Button>
          </CardHeader>
          {error && (
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>

        {hostEntries.length === 0 && !error && !isLoading && (
          <Alert className="border-secondary/60 bg-secondary text-secondary-foreground">
            <AlertDescription>
              표시할 호스트 정보가 없습니다. 다른 국가를 선택하거나 다시 시도하세요.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hostEntries.map(([key, url]) => {
            const label = HOST_LABELS[key] ?? key.toUpperCase();
            const result = hostResults[key];

            return (
              <Card key={key}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{label}</CardTitle>
                  <CardDescription className="break-all text-xs">
                    {url || "호스트 URL 정보 없음"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!result && isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      상태 정보를 불러오는 중입니다.
                    </div>
                  )}

                  {result?.status === "loading" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      상태 정보를 불러오는 중입니다.
                    </div>
                  )}

                  {result?.status === "missing" && (
                    <Alert className="border-secondary/60 bg-secondary text-secondary-foreground">
                      <AlertDescription>{result.message}</AlertDescription>
                    </Alert>
                  )}

                  {result?.status === "error" && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {result.message || "상태 정보를 가져오지 못했습니다."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {result?.status === "success" && result.data.length === 0 && (
                    <Alert className="border-secondary/60 bg-secondary text-secondary-foreground">
                      <AlertDescription>표시할 상태 정보가 없습니다.</AlertDescription>
                    </Alert>
                  )}

                  {result?.status === "success" && result.data.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/2">호스트</TableHead>
                          <TableHead className="w-1/2">상태</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.data.map(({ key: rowKey, name, status }) => {
                          const meta = statusMeta(status);
                          return (
                            <TableRow key={rowKey ?? name}>
                              <TableCell className="font-medium">{name}</TableCell>
                              <TableCell>
                                <Badge variant={meta.variant}>{meta.label}</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
