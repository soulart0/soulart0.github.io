<script setup>
import { createI18n } from 'vue-i18n'
import PrimaryButton from 'components/PrimaryButton/PrimaryButton.vue'
import { DIMENSIONS, WHATSAPP_NUMBER } from '@/constants/app'
import { OPS } from '@/constants/operations'
import { QUARTER_SIZE } from '@/constants/price'
import { getOrderName } from '@/utils/mapper'

import ar from '../../i18n/locales/ar.json'

const i18n = createI18n({
    locale: 'ar',
    fallbackLocale: 'ar',
    legacy: false,
    globalInjection: true,
    messages: { ar }
})

const props = defineProps({
    operation: {
        type: Object,
        required: true
    },
    options: {
        type: Object,
        required: true
    },
    results: {
        type: Object,
        required: true
    }
})

const sendOrderViaWhatsApp = () => {
    // Construct message body
    let message = `*${i18n.global.t('invoice.title')}*\n\n`

    // Order Name
    message += `• ${i18n.global.t('invoice.order')}: ${getOrderName(
        props.operation,
        props.options
    )}\n`

    // Order Type
    message += `• ${i18n.global.t('invoice.order-type')}: ${i18n.global.t(
        `calculator.operations.${props.operation.key}`
    )}\n`

    // Common details
    message += `• ${i18n.global.t('calculator.options.piece-size')}: ${
        props.options.PIECE_SIZE[DIMENSIONS.WIDTH]
    }x${props.options.PIECE_SIZE[DIMENSIONS.HEIGHT]}${i18n.global.t('units.cm')}\n`
    message += `• ${i18n.global.t('calculator.options.bend-lines-number')}: ${
        props.options.BEND_LINES_NUMBER
    } ${i18n.global.t('units.bend-lines')}\n`

    message += `• ${i18n.global.t('calculator.options.pieces-number')}: ${
        props.results.maxPiecesPerQuarter * props.options.QUARTERS_NUMBER
    } ${i18n.global.t('units.piece')}\n`
    message += `• ${i18n.global.t('calculator.options.quarters-number')}: ${
        props.options.QUARTERS_NUMBER
    } ${i18n.global.t('units.quarter')}\n`

    // Printing-related details
    if (props.operation.ops[OPS.PRINTING]) {
        message += `• ${i18n.global.t('calculator.options.paper-type')}: ${i18n.global.t(
            `calculator.types.paper-type.${props.options.PAPER_TYPE}`
        )}\n`
        message += `• ${i18n.global.t('calculator.options.printing-type')}: ${i18n.global.t(
            `calculator.types.printing-type.${props.options.PRINTING_TYPE}`
        )}\n`
        message += `• ${i18n.global.t('invoice.customer-supplied-paper')}: ${i18n.global.t(
            `calculator.types.customer-supplied-paper.${props.options.CUSTOMER_SUPPLIED_PAPER}`
        )}\n`
        message += `• ${i18n.global.t('invoice.cellophane-coated-paper')}: ${i18n.global.t(
            `calculator.types.cellophane-coated-paper.${props.options.CELLOPHANE_COATED_PAPER}`
        )} ${i18n.global.t(`calculator.types.cellophane-type.${props.options.CELLOPHANE_TYPE}`)}\n`
    }

    message += `\n• ${i18n.global.t('invoice.pieces-per-quarter')}:\n  - ${
        props.results.maxPiecesPerQuarter
    } ${i18n.global.t('units.piece')}\n  - ${props.results.piecesPerRow} ${i18n.global.t(
        'units.piece'
    )} ${i18n.global.t('general.in-the-side')} <${
        QUARTER_SIZE[props.options.PAPER_TYPE][DIMENSIONS.WIDTH]
    }${i18n.global.t('units.cm')}>\n  - ${props.results.piecesPerColumn} ${i18n.global.t(
        'units.piece'
    )} ${i18n.global.t('general.in-the-side')} <${
        QUARTER_SIZE[props.options.PAPER_TYPE][DIMENSIONS.HEIGHT]
    }${i18n.global.t('units.cm')}>\n`

    // Pricing details
    message += `\n*${i18n.global.t('invoice.price.details')}*\n`
    if (props.operation.ops[OPS.PRINTING]) {
        message += `• ${i18n.global.t('invoice.price.quarter.printing')}: ${
            props.results.quarterPrintingPrice
        } ${i18n.global.t('units.currency')}\n`
    }
    if (props.operation.ops[OPS.CUTTING]) {
        message += `• ${i18n.global.t('invoice.price.quarter.cutting')}: ${
            props.results.quarterCuttingPrice
        } ${i18n.global.t('units.currency')}\n`
    }
    if (props.operation.ops[OPS.PRINTING] && props.operation.ops[OPS.CUTTING]) {
        message += `• ${i18n.global.t('invoice.price.quarter.total')}: ${
            props.results.quarterTotalPrice
        } ${i18n.global.t('units.currency')}\n`
    }
    if (props.operation.ops[OPS.PRINTING] && !props.operation.ops[OPS.CUTTING]) {
        message += `• ${i18n.global.t('invoice.price.cut.total')}: ${
            props.results.cuttingMachinePrice
        } ${i18n.global.t('units.currency')}\n`
    }
    if (props.results.bendingPrice > 0) {
        message += `• ${i18n.global.t('invoice.price.bend-lines.total')}: ${
            props.results.bendingPrice
        } ${i18n.global.t('units.currency')}\n`
    }

    // Total price
    message += `\n*${i18n.global.t('invoice.price.total')}:* ${
        props.results.totalPrice
    } ${i18n.global.t('units.currency')}`

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
}
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <PrimaryButton :class="bem({ element: 'Button' })" @click="sendOrderViaWhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <!-- WhatsApp SVG path here -->
                <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
            </svg>
            {{ $t('send-order-via-whatsapp') }}
        </PrimaryButton>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './SendOrder.style.scss';
</style>
