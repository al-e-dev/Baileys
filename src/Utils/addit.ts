

export const convertTimeOut = (ms: number) => {
    if (ms < 0) {
        throw new Error("Invalid time value. Milliseconds cannot be negative.")
    }

    const units = [
        // { label: "millennium", ms: 31536000000000 },
        // { label: "century", ms: 3153600000000 },
        // { label: "decade", ms: 315360000000 },
        { label: "year", ms: 31536000000 },
        { label: "month", ms: 2628000000 },
        { label: "week", ms: 604800000 },
        { label: "day", ms: 86400000 },
        { label: "hour", ms: 3600000 },
        { label: "minute", ms: 60000 },
        { label: "second", ms: 1000 }
        // { label: "millisecond", ms: 1 },
        // { label: "microsecond", ms: 0.001 },
        // { label: "nanosecond", ms: 0.000001 },
        // { label: "picosecond", ms: 0.000000001 },
        // { label: "femtosecond", ms: 0.000000000001 },
        // { label: "attosecond", ms: 0.000000000000001 },
        // { label: "zeptosecond", ms: 0.000000000000000001 },
        // { label: "yoctosecond", ms: 0.000000000000000000001 },
    ]

    const result: string[] = []

    for (const { label, ms: uni } of units) {
        const count = Math.floor(ms / uni)
        if (count > 0) {
            ms -= count * uni;
            result.push(`${count} ${label}${count !== 1 ? "s" : ""}`)
        }
    }

    return result.length > 0 ? result.join(", ") : "0 milliseconds"
}