import axios from 'axios';

const API_KEY = '32021376-a2c338f161985bdac1a580f15';
const URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page) {
  const { data } = await axios.get(
    `${URL}?key=${API_KEY}&q=${query}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
  );
  return data;
}
