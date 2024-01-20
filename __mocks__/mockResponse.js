function mockResponse() {
  const body = {
    /** TODO mock return body */
  };

  return {
    json: async () => body,
    status: 200,
    headers: {
      'Content-type': 'application/json',
    },
  };
}

module.exports = mockResponse;
