import i18n from './index.js'

/**
 * Traverses the properties of an object to return the localized value
 *
 * @param object obj The object to search
 * @param string path The path in the object. Eg `a.b.c`
 * @returns
 */
function get(obj, path) {
    const parts = path.split('.')
    if (parts.length == 1) {
        return obj[parts[0]]
    }
    if (typeof obj[parts[0]] === 'undefined') {
        return null
    }
    return get(obj[parts[0]], parts.slice(1).join('.'))
}

const t = (lang, path, replacements = []) => {
    if (typeof i18n[lang] === 'undefined') {
        console.warn(
            '[VuetifyPlayer] No support for locale ' +
                lang +
                '. Falling back to en-US'
        )
        lang = 'en-US'
    }
    let localized = get(i18n[lang], path)

    // Could not localize this path. Return the path instead of null / undefined
    if (!localized) {
        localized = path
        console.warn(
            '[VuetifyPlayer] localization path ' + path + ' does not exist'
        )
    } else {
        // Apply replacements
        for (const key in replacements) {
            localized = localized.replaceAll('{' + key + '}', replacements[key])
        }
    }

    return localized
}

export { t }
