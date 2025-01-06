import axios from 'src/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { map } from 'lodash';

const API_URL = '/api/data/postData';

const initialState = {
  posts: [],
  followers: [],
  gallery: [],
};

export const UserProfileSlice = createSlice({
  name: 'UserPost',
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.posts = action.payload;
    },
    getFollowers: (state, action) => {
      state.followers = action.payload;
    },
    getPhotos: (state, action) => {
      state.gallery = action.payload;
    },
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed,
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },
  },
});

export const { getPosts, getFollowers, onToggleFollow, getPhotos } = UserProfileSlice.actions;

export const fetchPosts = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}`);
    dispatch(getPosts(response.data));
  } catch (err) {
    throw new Error(err);
  }
};
export const likePosts = (postId) => async (dispatch) => {
  try {
    const response = await axios.post('/api/data/posts/like', { postId });
    dispatch(getPosts(response.data.posts));
  } catch (err) {
    throw new Error(err);
  }
};
export const addComment = (postId, comment) => async (dispatch) => {
  try {
    const response = await axios.post('/api/data/posts/comments/add', { postId, comment });
    dispatch(getPosts(response.data.posts));
  } catch (err) {
    throw new Error(err);
  }
};

export const addReply = (postId, commentId, reply) => async (dispatch) => {
  try {
    const response = await axios.post('/api/data/posts/replies/add', { postId, commentId, reply });
    dispatch(getPosts(response.data.posts));
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchFollwores = () => async (dispatch) => {
  try {
    const response = await axios.get(`/api/data/users`);
    dispatch(getFollowers(response.data));
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchPhotos = () => async (dispatch) => {
  try {
    const response = await axios.get(`/api/data/gallery`);
    dispatch(getPhotos(response.data));
  } catch (err) {
    throw new Error(err);
  }
};

export default UserProfileSlice.reducer;
