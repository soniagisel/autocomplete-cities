import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Cities {
    _embedded: {
        'city:search-results': CityListItem[]
    }
}

interface CityListItem {
    matching_full_name: string
}

export const searchCitiesApi = createApi({
    reducerPath: 'searchCitiesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.teleport.org/api/cities/' }),
    endpoints: (builder) => ({
        getCitiesByName: builder.query<string[], string>({
            query: (city) => `?search=${city}`,
            transformResponse: (response: Cities) => {
                if (!response || !response._embedded) return []
                return response._embedded['city:search-results'].map((city: CityListItem) => city.matching_full_name)
            },
        }),
    }),
})

export const { useGetCitiesByNameQuery, useLazyGetCitiesByNameQuery } = searchCitiesApi
