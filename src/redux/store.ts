import rootReducer from './reducers'
import { configureStore } from '@reduxjs/toolkit'
import { searchCitiesApi } from '../api/citiesApi'
import cities from '../redux/reducers/cities'

export const store = configureStore({
    reducer: {
        cities,
        [searchCitiesApi.reducerPath]: searchCitiesApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(searchCitiesApi.middleware),
})

export type RootState = ReturnType<typeof rootReducer>
