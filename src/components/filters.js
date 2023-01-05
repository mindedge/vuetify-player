/**
 * Converts a number of seconds to a short duration format. Eg hh:mm:ss
 *
 * @param Integer seconds
 *
 * @param String The duration in "hh:mm:ss" format
 */
const playerShortDuration = function (secondsParam) {
    let ret = '--:--:--'

    if (!isNaN(secondsParam) && secondsParam !== null) {
        ret = ''
        let seconds = parseInt(secondsParam, 10)

        const hour = Math.floor(seconds / 60 / 60)
        seconds = seconds - hour * 60 * 60 // Subtract it from seconds

        const minute = Math.floor(seconds / 60)
        seconds = Math.floor(seconds - minute * 60) // Subtract it from seconds

        if (hour > 0) {
            ret += String(hour).padStart(2, '0') + ':'
        }

        ret += String(minute).padStart(2, '0') + ':'
        ret += String(seconds).padStart(2, '0')
    }
    return ret
}

export default { playerShortDuration }
