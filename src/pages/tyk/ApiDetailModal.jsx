import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteIcon, Copy, Check, Send, CheckCircle2, XCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export function ApiDetailModal({ open, onOpenChange, api }) {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  // 모달이 열릴 때마다 상태 리셋
  useEffect(() => {
    if (open) {
      setConnectionStatus(null);
      setIsTesting(false);
    }
  }, [open]);

  if (!api) return null;

  const raw = api.__raw || {};

  // URL과 Path 분리
  let baseUrl = "—";
  let pathUrl = "—";

  if (api.target_url && api.target_url !== "—") {
    try {
      const url = new URL(api.target_url);
      baseUrl = url.origin;
      pathUrl = url.pathname;
    } catch (e) {
      baseUrl = api.target_url;
      pathUrl = "—";
    }
  }

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: "복사 완료",
        description: `${fieldName}이(가) 클립보드에 복사되었습니다.`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const testConnection = async () => {
    if (!api.target_url || api.target_url === "—") {
      toast({
        title: "테스트 불가",
        description: "Target URL이 설정되지 않았습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setConnectionStatus(null);

    try {
      const response = await fetch(`/api/health?url=${encodeURIComponent(api.target_url)}`);
      const json = await response.json();
      setConnectionStatus(json.ok ? "success" : "failed");

      toast({
        title: json.ok ? "통신 성공" : "통신 실패",
        description: json.ok ? "타겟 서버와 정상적으로 통신되었습니다." : "타겟 서버와 통신에 실패했습니다.",
        variant: json.ok ? "default" : "destructive",
      });
    } catch (err) {
      setConnectionStatus("failed");
      toast({
        title: "통신 실패",
        description: "타겟 서버와 통신에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <RouteIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold">{api.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{api.brand}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* listen_path */}
          {raw.proxy?.listen_path && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Listen path</label>
              <div className="space-y-2">
                <div className="p-3 bg-accent/30 rounded-lg border">
                  <code className="text-sm font-mono break-all">{raw.proxy.listen_path}</code>
                </div>
                {raw.allowed_methods && raw.allowed_methods.length > 0 && (
                  <div className="p-3 bg-accent/30 rounded-lg border">
                    <div className="text-xs text-muted-foreground mb-1">Method:methods</div>
                    <code className="text-sm font-mono break-all">{raw.allowed_methods.join(", ")}</code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Target URI */}
          <div className="mt-1 space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Target</label>

            <div className="p-3 bg-accent/30 rounded-lg border">
              <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                <span className="font-medium shrink-0">URL:</span>
                <code className="text-sm font-mono break-all flex-1">{baseUrl}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(baseUrl, "URL")}
                >
                  {copiedField === "URL" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg mt-1">
                <span className="font-medium shrink-0">Path:</span>
                <code className="text-sm font-mono break-all flex-1">{pathUrl}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(pathUrl, "Path")}
                >
                  {copiedField === "Path" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* 통신 상태 */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">통신 상태</label>
            <div className="mt-2 p-4 bg-accent/30 rounded-lg border space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Button
                  onClick={testConnection}
                  disabled={isTesting}
                  size="sm"
                  style={{ backgroundColor: "#eaf0ff", color: "#0167ff" }}
                  className="gap-2 hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                  {isTesting ? "테스트 중..." : "통신 테스트"}
                </Button>

                {connectionStatus && (
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {connectionStatus === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      <span className="text-sm font-medium">{connectionStatus === "success" ? "성공" : "실패"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {connectionStatus === "success"
                        ? "타겟 서버와 정상적으로 통신되었습니다."
                        : "타겟 서버와 통신에 실패했습니다."}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded border border-border/50">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  해당 테스트는 API GW 경유한 호출 테스트로 Gateway - 타겟 간의 통신 상태가 아님을 안내드립니다.
                </span>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Configuration</h3>
            <div className="space-y-2">
              {/* 토큰 검증 */}
              {api.tokenCheck && (
                <div className="flex justify-between items-center p-2 border-b">
                  <span className="text-sm text-muted-foreground">토큰 검증</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={api.tokenCheck === "O" ? "default" : "secondary"} className="text-sm">
                      {api.tokenCheck}
                    </Badge>
                    {api.tokenCheck === "O" && (
                      <Badge variant="outline" className="text-sm">
                        access token
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* rate-limit */}
              {api.rate_limit && api.rate_limit !== "—" && (
                <div className="flex justify-between items-center p-2 border-b">
                  <span className="text-sm text-muted-foreground">Rate Limit</span>
                  <Badge variant="secondary" className="text-sm font-mono">
                    {api.rate_limit}
                  </Badge>
                </div>
              )}

              {/* quota-limit */}
              <div className="flex justify-between items-center p-2 border-b">
                <span className="text-sm text-muted-foreground">Quota Limit</span>
                <Badge variant="secondary" className="text-sm font-mono">
                  100 / 60s
                </Badge>
              </div>

              {/* api-id */}
              {raw.api_id && (
                <div className="flex justify-between items-center p-2">
                  <span className="text-sm text-muted-foreground">API ID</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm font-mono text-xs">
                      {raw.api_id}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(raw.api_id, "API ID")}
                    >
                      {copiedField === "API ID" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
