import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/tmp/input";
import { Card, CardContent } from "@/components/ui/tmp/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tmp/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { ApiDetailModal } from "@/pages/tyk/ApiDetailModal";
import definitionsData from "@/../mock-server/tyk/data/definitions.json"; // 로컬 파일에서 데이터 임포트

function toAuth(r) {
  const isKeyless = r?.use_keyless === true;
  return isKeyless ? "X" : "O";
}

function toBrand(domain) {
  if (!domain) return "-";
  const d = String(domain).toLowerCase();
  if (d.includes("genesis.domain.com")) return "제네시스";
  if (d.includes("kia.domain.com")) return "기아";
  if (d.includes("bluelink.domain.com")) return "현대";
  return "-";
}

function toRateLimit(r) {
  const rate = r?.global_rate_limit?.rate ?? 0;
  const per = r?.global_rate_limit?.per ?? 0;
  if (!rate || !per) return "—";
  return `${rate} / ${per}s`;
}

function StatusDot({ value }) {
  const fill = value === true ? "hsl(var(--success))" : value === false ? "hsl(var(--error))" : "hsl(var(--warning))";
  const label = value === true ? "Active" : value === false ? "Inactive" : "Unknown";
  return (
    <span className="inline-flex items-center" title={label}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
        <circle cx="6" cy="6" r="5" fill={fill} />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function alignClass(align) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

const COLUMNS = [
  { key: "name", header: "API 명", width: 180, align: "left" },
  { key: "brand", header: "브랜드", width: 100, align: "center" },
  {
    key: "listen_path",
    header: (
      <>
        Listen Path
        <span className="block text-xs font-normal opacity-70">(App &gt; GW)</span>
      </>
    ),
    width: 260,
    align: "left",
  },
  {
    key: "target_url",
    header: (
      <>
        Target URL
        <span className="block text-xs font-normal opacity-70">(GW &gt; Service)</span>
      </>
    ),
    width: 280,
    align: "left",
  },
  { key: "tokenCheck", header: "토큰 검증", width: 80, align: "center" },
];

const COLSPAN = COLUMNS.length;

function MessageRow({ children }) {
  return (
    <TableRow>
      <TableCell colSpan={COLSPAN} className="py-6 text-center text-sm text-muted-foreground">
        {children}
      </TableCell>
    </TableRow>
  );
}

export default function TykApis() {
  const [q, setQ] = useState("");
  const [authFilter, setAuthFilter] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [selectedApi, setSelectedApi] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // 실제 API 통해 데이터 불러옴
        // const res = await fetch("http://localhost:3000/definitions");
        // if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // const raw = await res.json();

        const mapped = definitionsData.map((r, i) => ({
          // 로컬 파일에서 불러온 데이터 사용
          // const mapped = raw.map((r, i) => ({        // 실제 API 사용 시
          id: r?.api_id ?? `row-${i}`,
          name: r?.name ?? "(no name)",
          brand: toBrand(r?.domain),
          listen_path: r?.proxy?.listen_path ?? "",
          target_url: r?.proxy?.target_url ?? "",
          tokenCheck: toAuth(r),
          rate_limit: toRateLimit(r),
          status: null,
          slug: r?.slug ?? "",
          __raw: r,
        }));
        setRows(mapped);

        Promise.all(
          mapped.map(async (api) => {
            if (!api.target_url) return { id: api.id, ok: false };
            try {
              const r = await fetch(`/api/health?url=${encodeURIComponent(api.target_url)}`);
              const json = await r.json();
              return { id: api.id, ok: !!json.ok };
            } catch {
              return { id: api.id, ok: false };
            }
          }),
        ).then((results) => {
          setRows((prev) =>
            prev.map((row) => {
              const hit = results.find((r) => r.id === row.id);
              return hit ? { ...row, status: hit.ok } : row;
            }),
          );
        });
      } catch (e) {
        setErr(e?.message || "failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const data = useMemo(() => {
    let filtered = rows;
    
    // 토큰 검증 필터
    if (authFilter !== "all") {
      filtered = filtered.filter((r) => r.tokenCheck === authFilter);
    }
    
    // 검색어 필터
    const qv = q.trim().toLowerCase();
    if (qv) {
      filtered = filtered.filter((r) => {
        const fields = [r.name, r.listen_path, r.target_url, r.slug];
        return fields.some((v) => (v || "").toLowerCase().includes(qv));
      });
    }
    
    return filtered;
  }, [q, authFilter, rows]);

  const handleRowClick = (api) => {
    setSelectedApi(api);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">API Gateway Routes</h1>
          <p className="text-muted-foreground">View and search API route configurations</p>
        </div>
      </div>

      {/* Search */}
      <Card className="dashboard-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="이름 / Listen Path / Target URL 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Token Filter Buttons */}
          <div className="flex gap-2 mt-4">
            <Badge
              variant="outline"
              className="cursor-pointer px-3 py-1.5 transition-colors"
              style={authFilter === "all" ? { backgroundColor: "#eaf0ff", color: "#0167ff", borderColor: "#0167ff" } : {}}
              onClick={() => setAuthFilter("all")}
            >
              전체
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer px-3 py-1.5 transition-colors"
              style={authFilter === "O" ? { backgroundColor: "#eaf0ff", color: "#0167ff", borderColor: "#0167ff" } : {}}
              onClick={() => setAuthFilter("O")}
            >
              토큰 검증 O
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer px-3 py-1.5 transition-colors"
              style={authFilter === "X" ? { backgroundColor: "#eaf0ff", color: "#0167ff", borderColor: "#0167ff" } : {}}
              onClick={() => setAuthFilter("X")}
            >
              토큰 검증 X
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {err && (
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-center py-4 text-destructive">오류: {err}</div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="dashboard-card">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <colgroup>
                {COLUMNS.map((c) => (
                  <col key={c.key} style={{ minWidth: `${c.width}px` }} />
                ))}
              </colgroup>

              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {COLUMNS.map((c) => (
                    <TableHead
                      key={c.key}
                      className="font-semibold text-center whitespace-nowrap h-12 sm:h-14 text-xs sm:text-sm"
                    >
                      {c.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && <MessageRow>데이터를 불러오는 중...</MessageRow>}
                {!loading && !err && data.length === 0 && <MessageRow>검색 결과가 없습니다.</MessageRow>}
                {!loading &&
                  !err &&
                  data.map((api) => (
                    <TableRow
                      key={api.id}
                      className="cursor-pointer transition-colors hover:bg-accent/50"
                      onClick={() => handleRowClick(api)}
                    >
                      {COLUMNS.map((c) => {
                        let value = api[c.key] ?? "";

                        if (c.key === "brand") {
                          value = (
                            <Badge variant="outline" className="bg-white text-foreground">
                              {api[c.key]}
                            </Badge>
                          );
                        }

                        const isTextCell = typeof value === "string";

                        return (
                          <TableCell
                            key={c.key}
                            className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm align-middle ${alignClass(c.align)}`}
                            title={isTextCell ? value : undefined}
                          >
                            {isTextCell ? (
                              <div className="truncate" style={{ maxWidth: `${c.width}px` }}>
                                {value}
                              </div>
                            ) : (
                              <div>{value}</div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ApiDetailModal open={modalOpen} onOpenChange={setModalOpen} api={selectedApi} />
    </div>
  );
}
