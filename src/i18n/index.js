import { createI18n } from 'vue-i18n'

let i18n

export async function setupI18n() {
    const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE
    const fallbackLocale = import.meta.env.VITE_FALLBACK_LOCALE

    const messages = {
        [defaultLocale]: (await import(`./locales/${defaultLocale}.json`)).default
    }

    i18n = createI18n({
        locale: defaultLocale,
        fallbackLocale,
        legacy: false,
        globalInjection: true,
        messages
    })

    return i18n
}

export { i18n }
