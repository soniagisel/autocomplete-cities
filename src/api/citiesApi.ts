import axios from 'axios'

export const searchCities = async (city: string) => {
    try {
        const response = await axios.get('https://api.teleport.org/api/cities/', {
            params: {
                search: city,
            },
        })

        return response.data._embedded['city:search-results'].map(
            (city: { matching_full_name: string }) => city.matching_full_name,
        )
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message)
        }

        return []
    }
}
