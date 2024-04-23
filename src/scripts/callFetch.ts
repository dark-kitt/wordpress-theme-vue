/**
 * JS fetch() helper function
 *
 * @param method POST, GET, PUT, and DELETE
 * @param token authentication for REST-API
 * @param endpoint location of data
 * @param headers object of headers
 */
export default <T>({
  method = 'POST',
  headers = null,
  endpoint,
  token
}: {
  method: string;
  token?: string;
  endpoint: string;
  headers?: { [key: string]: string };
}): Promise<T> => {
  return fetch(`${process.env.REST_API}/wp-json/${process.env.REST_NAMESPACE}/${endpoint}`, {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json'
    },
    ...(headers && headers)
  }).then(async response => {
    const data = (await response.json()) as Promise<T>;

    if (!response.ok) {
      // exclude JWT Authentication token errors
      if (!(data as any).code?.includes('jwt_auth')) {
        throw new Error(response.statusText);
      }
    }

    return data;
  });
};
