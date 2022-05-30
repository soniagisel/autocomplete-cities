import styles from './App.module.scss'
import AutoComplete from './AutoComplete'

function App() {
    return (
        <div className={styles.app}>
            <div className={styles.wrapper}>
                <h1>Welcome to the Cities Finder</h1>
                <h2>Start typing and we'll help you find the city you're looking for!</h2>

                <AutoComplete />
            </div>
        </div>
    )
}

export default App
