<script setup>
import { DIMENSIONS } from '@/constants/app'
import { OPS } from '@/constants/operations'
import { OPTIONS } from '@/constants/options'
import { QUARTER_SIZE } from '@/constants/price'

defineProps({
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
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <h3 :class="bem({ element: 'Header' })">
            {{ $t('invoice.title') }}
        </h3>

        <table :class="bem({ element: 'InvoiceTable' })">
            <tbody>
                <tr>
                    <td>{{ $t('invoice.order-type') }}</td>
                    <td>{{ $t(`calculator.operations.${operation.key}`) }}</td>
                </tr>
                <tr>
                    <td>{{ $t('calculator.options.piece-size') }}</td>
                    <td>
                        {{ options.PIECE_SIZE[DIMENSIONS.WIDTH] }}x{{
                            options.PIECE_SIZE[DIMENSIONS.HEIGHT]
                        }}
                        {{ $t('units.cm') }}
                    </td>
                </tr>
                <tr>
                    <td>{{ $t('calculator.options.pieces-number') }}</td>
                    <td>
                        {{ results.maxPiecesPerQuarter * options.QUARTERS_NUMBER }}
                        {{ $t('units.piece') }}
                    </td>
                </tr>
                <tr>
                    <td>{{ $t('calculator.options.quarters-number') }}</td>
                    <td>{{ options.QUARTERS_NUMBER }} {{ $t('units.quarter') }}</td>
                </tr>
                <template v-if="operation.ops[OPS.PRINTING]">
                    <tr v-for="(option, index) in ['PAPER_TYPE', 'PRINTING_TYPE']" :key="index">
                        <td>{{ $t(`calculator.options.${OPTIONS[option].key}`) }}</td>
                        <td>
                            {{ $t(`calculator.types.${OPTIONS[option].key}.${options[option]}`) }}
                        </td>
                    </tr>
                    <tr
                        v-for="(option, index) in [
                            'CUSTOMER_SUPPLIED_PAPER',
                            'CELLOPHANE_COATED_PAPER'
                        ]"
                        :key="index"
                    >
                        <td>{{ $t(`invoice.${OPTIONS[option].key}`) }}</td>
                        <td>
                            {{ $t(`calculator.types.${OPTIONS[option].key}.${options[option]}`) }}
                        </td>
                    </tr>
                </template>
                <tr>
                    <td colspan="N"><br /></td>
                </tr>
                <tr>
                    <td>{{ $t('invoice.pieces-per-quarter') }}</td>
                    <td>
                        {{ results.maxPiecesPerQuarter }} {{ $t('units.piece') }} ({{
                            results.piecesPerRow
                        }}
                        {{ $t('units.piece') }} {{ $t('general.in-the-side') }} &lt;{{
                            QUARTER_SIZE[options.PAPER_TYPE][DIMENSIONS.WIDTH]
                        }}{{ $t('units.cm') }}&gt; {{ $t('general.and') }}
                        {{ results.piecesPerColumn }}
                        {{ $t('units.piece') }} {{ $t('general.in-the-side') }} &lt;{{
                            QUARTER_SIZE[options.PAPER_TYPE][DIMENSIONS.HEIGHT]
                        }}{{ $t('units.cm') }}&gt;)
                    </td>
                </tr>
                <tr>
                    <td colspan="N"><br /></td>
                </tr>
                <tr v-if="operation.ops[OPS.PRINTING]">
                    <td>{{ $t('invoice.price.quarter.printing') }}</td>
                    <td>{{ results.quarterPrintingPrice }} {{ $t('units.currency') }}</td>
                </tr>
                <tr v-if="operation.ops[OPS.CUTTING]">
                    <td>{{ $t('invoice.price.quarter.cutting') }}</td>
                    <td>{{ results.quarterCuttingPrice }} {{ $t('units.currency') }}</td>
                </tr>
                <tr v-if="operation.ops[OPS.PRINTING] && operation.ops[OPS.CUTTING]">
                    <td>{{ $t('invoice.price.quarter.total') }}</td>
                    <td>{{ results.quarterTotalPrice }} {{ $t('units.currency') }}</td>
                </tr>
                <tr>
                    <td colspan="N"><br /></td>
                </tr>
                <tr :class="bem({ element: 'TotalRow' })">
                    <td>{{ $t('invoice.price.total') }}</td>
                    <td>{{ results.totalPrice }} {{ $t('units.currency') }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './InvoicePreview.style.scss';
</style>
