const mocks = {
    window: {},
    app: {},
    i18n: { local: 'en-US', locales: [], messages: {} },
    $t: (msg) => msg,
    $tc: (msg, num) => msg + ' ' + num,
}

// Copy some things around
mocks.i18n.t = mocks.$t
mocks.i18n.tc = mocks.$tc

export const defaultMocks = mocks
