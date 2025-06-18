<script setup>
import { ref, defineModel, watch } from 'vue'
import OptionElement from 'components/OptionElement/OptionElement.vue'
import { validateNumber } from '@/utils/validation'
import { i18n } from '@/i18n'

const props = defineProps({
    number: {
        type: Number,
        required: true
    },
    optionKey: {
        type: String,
        required: true
    },
    unitKey: {
        type: String,
        required: true
    },
    minValue: {
        type: Number,
        default: 0
    }
})

const option = defineModel()
const error = ref('')
const isUserInput = ref(false)

const validate = (newValue, validateMin = false) => {
    if (!isUserInput.value && !validateMin) {
        return
    }

    const { value, error: err } = validateNumber(
        option.value,
        newValue,
        props.minValue,
        i18n.global.t(`errors.min-${props.optionKey}`, { value: props.minValue }),
        validateMin
    )

    if (!validateMin || err) error.value = err
    isUserInput.value = false

    return value
}

watch(
    () => option.value,
    (newValue) => {
        const value = validate(newValue)

        if (value) {
            option.value = value
        }
    }
)
</script>

<template>
    <OptionElement :class="bem({})" :number="number" :error="error">
        <template #header>
            {{ $t(`general.enter`) }} {{ $t(`calculator.options.${optionKey}`) }}
        </template>

        <div :class="bem({ element: 'Content' })">
            <div :class="bem({ element: 'InputWrapper' })">
                <input
                    :class="bem({ element: 'Input' })"
                    type="number"
                    v-model="option"
                    @input="isUserInput = true"
                    @blur="validate(option, true)"
                />
                <span :class="bem({ element: 'Label' })"> {{ ' ' + $t(`units.${unitKey}`) }} </span>
            </div>
        </div>
    </OptionElement>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './NumberOptionElement.style.scss';
</style>
