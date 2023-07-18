import {
  ChatState,
} from './chat.state';

export const videos = {
  _id: '',
  name: '',
  image: '',
  description: '',
  brand: '',
  category: '',
  price: 0,
  countInStock: 0,
  rating: 0,
  numReviews: 0,
  reviews: [],
};

export const ChatInitialState: ChatState = {
  loading: false,
  error: null,
  data: []
};
