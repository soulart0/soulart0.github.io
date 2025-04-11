<script setup>
import { defineModel } from 'vue'
import OptionElement from 'components/OptionElement/OptionElement.vue'
import ComboButtons from 'components/ComboButtons/ComboButtons.vue'
import { OPTIONS, PAPER_TYPES } from '@/constants/options'

defineProps({
    number: {
        type: Number,
        required: true
    }
})

const paperType = defineModel()
</script>

<template>
    <OptionElement :class="bem({})" :number="number">
        <template #header>
            {{ $t(`general.select`) }} {{ $t(`calculator.options.${OPTIONS.PAPER_TYPE.key}`) }}
        </template>

        <div :class="bem({ element: 'Container' })">
            <ComboButtons
                :options="Object.values(PAPER_TYPES)"
                translationKey="calculator.paper-types"
                v-model="paperType"
            />
        </div>
    </OptionElement>
</template>
