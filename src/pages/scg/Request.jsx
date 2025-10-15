import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// 필터 목록 정의
const AVAILABLE_FILTERS = [
  "filter1",
  "filter2",
  "filter3",
  "filter4",
  "filter5",
  "filter6"
];


const initialNewRouteItem = {
  serverLocation: "",
  serviceName: "",
  brand: "",
  targetDomain: "",
  firewallCheck: "",
};

// API 라우팅 항목 초기값 정의
const initialApiNewItem = {
  apiProtocolName: "",
  description: "",
  caller: "",
  target: "",
  inUri: "",
  outUri: "",
  filters: [], // 다중 선택된 필터 목록
  memo: ""
};

// 라우터 수정 요청 탭의 상태를 초기화하기 위한 초기값 (임시)
const initialEditForm = {
  routeId: "",
  content: "",
};

export default function ScgRequest() {
  const [open, setOpen] = useState(false);

  // 신규 등록 탭 상태
  const [region, setRegion] = useState("");
  const [background, setBackground] = useState(""); // 등록 배경 상태 추가

  // 일반 라우팅 항목 상태 (도메인)
  const [newItem, setNewItem] = useState(initialNewRouteItem);
  const [domainItems, setDomainItems] = useState([]);

  // 새로운 API 라우팅 항목 상태
  const [apiNewItem, setApiNewItem] = useState(initialApiNewItem);
  const [apiRouteItems, setApiRouteItems] = useState([]);

  // 라우터 수정 요청 탭 상태
  const [editForm, setEditForm] = useState(initialEditForm);

  // 기타 문의 탭 상태
  const [etcContent, setEtcContent] = useState("");

  // 필터 드롭다운 Open 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // -------------------- 👇 탭 변경 시 상태 초기화 함수 추가 --------------------
  const handleTabChange = (value) => {
    // 모든 폼 데이터 및 목록 초기화
    setRegion("");
    setBackground("");
    setNewItem(initialNewRouteItem);
    setDomainItems([]);
    setApiNewItem(initialApiNewItem);
    setApiRouteItems([]);
    setEditForm(initialEditForm);
    setEtcContent("");

    // 탭 변경 시 필터 팝오버 닫기
    setIsFilterOpen(false);
    console.log(`탭 변경: ${value}로 전환. 모든 폼 데이터 초기화 완료.`);
  };
  // -------------------- 👆 탭 변경 시 상태 초기화 함수 추가 --------------------


  const submit_new = (e) => {
    e.preventDefault();
    if (background === "") {
      alert("등록 배경을 입력해 주세요.");
      return;
    }

    if (region === "") {
      alert("권역을 선택해 주세요.");
      return;
    }

    if (domainItems.length === 0) {
      alert("최소한 1개의 목적지 도메인 주소를 추가해야 합니다.")
      return;
    }

    if (apiRouteItems.length === 0) {
      alert("최소한 1개의 라우팅 항목을 추가해야 합니다.");
      return;
    }

    console.log("신규 등록 제출:", { region, background, domainItems, apiRouteItems });
    // setOpen(true);
  };

  const submit_edit = (e) => {

  }

  const submit_etc = (e) => {

  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // API 항목 입력 핸들러
  const handleApiInputChange = (e) => {
    const { name, value } = e.target;
    setApiNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // API 항목 필터 다중 선택 핸들러
  const handleFilterSelect = (filterName) => {
    setApiNewItem(prev => {
      const currentFilters = prev.filters || [];
      if (currentFilters.includes(filterName)) {
        return { ...prev, filters: currentFilters.filter(f => f !== filterName) };
      } else {
        return { ...prev, filters: [...currentFilters, filterName] };
      }
    });
  };

  // 일반 라우팅 항목 추가
  const addItem = () => {
    const requiredFields = ["serverLocation", "serviceName", "brand", "targetDomain", "firewallCheck"];
    const isFormValid = requiredFields.every(field => newItem[field] && newItem[field] !== "");

    if (!isFormValid) {
      alert("모든 Domain 주소 세부 항목을 입력/선택해야 합니다.");
      return;
    }

    setDomainItems(prev => [...prev, { id: Date.now(), ...newItem }]);
    setNewItem(initialNewRouteItem);
  };

  // API 라우팅 항목 추가
  const addApiItem = () => {
    const requiredFields = ["apiProtocolName", "description", "caller", "target", "inUri", "outUri"];
    const isFormValid = requiredFields.every(field => apiNewItem[field] && apiNewItem[field] !== "");

    if (!isFormValid) {
      alert("API 라우팅 필수 항목(API/프로토콜 명, 설명, 호출 주체, Target, In URI, Out URI)을 모두 입력해야 합니다.");
      return;
    }

    setApiRouteItems(prev => [...prev, { id: Date.now(), ...apiNewItem, filters: apiNewItem.filters.join(', ') }]); // 필터 배열을 문자열로 변환하여 저장
    setApiNewItem(initialApiNewItem);
  };


  const removeItem = (id) => {
    setDomainItems(prev => prev.filter(item => item.id !== id));
  }

  const removeApiItem = (id) => {
    setApiRouteItems(prev => prev.filter(item => item.id !== id));
  }

  return (
    <>
      <Helmet>
        <title>SCG 업무 요청</title>
        <meta name="description" content="라우터 신규/수정 요청 및 기타 문의를 접수하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>

      {/* -------------------- 👇 탭 컴포넌트에 onValueChange 핸들러 추가 -------------------- */}
      <Tabs defaultValue="new" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="new">라우터 신규 등록</TabsTrigger>
          <TabsTrigger value="edit">라우터 수정 요청</TabsTrigger>
          <TabsTrigger value="etc">기타 문의</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <Card className="grid gap-3 max-w-7xl">
            <CardHeader><CardTitle>라우터 신규 등록</CardTitle></CardHeader>
            <CardContent className="grid gap-3 max-w-7xl">

              <div className="mt-8 mb-2 font-bold text-lg">1. 지역 및 등록배경</div>
              <div className="grid grid-cols-2 gap-3 max-w-7xl">
                {/* 신규 등록 배경 Input에 상태 연결 */}
                <Input
                  placeholder="신규 라우팅 등록 배경"
                  required
                  className="max-w-1xl"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                />
                <Select
                  required
                  value={region}
                  onValueChange={setRegion}
                  className="max-w-1xl"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="지역 (Region) 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KR">KR</SelectItem>
                    <SelectItem value="JP">JP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 mb-2 font-bold text-lg">2. Domain 주소</div>
              <div className="grid grid-cols-4 gap-3">
                <Input
                  name="serverLocation"
                  placeholder="서버 위치"
                  required
                  value={newItem.serverLocation}
                  onChange={handleInputChange}
                />
                <Input
                  name="serviceName"
                  placeholder="서비스명"
                  required
                  value={newItem.serviceName}
                  onChange={handleInputChange}
                />

                <Select
                  required
                  value={newItem.brand}
                  onValueChange={(val) => handleSelectChange('brand', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="브랜드 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H">H</SelectItem>
                    <SelectItem value="K">K</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  required
                  value={newItem.firewallCheck}
                  onValueChange={(val) => handleSelectChange('firewallCheck', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="방화벽 확인요청" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O">O (확인 필요)</SelectItem>
                    <SelectItem value="X">X (확인 불필요)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  name="targetDomain"
                  placeholder="서비스 Target Domain 주소"
                  required
                  value={newItem.targetDomain}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
                <Button type="button" onClick={addItem} className="shrink-0">추가</Button>
              </div>

              {/* 일반 라우팅 목록 표시 */}
              {domainItems.length > 0 && (
                <div className="mt-6 border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>위치</TableHead>
                        <TableHead>서비스명</TableHead>
                        <TableHead>브랜드</TableHead>
                        <TableHead>Target Domain</TableHead>
                        <TableHead>방화벽</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {domainItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.serverLocation}</TableCell>
                          <TableCell>{item.serviceName}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.targetDomain}</TableCell>
                          <TableCell>{item.firewallCheck}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              title="삭제"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="mt-8 mb-2 font-bold text-lg">3. 라우팅 목록</div>

              {/* API 명, 설명, 호출 주체, Target */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  name="apiProtocolName"
                  placeholder="API 명/프로토콜 명"
                  required
                  value={apiNewItem.apiProtocolName}
                  onChange={handleApiInputChange}
                />
                <Input
                  name="description"
                  placeholder="설명"
                  required
                  value={apiNewItem.description}
                  onChange={handleApiInputChange}
                />
                <Input
                  name="caller"
                  placeholder="호출 주체 (출발지)"
                  required
                  value={apiNewItem.caller}
                  onChange={handleApiInputChange}
                />
                <Input
                  name="target"
                  placeholder="Target (목적지)"
                  required
                  value={apiNewItem.target}
                  onChange={handleApiInputChange}
                />
              </div>

              {/* In URI, Out URI */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  name="inUri"
                  placeholder="In URI (출발지 -> GW)"
                  required
                  value={apiNewItem.inUri}
                  onChange={handleApiInputChange}
                />
                <Input
                  name="outUri"
                  placeholder="Out URI (GW -> 목적지)"
                  required
                  value={apiNewItem.outUri}
                  onChange={handleApiInputChange}
                />
              </div>

              {/* 적용 Filter (다중 선택), 비고, 추가 버튼 */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start">
                {/* 적용 Filter (다중 선택 Popover 기반 구현) */}
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isFilterOpen}
                      className="w-full justify-between"
                    >
                      {apiNewItem.filters.length > 0
                        ? apiNewItem.filters.join(', ')
                        : "적용 Filter (다중 선택)"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {AVAILABLE_FILTERS.map((filter) => (
                            <CommandItem
                              key={filter}
                              onSelect={() => {
                                handleFilterSelect(filter);
                              }}
                            >
                              <Check
                                // 'cn' 함수가 프로젝트에 정의되어 있어야 합니다.
                                className={`mr-2 h-4 w-4 ${apiNewItem.filters.includes(filter) ? "opacity-100" : "opacity-0"
                                  }`}
                              />
                              {filter}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Input
                  name="memo"
                  placeholder="비고 (부가 요청)"
                  value={apiNewItem.memo}
                  onChange={handleApiInputChange}
                />

                <Button type="button" onClick={addApiItem} className="shrink-0 w-[80px]">추가</Button>
              </div>

              {/* API 라우팅 목록 표시 */}
              {apiRouteItems.length > 0 && (
                <div className="mt-6 border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">API/프로토콜 명</TableHead>
                        <TableHead className="w-[150px]">설명</TableHead>
                        <TableHead>호출 주체</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>In URI</TableHead>
                        <TableHead>Out URI</TableHead>
                        <TableHead>적용 Filter</TableHead>
                        <TableHead>비고</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiRouteItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.apiProtocolName}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.caller}</TableCell>
                          <TableCell>{item.target}</TableCell>
                          <TableCell>{item.inUri}</TableCell>
                          <TableCell>{item.outUri}</TableCell>
                          <TableCell className="text-sm">{item.filters}</TableCell>
                          <TableCell>{item.memo}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeApiItem(item.id)}
                              title="삭제"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <Button type="button" className="mt-6 max-w-7xl" onClick={submit_new}>요청 제출</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader><CardTitle>라우터 수정 요청</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit_edit} className="grid gap-3 max-w-xl">
                {/* 수정 요청 폼 상태 연결 */}
                <Input
                  placeholder="기존 Route ID"
                  required
                  value={editForm.routeId}
                  onChange={(e) => setEditForm(prev => ({ ...prev, routeId: e.target.value }))}
                />
                <Textarea
                  placeholder="수정 내용"
                  rows={4}
                  required
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                />
                <Button type="submit">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="etc">
          <Card>
            <CardHeader><CardTitle>기타 문의</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit_etc} className="grid gap-3 max-w-xl">
                {/* 기타 문의 폼 상태 연결 */}
                <Textarea
                  placeholder="문의 내용을 입력하세요"
                  rows={6}
                  required
                  value={etcContent}
                  onChange={(e) => setEtcContent(e.target.value)}
                />
                <Button type="submit">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Jira 티켓이 성공적으로 생성되었습니다</DialogTitle></DialogHeader>
          <div className="text-sm text-muted-foreground">Mock 동작으로, 실제 티켓은 생성되지 않습니다.</div>
        </DialogContent>
      </Dialog>
    </>
  );
}