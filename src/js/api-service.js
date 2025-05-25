const BASE_URL = 'https://pixabay.com/api/';
const keyToAPI = '49671148-c98206ce1d68b0fe5b89ea459';

function fetchImjByRequest(request, currentPage) {
  const params = new URLSearchParams({
    key: keyToAPI,
    q: request,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: 10,
  });

  return fetch(`${BASE_URL}?${params}`).then(response => {
    return response.json();
  });
}

export default { fetchImjByRequest };
