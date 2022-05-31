import axios from 'axios'

export const searchCities = async (cities) => {
    try {
        const response = await axios.get('https://api.teleport.org/api/cities/', {
            params: {
                search: cities,
            },
        })
        return response.data._embedded['city:search-results'].map((city) => city.matching_full_name)
    } catch (e) {
        console.log(e.toJSON())
        return []
    }
}
