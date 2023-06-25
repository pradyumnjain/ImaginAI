const routes = {
  healthCheck: {
    path: 'api/health-check',
    method: 'get',
    value: {
      // just a example response
      status: 'ok',
    },
  },
} as const

export default routes
