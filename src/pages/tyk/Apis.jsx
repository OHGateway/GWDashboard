import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- 토큰 검증: Keyless면 'X', 아니면 'O' ---
function toAuth(r) {
  const isKeyless = r?.use_keyless === true;
  return isKeyless ? "X" : "O";
}

// --- 도메인 → 브랜드 ---
function toBrand(domain) {
  if (!domain) return "-";
  const d = String(domain).toLowerCase();
  if (d.includes("genesis.domain.com")) return "제네시스";
  if (d.includes("kia.domain.com")) return "기아";
  if (d.includes("bluelink.domain.com")) return "현대";
  return "-";
}


// --- 레이트 리밋 표기 ---
function toRateLimit(r) {
  const rate = r?.global_rate_limit?.rate ?? 0;
  const per = r?.global_rate_limit?.per ?? 0;
  if (!rate || !per) return "—";
  return `${rate} / ${per}s`;
}

// --- 상태 아이콘 (SVG 원) ---
function StatusDot({ value }) {
  // true -> green, false -> red, undefined/null -> yellow
  const fill = value === true ? "#22c55e" : value === false ? "#ef4444" : "#eab308";
  const label = value === true ? "Active" : value === false ? "Inactive" : "Unknown";
  return (
    <span className="inline-flex items-center justify-center" title={label}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
        <circle cx="6" cy="6" r="5" fill={fill} />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default function TykApis() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // 직접 호출 (server.cjs에서 CORS 허용)
        const res = await fetch("http://localhost:3000/definitions")

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();

        const mapped = raw.map((r, i) => ({
          id: r?.api_id ?? `row-${i}`,
          name: r?.name ?? "(no name)",
          brand: toBrand(r?.domain),
          listen_path: r?.proxy?.listen_path ?? "",
          target_url: r?.proxy?.target_url ?? "",
          tokenCheck: toAuth(r),            // 'O' | 'X'
          rate_limit: toRateLimit(r),
          status: null,                     // true | false | undefined
          slug: r?.slug ?? "",
          __raw: r,
        }));
        setRows(mapped);

        Promise.all(
          mapped.map(async (api) => {
            if (!api.target_url) return { id: api.id, ok: false };
            try {
              const r = await fetch(`/api/health?url=${encodeURIComponent(api.target_url)}`);
              const json = await r.json(); // { ok, status, reason }
              return { id: api.id, ok: !!json.ok };
            } catch {
              return { id: api.id, ok: false };
            }
          })
        ).then((results) => {
          setRows((prev) =>
            prev.map((row) => {
              const hit = results.find((r) => r.id === row.id);
              return hit ? { ...row, status: hit.ok } : row;
            })
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
    const qv = q.trim().toLowerCase();
    if (!qv) return rows;
    return rows.filter((r) => {
      const fields = [r.name, r.listen_path, r.target_url, r.slug];
      return fields.some((v) => (v || "").toLowerCase().includes(qv));
    });
  }, [q, rows]);

  return (
    <>
      <Helmet>
        <title>TYK API 목록 | Listen Path 검색</title>
        <meta name="description" content="TYK Gateway에 등록된 API를 검색하고 확인하세요." />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : "/"}
        />
      </Helmet>

      <div className="mx-auto w-full max-w-5xl px-4 space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">TYK API 목록</h1>
          <Input
            placeholder="이름 / Listen Path / Target URL 검색"
            className="w-full"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            {loading ? (
              <div className="min-h-[200px] flex items-center justify-center">
                불러오는 중…
              </div>
            ) : err ? (
              <div className="min-h-[200px] flex items-center justify-center text-red-600">
                오류: {err}
              </div>
            ) : data.length === 0 ? (
              <div className="min-h-[200px] flex items-center justify-center">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        <div className="font-semibold">API 명</div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="font-semibold">브랜드</div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="font-semibold">Listen Path</div>
                        <span className="block text-xs font-normal opacity-70">
                          (App &gt; GW)
                        </span>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="font-semibold">Target URL</div>
                        <span className="block text-xs font-normal opacity-70">
                          (GW &gt; Service)
                        </span>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="font-semibold">토큰 검증</div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="font-semibold">Rate Limit</div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="font-semibold">상태</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((api) => (
                      <TableRow key={api.id}>
                        <TableCell className="max-w-[240px] truncate" title={api.name}>
                          {api.name}
                        </TableCell>
                        <TableCell className="text-center">{api.brand}</TableCell>
                        <TableCell>{api.listen_path}</TableCell>
                        <TableCell className="max-w-[320px] truncate" title={api.target_url}>
                          {api.target_url}
                        </TableCell>
                        <TableCell className="text-center">{api.tokenCheck}</TableCell>
                        <TableCell className="text-center">{api.rate_limit}</TableCell>
                        <TableCell className="text-center">
                          <StatusDot value={api.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </>
  );
}
