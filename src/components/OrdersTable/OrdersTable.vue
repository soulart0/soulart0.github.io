<script setup>
import { ref, defineModel, onMounted, nextTick } from 'vue'
import { DEFAULT_OPERATION } from '@/constants/operations'
import { DEFAULT_OPTIONS, DEFAULT_RESULTS } from '@/constants/options'
import DangerButton from 'components/DangerButton/DangerButton.vue'
import SecondaryButton from 'components/SecondaryButton/SecondaryButton.vue'

const options = defineModel('options')
const operation = defineModel('operation')
const results = defineModel('results')
const orders = ref([])
const showCopyToast = ref(false)

const calculatorSection = ref(null)
const orderNameElement = ref(null)
const orderPriceElement = ref(null)

onMounted(() => {
    calculatorSection.value = document.querySelector('.CalculatorSection.CalculatorSection-Wrapper')
    orderNameElement.value = document.querySelector('.InvoicePreview .InvoicePreview-OrderName')
    orderPriceElement.value = document.querySelector(
        '.InvoicePreview.InvoicePreview-TotalRow td:nth-child(2)'
    )
})

const newOrder = () => {
    orders.value.push({
        name: orderNameElement.value.textContent,
        price: orderPriceElement.value.textContent
    })

    clearCurrentOrder()
    nextTick(() => scrollToTop())
}

const clearOrders = () => {
    orders.value = []

    clearCurrentOrder()
    nextTick(() => scrollToTop())
}

const clearCurrentOrder = () => {
    operation.value = DEFAULT_OPERATION
    options.value = DEFAULT_OPTIONS
    results.value = DEFAULT_RESULTS
}

const scrollToTop = () => {
    if (calculatorSection.value) {
        calculatorSection.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}

const copyOrderToClipboard = (index) => {
    navigator.clipboard.writeText(orders.value[index].name).then(() => {
        showCopyToast.value = true
        setTimeout(() => (showCopyToast.value = false), 2000)
    })
}
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <div :class="bem({ element: 'HeaderWrapper' })">
            <h3 :class="bem({ element: 'Header' })">
                {{ $t('orders-table.title') }}
            </h3>

            <div :class="bem({ element: 'Actions' })">
                <SecondaryButton @click="newOrder">
                    {{ $t('orders-table.actions.new-order') }}
                </SecondaryButton>
                <DangerButton @click="clearOrders">
                    {{ $t('orders-table.actions.clear-orders') }}
                </DangerButton>
            </div>
        </div>

        <table :class="bem({ element: 'Table' })">
            <thead>
                <tr :class="bem({ element: 'HeaderRow' })">
                    <th>{{ $t('orders-table.order.name') }}</th>
                    <th>{{ $t('orders-table.order.price') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in orders" :key="index" :class="bem({ element: 'Row' })">
                    <td @click="copyOrderToClipboard(index)" :class="bem({ element: 'OrderName' })">
                        {{ order.name }}
                    </td>
                    <td :class="bem({ element: 'OrderPrice' })">
                        {{ order.price }}
                    </td>
                </tr>
                <tr v-if="orders.length === 0" :class="bem({ element: 'EmptyRow' })">
                    <td colspan="2" :class="bem({ element: 'EmptyMessage' })">
                        {{ $t('orders-table.empty') }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Copy Toast -->
        <div :class="bem({ element: 'CopyToast', mod: { hidden: !showCopyToast } })">
            {{ $t('toast.order-copied') }}
        </div>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './OrdersTable.style.scss';
</style>
