import { searchCities } from '../../api/citiesApi'

const initialState = {
    citiesList: [],
}

export const ACTION_TYPES = {
    SEARCH: 'SEARCH',
}

const cities = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SEARCH:
            return {
                ...state,
                citiesList: action.payload.citiesList,
            }
        default:
            return state
    }
}

export const dispatchSearchCity = async (inputVal) =>
    await searchCities(inputVal).then((data) =>
        data.data._embedded['city:search-results'].map((city) => city.matching_full_name),
    )

export default cities
