import axios from 'axios'

export const searchCities = async (cities) =>
    await axios
        .get('https://api.teleport.org/api/cities/', {
            params: {
                search: cities,
            },
        })
        .catch((error) => {
            console.log(error.toJSON())
            return []
        })
