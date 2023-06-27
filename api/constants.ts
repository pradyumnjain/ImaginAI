const routes = {
  healthCheck: {
    path: 'api/health-check',
    method: 'get',
    body: {
      status: 'ok',
    },
  },
  home: {
    path: 'api/get/home',
    method: 'post',
    body: {
      url_list: ['asd', 'asd'] as string[],
      next_cursor: 23,
    },
    variables: {
      cursor: 22 as number,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  },
  image: {
    path: 'api/get/image',
    method: 'post',
    body: {
      image: '' as string,
    },
    variables: {
      name: '' as string,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  },
  search: {
    path: 'api/search/image',
    method: 'post',
    body: {
      url_list: ['asd', 'asd'] as string[],
    },
    variables: {
      image: '' as string,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  },
} as const

export default routes
