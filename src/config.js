// src/config.ts
// Mock configuration and data for the Gateway Dashboard

export const API_BASE_URLS = {
  TYK_GATEWAY: "https://api.mock.tyk-gateway.com",
  SPRING_CLOUD_GATEWAY: "https://api.mock.spring-cloud-gateway.com",
  JIRA: "http://localhost:8080",
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
      "id": "10001",
      "key": "PROJ-101",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10001",
      "fields": {
        "summary": "로그인 버튼 클릭 시 500 에러 발생",
        "description": "운영 환경에서 특정 유저가 로그인 시도 시 500 내부 서버 에러가 발생함. 로그 확인 필요.",
        "issuetype": {
          "id": "10004",
          "name": "Bug",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "3",
          "name": "In Progress",
          "statusCategory": {
            "id": 4,
            "key": "inprogress",
            "name": "In Progress",
            "colorName": "yellow"
          }
        },
        "priority": {
          "id": "1",
          "name": "Highest",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/highest.svg"
        },
        "assignee": {
          "emailAddress": "developer@example.com",
          "displayName": "김개발",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=developer&avatarId=10401"
          }
        },
        "reporter": {
          "emailAddress": "tester@example.com",
          "displayName": "이테스트",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=tester&avatarId=10402"
          }
        },
        "labels": ["backend", "critical", "login"],
        "components": [
          {
            "id": "10010",
            "name": "Authentication"
          }
        ],
        "created": "2025-10-21T10:00:00.000+0900",
        "updated": "2025-10-21T14:30:00.000+0900"
      }
    },
    {
      "id": "10002",
      "key": "PROJ-102",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10002",
      "fields": {
        "summary": "신규 기능: 사용자 프로필 페이지 디자인",
        "description": "사용자 정보(이름, 이메일, 프로필 사진)를 보여주는 페이지 디자인 작업",
        "issuetype": {
          "id": "10001",
          "name": "Task",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "10000",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "To Do",
            "colorName": "blue-gray"
          }
        },
        "priority": {
          "id": "3",
          "name": "Medium",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/medium.svg"
        },
        "assignee": null,
        "reporter": {
          "emailAddress": "pm@example.com",
          "displayName": "박기획",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=pm&avatarId=10403"
          }
        },
        "labels": ["design", "new-feature"],
        "components": [
          {
            "id": "10011",
            "name": "Frontend"
          }
        ],
        "created": "2025-10-20T11:00:00.000+0900",
        "updated": "2025-10-20T11:00:00.000+0900"
      }
    },
    {
      "id": "10003",
      "key": "PROJ-103",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10003",
      "fields": {
        "summary": "프로필 페이지 API 엔드포인트 개발",
        "description": null,
        "issuetype": {
          "id": "10005",
          "name": "Sub-task",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10316&avatarType=issuetype",
          "subtask": true
        },
        "parent": {
          "id": "10002",
          "key": "PROJ-102",
          "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10002",
          "fields": {
            "summary": "신규 기능: 사용자 프로필 페이지 디자인",
            "status": {
              "name": "To Do"
            },
            "priority": {
              "name": "Medium"
            },
            "issuetype": {
              "name": "Task"
            }
          }
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "10000",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "To Do",
            "colorName": "blue-gray"
          }
        },
        "priority": {
          "id": "3",
          "name": "Medium",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/medium.svg"
        },
        "assignee": {
          "emailAddress": "developer@example.com",
          "displayName": "김개발",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=developer&avatarId=10401"
          }
        },
        "reporter": {
          "emailAddress": "pm@example.com",
          "displayName": "박기획",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=pm&avatarId=10403"
          }
        },
        "labels": [],
        "components": [],
        "created": "2025-10-21T09:15:00.000+0900",
        "updated": "2025-10-21T09:15:00.000+0900"
      }
    },
    {
      "id": "10004",
      "key": "PROJ-104",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10004",
      "fields": {
        "summary": "DB 마이그레이션 계획 수립",
        "description": "현 시스템 DB를 AWS RDS로 이전하기 위한 계획 및 일정 수립",
        "issuetype": {
          "id": "10002",
          "name": "Story",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "10001",
          "name": "Done",
          "statusCategory": {
            "id": 3,
            "key": "done",
            "name": "Done",
            "colorName": "green"
          }
        },
        "priority": {
          "id": "2",
          "name": "High",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/high.svg"
        },
        "assignee": {
          "emailAddress": "infra@example.com",
          "displayName": "최인프",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=infra&avatarId=10404"
          }
        },
        "reporter": {
          "emailAddress": "pm@example.com",
          "displayName": "박기획",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=pm&avatarId=10403"
          }
        },
        "labels": ["infra", "database", "migration"],
        "components": [
          {
            "id": "10012",
            "name": "Infra"
          }
        ],
        "created": "2025-10-15T15:00:00.000+0900",
        "updated": "2025-10-18T18:00:00.000+0900"
      }
    },
    {
      "id": "10005",
      "key": "PROJ-105",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10005",
      "fields": {
        "summary": "결제 모듈 연동 테스트 케이스 작성",
        "description": "신규 도입하는 PG사 결제 모듈 관련 TC 작성",
        "issuetype": {
          "id": "10001",
          "name": "Task",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "3",
          "name": "In Progress",
          "statusCategory": {
            "id": 4,
            "key": "inprogress",
            "name": "In Progress",
            "colorName": "yellow"
          }
        },
        "priority": {
          "id": "3",
          "name": "Medium",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/medium.svg"
        },
        "assignee": {
          "emailAddress": "tester@example.com",
          "displayName": "이테스트",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=tester&avatarId=10402"
          }
        },
        "reporter": {
          "emailAddress": "tester@example.com",
          "displayName": "이테스트",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=tester&avatarId=10402"
          }
        },
        "labels": ["qa", "payment"],
        "components": [
          {
            "id": "10013",
            "name": "Payment"
          }
        ],
        "created": "2025-10-21T11:00:00.000+0900",
        "updated": "2025-10-21T16:00:00.000+0900"
      }
    },
    {
      "id": "10006",
      "key": "PROJ-106",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10006",
      "fields": {
        "summary": "모바일 앱 푸시 알림 성능 개선",
        "description": "푸시 알림 발송 속도 지연 문제 해결",
        "issuetype": {
          "id": "10004",
          "name": "Bug",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "10000",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "To Do",
            "colorName": "blue-gray"
          }
        },
        "priority": {
          "id": "2",
          "name": "High",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/high.svg"
        },
        "assignee": null,
        "reporter": {
          "emailAddress": "developer@example.com",
          "displayName": "김개발",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=developer&avatarId=10401"
          }
        },
        "labels": ["performance", "push", "mobile"],
        "components": [
          {
            "id": "10010",
            "name": "Authentication"
          },
          {
            "id": "10014",
            "name": "Mobile"
          }
        ],
        "created": "2025-10-22T09:00:00.000+0900",
        "updated": "2025-10-22T09:00:00.000+0900"
      }
    },
    {
      "id": "10007",
      "key": "PROJ-107",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10007",
      "fields": {
        "summary": "운영 가이드 문서 최신화",
        "description": "신규 기능 추가에 따른 운영 가이드 업데이트",
        "issuetype": {
          "id": "10001",
          "name": "Task",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "10000",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "To Do",
            "colorName": "blue-gray"
          }
        },
        "priority": {
          "id": "4",
          "name": "Low",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/low.svg"
        },
        "assignee": {
          "emailAddress": "pm@example.com",
          "displayName": "박기획",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=pm&avatarId=10403"
          }
        },
        "reporter": {
          "emailAddress": "pm@example.com",
          "displayName": "박기획",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=pm&avatarId=10403"
          }
        },
        "labels": ["documentation"],
        "components": [],
        "created": "2025-10-22T10:00:00.000+0900",
        "updated": "2025-10-22T10:00:00.000+0900"
      }
    },
    {
      "id": "10008",
      "key": "PROJ-108",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10008",
      "fields": {
        "summary": "CI/CD 파이프라인 빌드 시간 단축",
        "description": "빌드 캐시 적용 및 병렬 처리로 빌드 시간 30% 단축 목표",
        "issuetype": {
          "id": "10002",
          "name": "Story",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "3",
          "name": "In Progress",
          "statusCategory": {
            "id": 4,
            "key": "inprogress",
            "name": "In Progress",
            "colorName": "yellow"
          }
        },
        "priority": {
          "id": "3",
          "name": "Medium",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/medium.svg"
        },
        "assignee": {
          "emailAddress": "infra@example.com",
          "displayName": "최인프",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=infra&avatarId=10404"
          }
        },
        "reporter": {
          "emailAddress": "infra@example.com",
          "displayName": "최인프",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=infra&avatarId=10404"
          }
        },
        "labels": ["devops", "ci-cd"],
        "components": [
          {
            "id": "10012",
            "name": "Infra"
          }
        ],
        "created": "2025-10-20T17:00:00.000+0900",
        "updated": "2025-10-21T10:00:00.000+0900"
      }
    },
    {
      "id": "10009",
      "key": "PROJ-109",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10009",
      "fields": {
        "summary": "검색 결과 정확도 개선 (신규 알고리즘 적용)",
        "description": "검색 엔진에 새로운 랭킹 알고리즘 적용하여 정확도 10% 향상",
        "issuetype": {
          "id": "10002",
          "name": "Story",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "10000",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "To Do",
            "colorName": "blue-gray"
          }
        },
        "priority": {
          "id": "2",
          "name": "High",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/high.svg"
        },
        "assignee": {
          "emailAddress": "developer@example.com",
          "displayName": "김개발",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=developer&avatarId=10401"
          }
        },
        "reporter": {
          "emailAddress": "pm@example.com",
          "displayName": "박기획",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=pm&avatarId=10403"
          }
        },
        "labels": ["search", "backend", "new-feature"],
        "components": [
          {
            "id": "10015",
            "name": "Search"
          }
        ],
        "created": "2025-10-21T18:00:00.000+0900",
        "updated": "2025-10-21T18:00:00.000+0900"
      }
    },
    {
      "id": "10010",
      "key": "PROJ-110",
      "self": "https://your-jira-instance.atlassian.net/rest/api/2/issue/10010",
      "fields": {
        "summary": "IE11 지원 종료 공지 팝업 추가",
        "description": "2025년 12월 31일부로 IE11 지원이 종료됨을 알리는 팝업을 프론트엔드에 추가",
        "issuetype": {
          "id": "10001",
          "name": "Task",
          "iconUrl": "https://your-jira-instance.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
          "subtask": false
        },
        "project": {
          "id": "10000",
          "key": "PROJ",
          "name": "메인 프로젝트",
          "projectTypeKey": "software"
        },
        "status": {
          "id": "10001",
          "name": "Done",
          "statusCategory": {
            "id": 3,
            "key": "done",
            "name": "Done",
            "colorName": "green"
          }
        },
        "priority": {
          "id": "4",
          "name": "Low",
          "iconUrl": "https://your-jira-instance.atlassian.net/images/icons/priorities/low.svg"
        },
        "assignee": null,
        "reporter": {
          "emailAddress": "pm@example.com",
          "displayName": "박기획",
          "active": true,
          "avatarUrls": {
            "48x48": "https://your-jira-instance.atlassian.net/secure/useravatar?ownerId=pm&avatarId=10403"
          }
        },
        "labels": ["frontend", "ie11"],
        "components": [
          {
            "id": "10011",
            "name": "Frontend"
          }
        ],
        "created": "2025-10-10T14:00:00.000+0900",
        "updated": "2025-10-15T11:00:00.000+0900"
      }
    }  
  ],
};
