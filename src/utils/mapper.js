import { OPS } from '@/constants/operations'
import { createI18n } from 'vue-i18n'
import { OPTIONS, CELLOPHANE_COATED_PAPER_TYPES, CUT_TYPES } from '@/constants/options'

import ar from '../i18n/locales/ar.json'

const i18n = createI18n({
    locale: 'ar',
    fallbackLocale: 'ar',
    legacy: false,
    globalInjection: true,
    messages: { ar }
})

export const getOrderName = (operation, options) => {
    if (!operation.ops[OPS.PRINTING]) {
        return i18n.global.t('general.cut')
    }

    const orderElements = []

    orderElements.push(i18n.global.t('general.print'))
    orderElements.push(
        i18n.global.t(`calculator.types.${OPTIONS['PAPER_TYPE'].key}.${options['PAPER_TYPE']}`)
    )
    orderElements.push(
        i18n.global.t(
            `calculator.types.${OPTIONS['PRINTING_TYPE'].key}.${options['PRINTING_TYPE']}`
        )
    )

    if (options['CELLOPHANE_COATED_PAPER'] !== CELLOPHANE_COATED_PAPER_TYPES.NONE) {
        orderElements.push(i18n.global.t('general.cellophane'))
        orderElements.push(
            i18n.global.t(
                `calculator.types.${OPTIONS['CELLOPHANE_TYPE'].key}.${options['CELLOPHANE_TYPE']}`
            )
        )
        orderElements.push(
            i18n.global.t(
                `calculator.types.${OPTIONS['CELLOPHANE_COATED_PAPER'].key}.${options['CELLOPHANE_COATED_PAPER']}`
            )
        )
    }

    if (operation.ops[OPS.CUTTING]) {
        orderElements.push(i18n.global.t('general.cutter-plotter'))
    } else if (options['CUT'] === CUT_TYPES.YES) {
        orderElements.push(i18n.global.t('general.cut'))
    }

    return orderElements.join(' ')
}
