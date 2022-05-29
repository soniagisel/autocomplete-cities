// const debounce = (callback, delay) => {
//     let timer
//     return (...args) => {
//         clearTimeout(timer)
//         timer = setTimeout(() => callback.apply(this, ...args), delay)
//     }
// }

const debounce = (callback, wait) => {
    let timeout
    return (...args) => {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}

export default debounce
