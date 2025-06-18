import { OPS } from '@/constants/operations'
import { createI18n } from 'vue-i18n'
import { DIMENSIONS } from '@/constants/app'
import { OPTIONS, CELLOPHANE_COATED_PAPER_TYPES, CUT_TYPES, PAPER_TYPES } from '@/constants/options'

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

    orderElements.push(options.QUARTERS_NUMBER + ' ' + i18n.global.t('units.quarter'))
    orderElements.push(i18n.global.t('general.print'))
    orderElements.push(
        i18n.global.t(`calculator.types.${OPTIONS['PAPER_TYPE'].key}.${options['PAPER_TYPE']}`)
    )
    if (![PAPER_TYPES.PAPER_STICKER, PAPER_TYPES.PLASTIC_STICKER].includes(options['PAPER_TYPE'])) {
        orderElements.push(
            i18n.global.t(
                `calculator.types.${OPTIONS['PRINTING_TYPE'].key}.${options['PRINTING_TYPE']}`
            )
        )
    }

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

    orderElements.push('-')
    orderElements.push(`${options.BEND_LINES_NUMBER} ${i18n.global.t('units.bend-line')}`)

    if (operation.ops[OPS.CUTTING]) {
        orderElements.push('-')
        orderElements.push(
            `${options.PIECE_SIZE[DIMENSIONS.WIDTH]}x${
                options.PIECE_SIZE[DIMENSIONS.HEIGHT]
            }${i18n.global.t('units.cm')}`
        )
    }

    return orderElements.join(' ')
}
