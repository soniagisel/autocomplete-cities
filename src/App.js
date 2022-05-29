import './App.scss'
import AutoComplete from './AutoComplete'

function App() {
    return (
        <div className='app'>
            <div className='wrapper'>
                <h1>Welcome to the Cities Finder</h1>
                <h2>Start typing and we'll find the city you're looking for!</h2>

                <div>
                    <AutoComplete />
                </div>
            </div>
        </div>
    )
}

export default App
