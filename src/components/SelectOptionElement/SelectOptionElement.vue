<script setup>
import { defineModel } from 'vue'
import OptionElement from 'components/OptionElement/OptionElement.vue'
import ComboButtons from 'components/ComboButtons/ComboButtons.vue'

defineProps({
    number: {
        type: Number,
        required: true
    },
    optionKey: {
        type: String,
        required: true
    },
    types: {
        type: Object,
        required: true
    }
})

const option = defineModel()
</script>

<template>
    <OptionElement :class="bem({})" :number="number">
        <template #header>
            {{ $t(`general.select`) }} {{ $t(`calculator.options.${optionKey}`) }}
        </template>

        <div :class="bem({ element: 'Container' })">
            <ComboButtons
                :options="Object.values(types)"
                :translationKey="'calculator.types.' + optionKey"
                v-model="option"
            />
        </div>
    </OptionElement>
</template>
