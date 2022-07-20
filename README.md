# Autocomplete Challenge

## Setup

Install dependencies

`npm i`

Run application

`npm start`

Run storybooks (optional)

`NODE_ENV=development npm run storybook`

## Challenge

### Task

Develop an autocomplete component that fetches data from an external API as a user types in an input field.

### Requirements

1. As the user types into the input field, the value should be sent to the [Teleport Cities API](https://developers.teleport.org/api/reference/#!/cities/searchCities) to retrieve a list of matching city names
2. Results from the API response should be stored in redux and finally displayed in a dropdown list underneath the input field
3. When a user selects an option from the dropdown list, it should populate the input field with it's value
4. A loading indicator should be displayed while data is being fetched
5. If no results are found with the search criteria, the message "No results found" should be displayed

#### Bonus

1. Handle API errors and display them to the user
2. Unit tests
3. Advanced styling
4. The component being as a story (Storybooks)

### Questions to answer

1. When designing this application from scratch, what are the things that come to mind when thinking on an autocomplete component?

### Considerations

1. Optimal rendering of React components
2. Use best practices and standards
3. Use any 3rd party libraries that you feel comfortable with
4. Feel free to use Google for syntax related questions
5. If at any point in time you believe there is a better way to do something, feel free to refactor the existing code

### Non-requirements

-   Refactoring of application framework including the use of `create-react-app`
