const debounce = <F extends (...args: any[]) => any>(callback: F, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<F>) => {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}

export default debounce
