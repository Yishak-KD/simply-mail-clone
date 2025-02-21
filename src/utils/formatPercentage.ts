export const formatPercentage = (value: number) => {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)
}