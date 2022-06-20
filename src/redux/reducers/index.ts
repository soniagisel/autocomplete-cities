import { combineReducers } from 'redux'
import cities from './cities'
import { searchCitiesApi } from '../../api/citiesApi'

export default combineReducers({ cities, [searchCitiesApi.reducerPath]: searchCitiesApi.reducer })
