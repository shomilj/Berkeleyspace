export const getPostState = store => store.posts;
export const getSelectedPostState = store => store.posts.selectedPost;

export const getPosts = store => {
  return getPostState(store)
}

export const getSelectedPost = store => {
  return getSelectedPostState(store)
}