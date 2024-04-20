export default <T>({
  method = 'POST',
  token,
  endpoint
}: {
  method: string;
  token?: string;
  endpoint: string;
}): Promise<T> => {
  return fetch(`${process.env.REST_API}/wp-json/${process.env.REST_NAMESPACE}/${endpoint}`, {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json'
    }
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
