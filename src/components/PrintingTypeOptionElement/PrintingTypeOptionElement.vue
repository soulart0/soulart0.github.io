<script setup>
import { defineModel } from 'vue'
import OptionElement from 'components/OptionElement/OptionElement.vue'
import ComboButtons from 'components/ComboButtons/ComboButtons.vue'
import { OPTIONS, PRINTING_TYPES } from '@/constants/options'

defineProps({
    number: {
        type: Number,
        required: true
    }
})

const printingType = defineModel()
</script>

<template>
    <OptionElement :class="bem({})" :number="number">
        <template #header>
            {{ $t(`general.select`) }} {{ $t(`calculator.options.${OPTIONS.PRINTING_TYPE.key}`) }}
        </template>

        <div :class="bem({ element: 'Container' })">
            <ComboButtons
                :options="Object.values(PRINTING_TYPES)"
                translationKey="calculator.printing-types"
                v-model="printingType"
            />
        </div>
    </OptionElement>
</template>
