<script setup>
import { defineModel, ref, watch, computed } from 'vue'
import PieceSizeOptionElement from 'components/PieceSizeOptionElement/PieceSizeOptionElement.vue'
import PiecesAndQuartersNumberOptionElement from 'components/PiecesAndQuartersNumberOptionElement/PiecesAndQuartersNumberOptionElement.vue'
import PaperTypeOptionElement from 'components/PaperTypeOptionElement/PaperTypeOptionElement.vue'
import PrintingTypeOptionElement from 'components/PrintingTypeOptionElement/PrintingTypeOptionElement.vue'
import BooleanOptionElement from 'components/BooleanOptionElement/BooleanOptionElement.vue'
import { OPERATIONS, OPS } from '@/constants/operations'
import { OPTIONS } from '@/constants/options'
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
    const options = []

    if (props.operation.ops[OPS.CUTTING]) {
        options.push('pieceSize')
    }

    options.push('piecesAndQuarters')

    if (props.operation.ops[OPS.PRINTING]) {
        options.push('paperType', 'printingType', 'customerPaper', 'cellophaneCoatedPaper')
    }

    return options
})

const optionNumbers = computed(() => {
    return visibleOptions.value.reduce((acc, key, index) => {
        acc[key] = index + 1

        return acc
    }, {})
})

watch(
    () => props.operation,
    (value) => {
        if (value.key === OPERATIONS.PRINTING_ONLY.key) {
            isUserEnteredQuartersNumber.value = true
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
        options.value.PIECE_SIZE.height
    ],
    ([pieces, quarters, width, height], prevVals) => {
        if (isSyncUpdate.value) return

        // safe destructuring to avoid undefined values on initial mount
        const [prevPieces = 0, prevQuarters = 0, prevWidth = 0, prevHeight = 0] = prevVals || []

        const piecesChanged = pieces !== prevPieces
        const quartersChanged = quarters !== prevQuarters
        const pieceSizeChanged = width !== prevWidth || height !== prevHeight

        if ((pieceSizeChanged || piecesChanged) && !isUserEnteredQuartersNumber.value) {
            isSyncUpdate.value = true

            const {
                quartersNumber,
                maxPiecesPerQuarter: maxPieces,
                piecesPerRow: pPerRow,
                piecesPerColumn: pPerColumn
            } = calculateQuartersNumber({ width, height }, pieces)

            options.value.QUARTERS_NUMBER = quartersNumber
            results.value.maxPiecesPerQuarter = maxPieces
            results.value.piecesPerRow = pPerRow
            results.value.piecesPerColumn = pPerColumn

            isSyncUpdate.value = false
        }

        if ((pieceSizeChanged || quartersChanged) && isUserEnteredQuartersNumber.value) {
            isSyncUpdate.value = true

            const {
                piecesNumber,
                maxPiecesPerQuarter: maxPieces,
                piecesPerRow: pPerRow,
                piecesPerColumn: pPerColumn
            } = calculatePiecesNumber({ width, height }, quarters)

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
        <PieceSizeOptionElement
            v-if="operation.ops[OPS.CUTTING]"
            :number="optionNumbers.pieceSize"
            v-model="options.PIECE_SIZE"
        />
        <PiecesAndQuartersNumberOptionElement
            :number="optionNumbers.piecesAndQuarters"
            :operation="operation.ops"
            v-model:piecesNumber="options.PIECES_NUMBER"
            v-model:quartersNumber="options.QUARTERS_NUMBER"
            v-model:isUserEnteredQuartersNumber="isUserEnteredQuartersNumber"
        />
        <PaperTypeOptionElement
            v-if="operation.ops[OPS.PRINTING]"
            :number="optionNumbers.paperType"
            v-model="options.PAPER_TYPE"
        />
        <PrintingTypeOptionElement
            v-if="operation.ops[OPS.PRINTING]"
            :number="optionNumbers.printingType"
            v-model="options.PRINTING_TYPE"
        />
        <BooleanOptionElement
            v-if="operation.ops[OPS.PRINTING]"
            :number="optionNumbers.customerPaper"
            :optionKey="OPTIONS.CUSTOMER_SUPPLIED_PAPER.key"
            v-model="options.CUSTOMER_SUPPLIED_PAPER"
        />
        <BooleanOptionElement
            v-if="operation.ops[OPS.PRINTING]"
            :number="optionNumbers.cellophaneCoatedPaper"
            :optionKey="OPTIONS.CELLOPHANE_COATED_PAPER.key"
            v-model="options.CELLOPHANE_COATED_PAPER"
        />
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './CalculatorForm.style.scss';
</style>
