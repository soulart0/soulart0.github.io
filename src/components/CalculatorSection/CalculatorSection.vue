<script setup>
import { ref } from 'vue'
import CalculatorForm from 'components/CalculatorForm/CalculatorForm.vue'
import InvoicePreview from 'components/InvoicePreview/InvoicePreview.vue'
import OperationSelector from 'components/OperationSelector/OperationSelector.vue'
import QuarterPreview from 'components/QuarterPreview/QuarterPreview.vue'
import SendOrder from 'components/SendOrder/SendOrder.vue'
import OrdersTable from 'components/OrdersTable/OrdersTable.vue'

import { DEFAULT_OPERATION } from '@/constants/operations'
import { DEFAULT_OPTIONS, DEFAULT_RESULTS } from '@/constants/options'

const operation = ref(DEFAULT_OPERATION)
const options = ref(DEFAULT_OPTIONS)
const results = ref(DEFAULT_RESULTS)
</script>

<template>
    <div>
        <div :class="bem({ element: 'Wrapper' })">
            <OperationSelector v-model="operation" />
        </div>
        <div :class="bem({ element: 'Wrapper' })">
            <CalculatorForm
                v-model:options="options"
                v-model:results="results"
                :operation="operation"
            />
        </div>
        <div :class="bem({ element: 'Wrapper', mod: { double: true } })">
            <InvoicePreview :results="results" :operation="operation" :options="options" />
            <QuarterPreview
                :piecesPerRow="results.piecesPerRow"
                :piecesPerColumn="results.piecesPerColumn"
                :pieceSize="options.PIECE_SIZE"
                :paperType="options.PAPER_TYPE"
                :operations="operation.ops"
            />
        </div>
        <SendOrder :results="results" :operation="operation" :options="options" />
        <OrdersTable
            v-model:operation="operation"
            v-model:options="options"
            v-model:results="results"
        />
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './CalculatorSection.style.scss';
</style>
