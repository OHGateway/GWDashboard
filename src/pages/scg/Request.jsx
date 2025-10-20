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
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// 새 상수 정의
const AVAILABLE_BRANDS = ["H", "K", "G"];
const AVAILABLE_ENV = ["검증", "운영"];
const TOKEN_OPTIONS = ["O", "X"];

// 신규 라우터 항목 초기값 정의 (New 탭용)
const initialNewRouteItem = {
  brand: "",
  listenPath: "",
  tokenCheck: "",
  targetPath: "",
  targetPrefix: "",
  targetAddress: "",
};

// 수정 라우터 항목 초기값 정의 (Edit 탭용)
const initialEditRouteItem = {
  brand: "",
  asisListenPath: "",
  asisTargetPath: "",
  asisTargetPrefix: "",
  asisTargetAddress: "",
  asisTokenCheck: "",
  tobeListenPath: "",
  tobeTargetPath: "",
  tobeTargetPrefix: "",
  tobeTargetAddress: "",
  tobeTokenCheck: "",
};


export default function TykRequest() {
  // 기존 상태
  const [open, setOpen] = useState(false);

  // 공통 상태
  const [region, setRegion] = useState("");
  const [background, setBackground] = useState("");
  const [environment, setEnvironment] = useState("");
  const [alert, setAlert] = useState("Jira 티켓이 성공적으로 생성되었습니다");

  // 신규 등록 관련 상태 (New 탭)
  const [newItem, setNewItem] = useState(initialNewRouteItem);
  const [routeItems, setRouteItems] = useState([]);

  // 수정 요청 관련 상태 (Edit 탭)
  const [editItem, setEditItem] = useState(initialEditRouteItem);
  const [editItems, setEditItems] = useState([]);
  const [editReason, setEditReason] = useState("");

  // 기타 문의 관련 상태
  const [etcContent, setEtcContent] = useState("");


  // =========================================================================
  // Submit Functions (e.preventDefault() 제거, onClick으로 호출되도록 수정)
  // =========================================================================

  // 신규 등록 제출
  const submit_new = () => {
    if (background === "" || region === "" || environment === "" || routeItems.length === 0) {
      setAlert("등록 배경, 지역, 환경을 선택하고 최소 1개의 라우터 항목을 추가해야 합니다.")
      setOpen(true);
      return;
    }
    console.log("신규 등록 제출:", { region, background, environment, routeItems });
    setAlert("Jira 티켓이 성공적으로 생성되었습니다")
    setOpen(true);
  };

  // 수정 요청 제출
  const submit_edit = () => {
    if (region === "" || environment === "" || editReason === "") {
      setAlert("지역, 환경 및 변경 사유를 모두 입력/선택해 주세요.")
      setOpen(true);
      return;
    }
    if (editItems.length === 0) {
      setAlert("최소한 1개의 수정 라우터 항목을 추가해야 합니다.")
      setOpen(true);
      return;
    }
    console.log("수정 요청 제출:", { region, environment, editReason, editItems });
    setAlert("Jira 티켓이 성공적으로 생성되었습니다");
    setOpen(true);
  };

  // 기타 문의 제출
  const submit_etc = () => {
    if (background === "" || region === "" || environment === "" || etcContent === "") {
      setAlert("문의 배경, 지역, 환경 및 상세 내용을 모두 입력/선택해 주세요.")
      setOpen(true);
      return;
    }
    console.log("기타 문의 제출:", { region, background, environment, etcContent });
    setAlert("Jira 티켓이 성공적으로 생성되었습니다");
    setOpen(true);
  };


  // =========================================================================
  // Handler Functions 
  // =========================================================================

  // New Tab - 입력값 변경 핸들러
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // New Tab - Select 변경 핸들러 (브랜드, 토큰)
  const handleNewSelectChange = (name, value) => {
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // New Tab - 라우터 항목 추가 함수
  const addNewItem = () => {
    const requiredFields = Object.keys(initialNewRouteItem);
    const isFormValid = requiredFields.every(field => newItem[field] && newItem[field] !== "");

    if (!isFormValid) {
      alert("모든 라우터 항목 세부 항목을 입력/선택해야 합니다.");
      return;
    }

    setRouteItems(prev => [...prev, { id: Date.now(), ...newItem }]);
    setNewItem(initialNewRouteItem);
  };

  // New Tab - 라우터 항목 제거 함수
  const removeNewItem = (id) => {
    setRouteItems(prev => prev.filter(item => item.id !== id));
  };


  // Edit Tab - 입력값 변경 핸들러
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem(prev => ({ ...prev, [name]: value }));
  };

  // Edit Tab - Select 변경 핸들러 (브랜드, 토큰)
  const handleEditSelectChange = (name, value) => {
    setEditItem(prev => ({ ...prev, [name]: value }));
  };

  // Edit Tab - 라우터 항목 추가 함수
  const addEditItem = () => {
    const requiredFields = Object.keys(initialEditRouteItem);
    const isFormValid = requiredFields.every(field => editItem[field] && editItem[field] !== "");

    if (!isFormValid) {
      alert("모든 AS-IS 및 TO-BE 라우터 세부 항목을 입력/선택해야 합니다.");
      return;
    }

    setEditItems(prev => [...prev, { id: Date.now(), ...editItem }]);
    setEditItem(initialEditRouteItem);
  };

  // Edit Tab - 라우터 항목 제거 함수
  const removeEditItem = (id) => {
    setEditItems(prev => prev.filter(item => item.id !== id));
  };

  // Tab 변경 시 초기화
  const handleTabChange = (value) => {
    // 공통 초기화
    setRegion("");
    setEnvironment("");
    setBackground("");

    // New/Edit/Etc 탭 상태 초기화
    setEtcContent(""); // Etc 탭 초기화 추가
    setEditReason("");
    setEditItem(initialEditRouteItem);
    setEditItems([]);
    setNewItem(initialNewRouteItem);
    setRouteItems([]);
  };


  return (
    <>
      <Helmet>
        <title>TYK 업무 요청</title>
        <meta name="description" content="신규 등록, 수정 요청, 기타 문의를 접수하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <Tabs defaultValue="new" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="new">신규 등록</TabsTrigger>
          <TabsTrigger value="edit">수정 요청</TabsTrigger>
          <TabsTrigger value="etc">기타 문의</TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------------------------------- */}
        {/* '신규 등록' 탭 (form 태그 제거) */}
        <TabsContent value="new">
          <Card className="grid gap-3 max-w-7xl">
            <CardHeader><CardTitle>Listen Path 신규 등록</CardTitle></CardHeader>
            <CardContent className="grid gap-3 max-w-7xl">
              <div className="grid gap-3"> {/* form 태그 제거 */}
                <div className="mt-4 mb-2 font-bold text-lg">1. 등록 배경 및 환경 정보</div>
                <div className="grid grid-cols-3 gap-3 max-w-7xl">
                  <Input placeholder="신규 라우팅 등록 배경" required value={background} onChange={(e) => setBackground(e.target.value)} />
                  <Select required value={region} onValueChange={setRegion}>
                    <SelectTrigger><SelectValue placeholder="지역 (Region) 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KR">KR</SelectItem>
                      <SelectItem value="JP">JP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select required value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger><SelectValue placeholder="환경 선택" /></SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ENV.map(env => (<SelectItem key={env} value={env}>{env}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-8 mb-2 font-bold text-lg">2. 신규 라우터 항목</div>
                <div className="grid grid-cols-3 gap-3">
                  <Select required value={newItem.brand} onValueChange={(val) => handleNewSelectChange('brand', val)}>
                    <SelectTrigger><SelectValue placeholder="브랜드 선택" /></SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_BRANDS.map(brand => (<SelectItem key={brand} value={brand}>{brand}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Input name="listenPath" placeholder="Listen Path (APP -> API G/W)" required value={newItem.listenPath} onChange={handleNewInputChange} />
                  <Input name="targetPath" placeholder="Target Path (API G/W -> Service)" required value={newItem.targetPath} onChange={handleNewInputChange} />
                </div>
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                  <Select required value={newItem.tokenCheck} onValueChange={(val) => handleNewSelectChange('tokenCheck', val)}>
                    <SelectTrigger><SelectValue placeholder="토큰 검증 여부" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O">O (필요)</SelectItem>
                      <SelectItem value="X">X (불필요)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input name="targetPrefix" placeholder="Target Prefix" required value={newItem.targetPrefix} onChange={handleNewInputChange} />
                  <Input name="targetAddress" placeholder="Target 주소 정보" required value={newItem.targetAddress} onChange={handleNewInputChange} />
                  <Button type="button" onClick={addNewItem} className="shrink-0 w-[80px]">추가</Button>
                </div>
                {routeItems.length > 0 && (
                  <div className="mt-6 border rounded-lg overflow-x-auto">
                    <Table className="min-w-[800px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">브랜드</TableHead>
                          <TableHead>Listen Path</TableHead>
                          <TableHead className="w-[80px]">토큰 검증</TableHead>
                          <TableHead>Target Path</TableHead>
                          <TableHead>Target Prefix</TableHead>
                          <TableHead>Target 주소 정보</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routeItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.brand}</TableCell>
                            <TableCell>{item.listenPath}</TableCell>
                            <TableCell>{item.tokenCheck}</TableCell>
                            <TableCell>{item.targetPath}</TableCell>
                            <TableCell>{item.targetPrefix}</TableCell>
                            <TableCell>{item.targetAddress}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeNewItem(item.id)} title="삭제">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button type="button" onClick={submit_new} className="mt-6 max-w-7xl">요청 제출</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------------------------------------------------------------------------- */}
        {/* '수정 요청' 탭 (form 태그 제거) */}
        <TabsContent value="edit">
          <Card className="grid gap-3 max-w-7xl">
            <CardHeader><CardTitle>기존 Listen Path 수정</CardTitle></CardHeader>
            <CardContent className="grid gap-3 max-w-7xl">
              <div className="grid gap-3"> {/* form 태그 제거 */}
                <div className="mt-4 mb-2 font-bold text-lg">1. 지역 및 환경 정보</div>
                <div className="grid grid-cols-2 gap-3 max-w-xl">
                  <Select required value={region} onValueChange={setRegion}>
                    <SelectTrigger><SelectValue placeholder="지역 (Region) 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KR">KR</SelectItem>
                      <SelectItem value="JP">JP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select required value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger><SelectValue placeholder="환경 선택" /></SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ENV.map(env => (<SelectItem key={env} value={env}>{env}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-8 mb-2 font-bold text-lg">2. 수정 라우터 항목 (AS-IS → TO-BE)</div>
                <div className="grid gap-3 p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="grid grid-cols-4 gap-3">
                    <Select required value={editItem.brand} onValueChange={(val) => handleEditSelectChange('brand', val)}>
                      <SelectTrigger className="col-span-1"><SelectValue placeholder="브랜드" /></SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_BRANDS.map(brand => (<SelectItem key={brand} value={brand}>{brand}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <div className="col-span-3 text-sm text-muted-foreground self-center">수정할 항목의 브랜드를 먼저 선택해주세요.</div>
                  </div>
                  <Separator className="my-2" />
                  <div className="font-semibold text-base text-gray-700 dark:text-gray-300">AS-IS (현재)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input name="asisListenPath" placeholder="Listen Path" required value={editItem.asisListenPath} onChange={handleEditInputChange} />
                    <Input name="asisTargetPath" placeholder="Target Path" required value={editItem.asisTargetPath} onChange={handleEditInputChange} />
                    <Input name="asisTargetPrefix" placeholder="Target Prefix" required value={editItem.asisTargetPrefix} onChange={handleEditInputChange} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input name="asisTargetAddress" placeholder="Target 주소 정보" required value={editItem.asisTargetAddress} onChange={handleEditInputChange} />
                    <Select required value={editItem.asisTokenCheck} onValueChange={(val) => handleEditSelectChange('asisTokenCheck', val)}>
                      <SelectTrigger><SelectValue placeholder="토큰 검증 (AS-IS)" /></SelectTrigger>
                      <SelectContent>
                        {TOKEN_OPTIONS.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator className="my-3" />
                  <div className="font-semibold text-base text-blue-600 dark:text-blue-400">TO-BE (변경 후)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input name="tobeListenPath" placeholder="변경할 Listen Path" required value={editItem.tobeListenPath} onChange={handleEditInputChange} />
                    <Input name="tobeTargetPath" placeholder="변경할 Target Path" required value={editItem.tobeTargetPath} onChange={handleEditInputChange} />
                    <Input name="tobeTargetPrefix" placeholder="변경할 Target Prefix" required value={editItem.tobeTargetPrefix} onChange={handleEditInputChange} />
                  </div>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    <Input name="tobeTargetAddress" placeholder="변경할 Target 주소 정보" required value={editItem.tobeTargetAddress} onChange={handleEditInputChange} />
                    <Select required value={editItem.tobeTokenCheck} onValueChange={(val) => handleEditSelectChange('tobeTokenCheck', val)}>
                      <SelectTrigger><SelectValue placeholder="토큰 검증 (TO-BE)" /></SelectTrigger>
                      <SelectContent>
                        {TOKEN_OPTIONS.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addEditItem} className="shrink-0 w-[80px]">추가</Button>
                  </div>
                </div>
                <div className="mt-8 mb-2 font-bold text-lg">3. 변경 사유</div>
                <Textarea placeholder="라우팅 변경에 대한 상세 사유를 입력하세요." rows={3} required value={editReason} onChange={(e) => setEditReason(e.target.value)} />
                {editItems.length > 0 && (
                  <div className="mt-6 border rounded-lg overflow-x-auto">
                    <Table className="min-w-[1200px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">브랜드</TableHead>
                          <TableHead colSpan={5} className="text-center bg-gray-100 dark:bg-gray-700">AS-IS (현재 정보)</TableHead>
                          <TableHead colSpan={5} className="text-center bg-blue-100 dark:bg-blue-900/50">TO-BE (변경 정보)</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead className="w-[150px]">L. Path</TableHead>
                          <TableHead className="w-[150px]">T. Path</TableHead>
                          <TableHead className="w-[100px]">T. Prefix</TableHead>
                          <TableHead className="w-[150px]">T. 주소</TableHead>
                          <TableHead className="w-[50px]">토큰</TableHead>
                          <TableHead className="w-[150px]">L. Path</TableHead>
                          <TableHead className="w-[150px]">T. Path</TableHead>
                          <TableHead className="w-[100px]">T. Prefix</TableHead>
                          <TableHead className="w-[150px]">T. 주소</TableHead>
                          <TableHead className="w-[50px]">토큰</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.brand}</TableCell>
                            <TableCell>{item.asisListenPath}</TableCell>
                            <TableCell>{item.asisTargetPath}</TableCell>
                            <TableCell>{item.asisTargetPrefix}</TableCell>
                            <TableCell>{item.asisTargetAddress}</TableCell>
                            <TableCell>{item.asisTokenCheck}</TableCell>
                            <TableCell className="bg-blue-50/50 dark:bg-blue-900/20">{item.tobeListenPath}</TableCell>
                            <TableCell className="bg-blue-50/50 dark:bg-blue-900/20">{item.tobeTargetPath}</TableCell>
                            <TableCell className="bg-blue-50/50 dark:bg-blue-900/20">{item.tobeTargetPrefix}</TableCell>
                            <TableCell className="bg-blue-50/50 dark:bg-blue-900/20">{item.tobeTargetAddress}</TableCell>
                            <TableCell className="bg-blue-50/50 dark:bg-blue-900/20">{item.tobeTokenCheck}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeEditItem(item.id)} title="삭제">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button type="button" onClick={submit_edit} className="mt-6 max-w-7xl">요청 제출</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------------------------------------------------------------------------- */}
        {/* '기타 문의' 탭 (form 태그 제거) */}
        <TabsContent value="etc">
          <Card>
            <CardHeader><CardTitle>기타 문의</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 max-w-7xl"> {/* form 태그 제거 */}

                <div className="mt-4 mb-2 font-bold text-lg">1. 문의 배경 및 환경 정보</div>
                <div className="grid grid-cols-3 gap-3 max-w-7xl">
                  <Input
                    placeholder="문의 배경 (e.g., 장애 문의, 정책 문의 등)"
                    required
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                  />
                  <Select
                    required
                    value={region}
                    onValueChange={setRegion}
                  >
                    <SelectTrigger><SelectValue placeholder="지역 (Region) 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KR">KR</SelectItem>
                      <SelectItem value="JP">JP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    required
                    value={environment}
                    onValueChange={setEnvironment}
                  >
                    <SelectTrigger><SelectValue placeholder="환경 선택" /></SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ENV.map(env => (<SelectItem key={env} value={env}>{env}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-8 mb-2 font-bold text-lg">2. 문의 상세 내용</div>
                <Textarea
                  placeholder="문의 내용을 상세하게 입력해 주세요."
                  rows={6}
                  required
                  value={etcContent}
                  onChange={(e) => setEtcContent(e.target.value)}
                />
                <Button type="button" onClick={submit_etc} className="mt-6 max-w-7xl">요청 제출</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="leading-relaxed">{alert}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">Mock 동작으로, 실제 티켓은 생성되지 않습니다.</div>
        </DialogContent>
      </Dialog>
    </>
  );
}