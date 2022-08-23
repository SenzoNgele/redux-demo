const redux = require('redux')
const createStore = redux.legacy_createStore
const applyMiddleware = redux.applyMiddleware
const thunkMiddleware = require('redux-thunk').default
const axios = require('axios')

const initialState = {
  loading: false,
  users: [],
  error: ''
}

const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST'
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
const FETCH_USERS_FAILER = 'FETCH_USERS_FAILER'

const fetchUsersRequest = () => {
  return ( {
    type: FETCH_USERS_REQUEST
  } );
}

const fetchUsersSuccess = users => {
  return ( {
    type: FETCH_USERS_SUCCESS,
    payload: users
  } );
}

const fetchUsersFailer = error => {
  return ( {
    type: FETCH_USERS_FAILER,
    payload: error
  } );
}
 
const reducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true
      }

    case FETCH_USERS_SUCCESS:
      return {
       loading: false,
       users: action.payload,
       error: ''
      }

    case FETCH_USERS_FAILER:
      return {
        loading: false,
        users: [],
        error: action.payload
      }
  }
}

const fetchUsers = () => {
  return function(dispatch) {
    dispatch(fetchUsersRequest())
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        const users = response.data.map(user => user.id)
        dispatch(fetchUsersSuccess(users))
      })
      .catch(error => {
        dispatch(fetchUsersFailer(error.message))
      })
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware))
store.subscribe(() => { console.log(store.getState())})
store.dispatch(fetchUsers())