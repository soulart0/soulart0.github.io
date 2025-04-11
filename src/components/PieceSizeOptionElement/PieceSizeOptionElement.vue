<script setup>
import { defineModel, ref, watch } from 'vue'
import OptionElement from 'components/OptionElement/OptionElement.vue'
import { DIMENSIONS } from '@/constants/app'
import { OPTIONS } from '@/constants/options'
import { validatePieceSize } from '@/utils/validation'

defineProps({
    number: {
        type: Number,
        required: true
    }
})

const pieceSize = defineModel()
const error = ref('')
const isUserInput = ref(false)

const validateDimension = (dimension, newValue, validateMin = false) => {
    if (!isUserInput.value && !validateMin) {
        return
    }

    const { value, error: err } = validatePieceSize(
        pieceSize.value,
        dimension,
        newValue,
        validateMin
    )

    pieceSize.value[dimension] = value
    if (!validateMin || err) error.value = err
    isUserInput.value = false
}

const validateDimensionOnBlur = (dimension) => {
    validateDimension(dimension, pieceSize.value[dimension], true)
}

watch(
    () => pieceSize.value.width,
    (newValue) => validateDimension(DIMENSIONS.WIDTH, newValue)
)
watch(
    () => pieceSize.value.height,
    (newValue) => validateDimension(DIMENSIONS.HEIGHT, newValue)
)
</script>

<template>
    <OptionElement :class="bem({})" :number="number" :error="error">
        <template #header>
            {{ $t(`general.enter`) }} {{ $t(`calculator.options.${OPTIONS.PIECE_SIZE.key}`) }}
        </template>

        <div :class="bem({ element: 'InputWrapper' })">
            <input
                :class="bem({ element: 'Input' })"
                type="number"
                v-model="pieceSize.width"
                @input="isUserInput = true"
                @blur="validateDimensionOnBlur(DIMENSIONS.WIDTH)"
            />
            <span :class="bem({ element: 'Label' })"> x </span>
            <input
                :class="bem({ element: 'Input' })"
                type="number"
                v-model="pieceSize.height"
                @input="isUserInput = true"
                @blur="validateDimensionOnBlur(DIMENSIONS.HEIGHT)"
            />
            <span :class="bem({ element: 'Label' })">
                {{ ' ' + $t(`units.cm`) }}
            </span>
        </div>
    </OptionElement>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './PieceSizeOptionElement.style.scss';
</style>
