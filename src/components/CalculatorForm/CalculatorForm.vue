<script setup>
import { defineModel, ref, watch, computed } from 'vue'
import PieceSizeOptionElement from 'components/PieceSizeOptionElement/PieceSizeOptionElement.vue'
import PiecesAndQuartersNumberOptionElement from 'components/PiecesAndQuartersNumberOptionElement/PiecesAndQuartersNumberOptionElement.vue'
import SelectOptionElement from 'components/SelectOptionElement/SelectOptionElement.vue'
import { OPS } from '@/constants/operations'
import {
    OPTIONS,
    PAPER_TYPES,
    PRINTING_TYPES,
    CELLOPHANE_COATED_PAPER_TYPES,
    CUSTOMER_SUPPLIED_PAPER_TYPES,
    DEFAULT_OPTIONS,
    ONE_SIDED_ONLY_PAPER_TYPES
} from '@/constants/options'
import { calculateQuartersNumber, calculatePiecesNumber, calculatePrice } from '@/utils/calculator'

const props = defineProps({
    operation: {
        type: Object,
        required: true
    }
})

const options = defineModel('options')
const results = defineModel('results')
const isUserEnteredQuartersNumber = ref(false)
const isSyncUpdate = ref(false)

const visibleOptions = computed(() => {
    const ops = []

    ops.push('pieceSize', 'piecesAndQuarters')

    if (props.operation.ops[OPS.PRINTING]) {
        ops.push('paperType')

        if (!ONE_SIDED_ONLY_PAPER_TYPES.includes(options.value.PAPER_TYPE)) {
            ops.push('printingType')
        }

        ops.push('customerPaper', 'cellophaneCoatedPaper')
    }

    return ops
})

const optionNumbers = computed(() => {
    return visibleOptions.value.reduce((acc, key, index) => {
        acc[key] = index + 1

        return acc
    }, {})
})

watch(
    () => options.value.PAPER_TYPE,
    (newPapertype) => {
        if (ONE_SIDED_ONLY_PAPER_TYPES.includes(newPapertype)) {
            options.value.PRINTING_TYPE = PRINTING_TYPES.SINGLE_SIDED
        }
    }
)
watch(
    () => options.value,
    (newOptions) => {
        const { quarterCuttingPrice, quarterPrintingPrice, quarterTotalPrice, totalPrice } =
            calculatePrice(props.operation, newOptions, results.value.maxPiecesPerQuarter)

        results.value.quarterCuttingPrice = quarterCuttingPrice
        results.value.quarterPrintingPrice = quarterPrintingPrice
        results.value.quarterTotalPrice = quarterTotalPrice
        results.value.totalPrice = totalPrice
    },
    { deep: true, immediate: true }
)
watch(
    () => [
        options.value.PIECES_NUMBER,
        options.value.QUARTERS_NUMBER,
        options.value.PIECE_SIZE.width,
        options.value.PIECE_SIZE.height,
        options.value.PAPER_TYPE
    ],
    ([pieces, quarters, width, height, paperType], prevVals) => {
        if (isSyncUpdate.value) return

        // safe destructuring to avoid undefined values on initial mount
        const [
            prevPieces = 0,
            prevQuarters = 0,
            prevWidth = 0,
            prevHeight = 0,
            prevPaperType = DEFAULT_OPTIONS.PAPER_TYPE
        ] = prevVals || []

        const piecesChanged = pieces !== prevPieces
        const quartersChanged = quarters !== prevQuarters
        const pieceSizeChanged = width !== prevWidth || height !== prevHeight
        const paperTypeChanged = paperType !== prevPaperType

        if (
            (pieceSizeChanged || paperTypeChanged || piecesChanged) &&
            !isUserEnteredQuartersNumber.value
        ) {
            isSyncUpdate.value = true

            const {
                quartersNumber,
                maxPiecesPerQuarter: maxPieces,
                piecesPerRow: pPerRow,
                piecesPerColumn: pPerColumn
            } = calculateQuartersNumber({ width, height }, pieces, paperType)

            options.value.QUARTERS_NUMBER = quartersNumber
            results.value.maxPiecesPerQuarter = maxPieces
            results.value.piecesPerRow = pPerRow
            results.value.piecesPerColumn = pPerColumn

            isSyncUpdate.value = false
        }

        if (
            (pieceSizeChanged || paperTypeChanged || quartersChanged) &&
            isUserEnteredQuartersNumber.value
        ) {
            isSyncUpdate.value = true

            const {
                piecesNumber,
                maxPiecesPerQuarter: maxPieces,
                piecesPerRow: pPerRow,
                piecesPerColumn: pPerColumn
            } = calculatePiecesNumber({ width, height }, quarters, paperType)

            options.value.PIECES_NUMBER = piecesNumber
            results.value.maxPiecesPerQuarter = maxPieces
            results.value.piecesPerRow = pPerRow
            results.value.piecesPerColumn = pPerColumn

            isSyncUpdate.value = false
        }
    },
    { flush: 'sync', immediate: true }
)
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <PieceSizeOptionElement :number="optionNumbers.pieceSize" v-model="options.PIECE_SIZE" />
        <PiecesAndQuartersNumberOptionElement :number="optionNumbers.piecesAndQuarters"
            v-model:piecesNumber="options.PIECES_NUMBER" v-model:quartersNumber="options.QUARTERS_NUMBER"
            v-model:isUserEnteredQuartersNumber="isUserEnteredQuartersNumber" />
        <SelectOptionElement v-if="operation.ops[OPS.PRINTING]" :number="optionNumbers.paperType"
            :optionKey="OPTIONS.PAPER_TYPE.key" :types="PAPER_TYPES" v-model="options.PAPER_TYPE" />
        <SelectOptionElement v-if="
            operation.ops[OPS.PRINTING] &&
            !ONE_SIDED_ONLY_PAPER_TYPES.includes(options.PAPER_TYPE)
        " :number="optionNumbers.printingType" :optionKey="OPTIONS.PRINTING_TYPE.key" :types="PRINTING_TYPES"
            v-model="options.PRINTING_TYPE" />
        <SelectOptionElement v-if="operation.ops[OPS.PRINTING]" :number="optionNumbers.customerPaper"
            :optionKey="OPTIONS.CUSTOMER_SUPPLIED_PAPER.key" :types="CUSTOMER_SUPPLIED_PAPER_TYPES"
            v-model="options.CUSTOMER_SUPPLIED_PAPER" />
        <SelectOptionElement v-if="operation.ops[OPS.PRINTING]" :number="optionNumbers.cellophaneCoatedPaper"
            :optionKey="OPTIONS.CELLOPHANE_COATED_PAPER.key" :types="CELLOPHANE_COATED_PAPER_TYPES"
            v-model="options.CELLOPHANE_COATED_PAPER" />
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './CalculatorForm.style.scss';
</style>
