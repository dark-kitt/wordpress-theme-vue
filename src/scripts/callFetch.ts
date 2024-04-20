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
  }).then(response => {
    return response.json() as Promise<T>;
  });
};
