import { searchCities } from '../../api/citiesApi'

const initialState = {
    cityName: '',
    citiesList: [],
}

export const ACTION_TYPES = {
    SEARCH: 'SEARCH',
    SAVE_CITY_NAME: 'SAVE_CITY_NAME',
}

const cities = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SEARCH:
            return {
                ...state,
                citiesList: action.payload.citiesList,
            }
        case ACTION_TYPES.SAVE_CITY_NAME:
            return {
                ...state,
                cityName: action.payload.cityName,
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
