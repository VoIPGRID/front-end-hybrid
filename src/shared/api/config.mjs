export const base = 'http://localhost:8888/api/v2';

export const defaultHeaders = {
  mode: 'cors',
  method: 'get',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-CSRFToken': 'r' }
};
