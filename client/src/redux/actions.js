import { UPDATE_SEARCH, SELECT_POST } from "./actionTypes";

export const updateSearch = filters => {
    return (dispatch) => {
        fetch('http://localhost:8080/query', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filters)})
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
    return (dispatch) => {
        fetch('http://localhost:8080/content', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({'id': id})})
        .then(data => data.json())
        .then(content => {
            dispatch({
                type: SELECT_POST,
                payload: {postContent: content}
            })
        })
    }
}