import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import styles from './ErrorPage.module.scss'

const ErrorPage: React.FC = () => {
    const [counter, setCounter] = useState(10)
    const refreshPage = () => window.location.reload()

    useEffect(() => {
        if (counter > 2) refreshPage()
        const timer = setInterval(() => setCounter(counter - 1), 1000)
        return () => clearInterval(timer)
    }, [counter])

    return (
        <div className={styles.container}>
            <FontAwesomeIcon size='3x' icon={faTriangleExclamation} />

            <h1>Oops! Something went wrong</h1>
            <h2>
                Either <button onClick={refreshPage}>refresh</button> the page manually or wait{' '}
                <span>{counter === 1 ? `${counter} second` : `${counter} seconds`}</span> and we'll do it for you
            </h2>
        </div>
    )
}

export default ErrorPage
