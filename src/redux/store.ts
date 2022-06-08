import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

export type RootState = ReturnType<typeof rootReducer>

export default createStore(rootReducer, compose(applyMiddleware(thunk), composeWithDevTools()))
