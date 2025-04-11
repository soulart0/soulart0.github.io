<script setup>
import { defineModel } from 'vue'
import OptionElement from 'components/OptionElement/OptionElement.vue'
import ComboButtons from 'components/ComboButtons/ComboButtons.vue'
import { BOOLEAN_OPTIONS } from '@/constants/options'

defineProps({
    number: {
        type: Number,
        required: true
    },
    optionKey: {
        type: String,
        required: true
    }
})

const customerSuppliedPaper = defineModel()
</script>

<template>
    <OptionElement :class="bem({})" :number="number">
        <template #header>
            {{ $t(`calculator.options.${optionKey}`) }}
        </template>

        <div :class="bem({ element: 'Container' })">
            <ComboButtons
                :options="Object.values(BOOLEAN_OPTIONS)"
                translationKey="calculator.boolean-options"
                v-model="customerSuppliedPaper"
            />
        </div>
    </OptionElement>
</template>
