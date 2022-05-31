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

export const dispatchSearchCity = async (inputVal) => await searchCities(inputVal)

export default cities
