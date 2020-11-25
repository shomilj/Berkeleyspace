import { SELECT_POST, UPDATE_SEARCH } from "../actionTypes";

const initialState = {
  allPosts: [],
  selectedPost: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SEARCH: {
      const { newData } = action.payload;
      return {
        ...state,
        allPosts: newData
      };
    }
    case SELECT_POST: {
      const { postContent } = action.payload;
      return {
        ...state,
        selectedPost: postContent
      }
    }
    default:
      return state;
  }
}
