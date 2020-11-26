import { UPDATE_SEARCH, SELECT_POST } from "./actionTypes";

export const updateSearch = filters => {
    const base = window.location.hostname === 'localhost' ? 'http://localhost:8080/' : '/'
    return (dispatch) => {
        fetch(base + 'query', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filters)})
        .then(data => data.json())
        .then(data => {
            dispatch({
                type: UPDATE_SEARCH,
                payload: {newData: data}
            })
        })
    }
}

export const selectPost = id => {
    const base = window.location.hostname === 'localhost' ? 'http://localhost:8080/' : '/'
    return (dispatch) => {
        fetch(base + 'content', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({'id': id})})
        .then(data => data.json())
        .then(content => {
            dispatch({
                type: SELECT_POST,
                payload: {postContent: content}
            })
        })
    }
}