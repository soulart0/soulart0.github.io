<script setup>
import { defineModel, ref, watch, computed } from 'vue'
import PieceSizeOptionElement from 'components/PieceSizeOptionElement/PieceSizeOptionElement.vue'
import PiecesAndQuartersNumberOptionElement from 'components/PiecesAndQuartersNumberOptionElement/PiecesAndQuartersNumberOptionElement.vue'
import NumberOptionElement from 'components/NumberOptionElement/NumberOptionElement.vue'

import SelectOptionElement from 'components/SelectOptionElement/SelectOptionElement.vue'
import { OPS } from '@/constants/operations'
import {
    OPTIONS,
    PAPER_TYPES,
    PRINTING_TYPES,
    CELLOPHANE_TYPES,
    CUT_TYPES,
    CELLOPHANE_COATED_PAPER_TYPES,
    CUSTOMER_SUPPLIED_PAPER_TYPES,
    DEFAULT_OPTIONS,
    ONE_SIDED_ONLY_PAPER_TYPES
} from '@/constants/options'
import { calculateQuartersNumber, calculatePiecesNumber, calculatePrice } from '@/utils/calculator'
import { DEFAULT_OPERATION } from '@/constants/operations'

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

        if (options.value.CELLOPHANE_COATED_PAPER !== CELLOPHANE_COATED_PAPER_TYPES.NONE) {
            ops.push('cellophaneType')
        }

        if (!props.operation.ops[OPS.CUTTING]) {
            ops.push('cut')
        }

        ops.push('bendLinesNumber')
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
        const {
            quarterCuttingPrice,
            quarterPrintingPrice,
            quarterTotalPrice,
            cuttingMachinePrice,
            totalPrice,
            bendingPrice
        } = calculatePrice(props.operation, newOptions, results.value.maxPiecesPerQuarter)

        results.value.quarterCuttingPrice = quarterCuttingPrice
        results.value.quarterPrintingPrice = quarterPrintingPrice
        results.value.quarterTotalPrice = quarterTotalPrice
        results.value.cuttingMachinePrice = cuttingMachinePrice
        results.value.totalPrice = totalPrice
        results.value.bendingPrice = bendingPrice
    },
    { deep: true, immediate: true }
)
watch(
    () => [
        options.value.PIECES_NUMBER,
        options.value.QUARTERS_NUMBER,
        options.value.PIECE_SIZE.width,
        options.value.PIECE_SIZE.height,
        options.value.PAPER_TYPE,
        props.operation.key
    ],
    ([pieces, quarters, width, height, paperType, operation], prevVals) => {
        if (isSyncUpdate.value) return

        // safe destructuring to avoid undefined values on initial mount
        const [
            prevPieces = 0,
            prevQuarters = 0,
            prevWidth = 0,
            prevHeight = 0,
            prevPaperType = DEFAULT_OPTIONS.PAPER_TYPE,
            prevOperation = DEFAULT_OPERATION
        ] = prevVals || []

        const piecesChanged = pieces !== prevPieces
        const quartersChanged = quarters !== prevQuarters
        const pieceSizeChanged = width !== prevWidth || height !== prevHeight
        const paperTypeChanged = paperType !== prevPaperType
        const operationChanged = operation !== prevOperation

        const requireReCaclulation = pieceSizeChanged || paperTypeChanged || operationChanged

        if ((requireReCaclulation || piecesChanged) && !isUserEnteredQuartersNumber.value) {
            isSyncUpdate.value = true

            const {
                quartersNumber,
                maxPiecesPerQuarter: maxPieces,
                piecesPerRow: pPerRow,
                piecesPerColumn: pPerColumn
            } = calculateQuartersNumber({ width, height }, pieces, paperType, props.operation.ops)

            options.value.QUARTERS_NUMBER = quartersNumber
            results.value.maxPiecesPerQuarter = maxPieces
            results.value.piecesPerRow = pPerRow
            results.value.piecesPerColumn = pPerColumn

            isSyncUpdate.value = false
        }

        if ((requireReCaclulation || quartersChanged) && isUserEnteredQuartersNumber.value) {
            isSyncUpdate.value = true

            const {
                piecesNumber,
                maxPiecesPerQuarter: maxPieces,
                piecesPerRow: pPerRow,
                piecesPerColumn: pPerColumn
            } = calculatePiecesNumber({ width, height }, quarters, paperType, props.operation.ops)

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
        <PiecesAndQuartersNumberOptionElement
            :number="optionNumbers.piecesAndQuarters"
            v-model:piecesNumber="options.PIECES_NUMBER"
            v-model:quartersNumber="options.QUARTERS_NUMBER"
            v-model:isUserEnteredQuartersNumber="isUserEnteredQuartersNumber"
        />
        <SelectOptionElement
            v-if="operation.ops[OPS.PRINTING]"
            :number="optionNumbers.paperType"
            :optionKey="OPTIONS.PAPER_TYPE.key"
            :types="PAPER_TYPES"
            v-model="options.PAPER_TYPE"
        />
        <SelectOptionElement
            v-if="
                operation.ops[OPS.PRINTING] &&
                !ONE_SIDED_ONLY_PAPER_TYPES.includes(options.PAPER_TYPE)
            "
            :number="optionNumbers.printingType"
            :optionKey="OPTIONS.PRINTING_TYPE.key"
            :types="PRINTING_TYPES"
            v-model="options.PRINTING_TYPE"
        />
        <SelectOptionElement
            v-if="operation.ops[OPS.PRINTING]"
            :number="optionNumbers.customerPaper"
            :optionKey="OPTIONS.CUSTOMER_SUPPLIED_PAPER.key"
            :types="CUSTOMER_SUPPLIED_PAPER_TYPES"
            v-model="options.CUSTOMER_SUPPLIED_PAPER"
        />
        <SelectOptionElement
            v-if="operation.ops[OPS.PRINTING]"
            :number="optionNumbers.cellophaneCoatedPaper"
            :optionKey="OPTIONS.CELLOPHANE_COATED_PAPER.key"
            :types="CELLOPHANE_COATED_PAPER_TYPES"
            v-model="options.CELLOPHANE_COATED_PAPER"
        />
        <SelectOptionElement
            v-if="
                operation.ops[OPS.PRINTING] &&
                options.CELLOPHANE_COATED_PAPER !== CELLOPHANE_COATED_PAPER_TYPES.NONE
            "
            :number="optionNumbers.cellophaneType"
            :optionKey="OPTIONS.CELLOPHANE_TYPE.key"
            :types="CELLOPHANE_TYPES"
            v-model="options.CELLOPHANE_TYPE"
        />
        <SelectOptionElement
            v-if="operation.ops[OPS.PRINTING] && !operation.ops[OPS.CUTTING]"
            :number="optionNumbers.cut"
            :optionKey="OPTIONS.CUT.key"
            :types="CUT_TYPES"
            v-model="options.CUT"
        />
        <NumberOptionElement
            :number="optionNumbers.bendLinesNumber"
            :optionKey="OPTIONS.BEND_LINES_NUMBER.key"
            unitKey="bend-line"
            v-model="options.BEND_LINES_NUMBER"
        />
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './CalculatorForm.style.scss';
</style>
