import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_URL === 'DEV' ? 'http://locahost:4000' : 'https://damp-haze-7367.fly.dev/'
  // baseURL: 'http://localhost:4000'

});


