export const mockRoutes = [
    {
      route_id: "route1",
      predicate: "Paths: [/service1/api], match trailing slash: true",
      filters: [
        "[[StripPrefix parts = 1], order = 1]",
        "[[AddRequestHeader X-Service service1], order = 2]",
      ],
      uri: "lb://target1",
      order: 0,
    },
    {
      route_id: "route2",
      predicate:
        "Paths: [/service2/api], match trailing slash: true && Header: auth regexp=Auth2",
      filters: [
        "[[RewritePath /service2/(?<segment>.*) = /${segment}], order = 1]",
        "[[Retry retries = 3, statuses = [500]], order = 2]",
      ],
      uri: "lb://target2",
      order: 1,
    },
    {
      route_id: "route3",
      predicate:
        "Paths: [/service3/api], match trailing slash: true && Methods: [POST]",
      filters: [
        "[[PrefixPath /v1], order = 1]",
        "[[RemoveRequestHeader Cookie], order = 2]",
      ],
      uri: "lb://target3",
      order: 1,
    },
    {
      route_id: "route4",
      predicate:
        "Paths: [/service4/api], match trailing slash: true && Header: x-client regexp=ClientA",
      filters: [
        "[[RewritePath /service4/(?<segment>.*) = /v2/${segment}], order = 1]",
        "[[AddRequestHeader X-Trace true], order = 2]",
      ],
      uri: "lb://target4",
      order: 1,
    },
    {
      route_id: "route5",
      predicate:
        "Paths: [/service5/api], match trailing slash: true && Methods: [PUT]",
      filters: [
        "[[StripPrefix parts = 2], order = 1]",
        "[[Retry retries = 2, statuses = [502]], order = 2]",
      ],
      uri: "lb://target5",
      order: 2,
    },
    {
      route_id: "route6",
      predicate:
        "Paths: [/service6/api], match trailing slash: true && Header: auth regexp=Auth6",
      filters: [
        "[[RewritePath /service6/(?<segment>.*) = /${segment}], order = 1]",
        "[[Hystrix name = fallbackCmd, fallbackUri = forward:/fallback], order = 2]",
      ],
      uri: "lb://target6",
      order: 2,
    },
    {
      route_id: "route7",
      predicate:
        "Paths: [/service7/api], match trailing slash: true && Methods: [DELETE]",
      filters: [
        "[[PrefixPath /delete], order = 1]",
        "[[AddRequestHeader X-Deleted true], order = 2]",
      ],
      uri: "lb://target7",
      order: 2,
    },
    {
      route_id: "route8",
      predicate: "Paths: [/service8/api], match trailing slash: true",
      filters: [
        "[[StripPrefix parts = 1], order = 1]",
        "[ChangeResponseBodyType New content type = [application/json], In class = string, Out class = string]",
      ],
      uri: "lb://target8",
      order: 3,
    },
    {
      route_id: "route9",
      predicate:
        "Paths: [/service9/api], match trailing slash: true && Methods: [GET]",
      filters: [
        "[[RewritePath /service9/(?<segment>.*) = /${segment}], order = 1]",
        "[[RemoveRequestHeader Authorization], order = 2]",
      ],
      uri: "lb://target9",
      order: 3,
    },
    {
      route_id: "route10",
      predicate:
        "Paths: [/service10/api], match trailing slash: true && Header: auth regexp=Auth10",
      filters: [
        "[[PrefixPath /auth], order = 1]",
        "[[AddRequestHeader X-SecurityLevel high], order = 2]",
      ],
      uri: "lb://target10",
      order: 3,
    },
    {
      route_id: "route11",
      predicate:
        "Paths: [/service11/api], match trailing slash: true && Methods: [PATCH]",
      filters: [
        "[[StripPrefix parts = 1], order = 1]",
        "[[Retry retries = 1, statuses = [503]], order = 2]",
      ],
      uri: "lb://target11",
      order: 4,
    },
    {
      route_id: "route12",
      predicate:
        "Paths: [/service12/api], match trailing slash: true && Header: x-env regexp=prod",
      filters: [
        "[[RewritePath /service12/(?<segment>.*) = /${segment}], order = 1]",
        "[[AddRequestHeader X-Env prod], order = 2]",
      ],
      uri: "lb://target12",
      order: 4,
    },
    {
      route_id: "route13",
      predicate:
        "Paths: [/service13/api], match trailing slash: true && Methods: [OPTIONS]",
      filters: [
        "[[PrefixPath /preflight], order = 1]",
        "[[AddRequestHeader X-Cors true], order = 2]",
      ],
      uri: "lb://target13",
      order: 5,
    },
    {
      route_id: "route14",
      predicate:
        "Paths: [/service14/api], match trailing slash: true && Header: x-feature regexp=beta",
      filters: [
        "[[RewritePath /service14/(?<segment>.*) = /beta/${segment}], order = 1]",
        "[[AddRequestHeader X-Feature beta], order = 2]",
      ],
      uri: "lb://target14",
      order: 5,
    },
    {
      route_id: "route15",
      predicate:
        "Paths: [/service15/api], match trailing slash: true && Methods: [HEAD]",
      filters: [
        "[[StripPrefix parts = 2], order = 1]",
        "[[RemoveRequestHeader Cache-Control], order = 2]",
      ],
      uri: "lb://target15",
      order: 6,
    },
    {
      route_id: "route16",
      predicate:
        "Paths: [/service16/api], match trailing slash: true && Header: auth regexp=Auth16",
      filters: [
        "[[PrefixPath /secure], order = 1]",
        "[[Hystrix name = secureFallback, fallbackUri = forward:/secure-fallback], order = 2]",
      ],
      uri: "lb://target16",
      order: 6,
    },
    {
      route_id: "route17",
      predicate:
        "Paths: [/service17/api], match trailing slash: true && Methods: [GET, POST]",
      filters: [
        "[[RewritePath /service17/(?<segment>.*) = /api/${segment}], order = 1]",
        "[[AddRequestHeader X-MultiMethod true], order = 2]",
      ],
      uri: "lb://target17",
      order: 7,
    },
    {
      route_id: "route18",
      predicate:
        "Paths: [/service18/api], match trailing slash: true && Header: auth regexp=Auth18 && Methods: [PUT]",
      filters: [
        "[[StripPrefix parts = 1], order = 1]",
        "[[Retry retries = 4, statuses = [500, 502, 504]], order = 2]",
        "[[AddRequestHeader X-ComplexRule true], order = 3]",
      ],
      uri: "lb://target18",
      order: 8,
    },
  ];
  
  export const mockGlobalFilters = [
    {
      "org.springframework.cloud.gateway.filter.NettyWriteResponseFilter@5f57fde7":
        -1,
      "org.springframework.cloud.gateway.filter.RouteToRequestUrlFilter@5f78fde7":
        10000,
      "com.abc.gateway.filter.AFilter@654825dd8": -60,
      "org.springframework.cloud.gateway.filter.ForwardRoutingFilter@5f67poi7": 0,
      "com.abc.gateway.filter.CFilter@784525aa8": -20,
      "com.abc.gateway.filter.LogFilter@674512dd8": -120,
      "org.springframework.cloud.gateway.filter.WebsocketRoutingFilter@9xw7fde7": 1,
      "org.springframework.cloud.gateway.filter.NettyRoutingFilter@5f57oce7":
        10000,
      "org.springframework.cloud.gateway.filter.RemoveCachedBodyFilter@5f47wee7r":
        -100,
    },
  ];