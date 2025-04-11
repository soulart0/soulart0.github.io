<script setup>
import { defineModel, ref, watch } from 'vue'
import { i18n } from '@/i18n'
import OptionElement from 'components/OptionElement/OptionElement.vue'
import PrimaryButton from 'components/PrimaryButton/PrimaryButton.vue'
import { OPS } from '@/constants/operations'
import { OPTIONS } from '@/constants/options'
import { MIN_PIECES_NUMBER, MIN_QUARTERS_NUMBER } from '@/constants/options'
import { validateNumber } from '@/utils/validation'

defineProps({
    number: {
        type: Number,
        required: true
    },
    operation: {
        type: Object,
        required: true
    }
})

const piecesNumber = defineModel('piecesNumber')
const quartersNumber = defineModel('quartersNumber')
const isUserEnteredQuartersNumber = defineModel('isUserEnteredQuartersNumber')
const error = ref('')
const isUserInput = ref(false)

const validate = (oldValue, newValue, minValue, errorKey, validateMin = false) => {
    if (!isUserInput.value && !validateMin) {
        return
    }

    const { value, error: err } = validateNumber(
        oldValue,
        newValue,
        minValue,
        i18n.global.t(`errors.${errorKey}`, { value: minValue }),
        validateMin
    )

    if (!validateMin || err) error.value = err
    isUserInput.value = false

    return value
}

const validatePiecesNumber = (newValue, validateMin = false) => {
    const value = validate(
        piecesNumber.value,
        newValue,
        MIN_PIECES_NUMBER,
        'min-pieces-number',
        validateMin
    )

    if (value) {
        piecesNumber.value = value
    }
}

const validateQuartersNumber = (newValue, validateMin = false) => {
    const value = validate(
        quartersNumber.value,
        newValue,
        MIN_QUARTERS_NUMBER,
        'min-quarters-number',
        validateMin
    )

    if (value) {
        quartersNumber.value = value
    }
}

watch(
    () => piecesNumber.value,
    (newValue) => validatePiecesNumber(newValue)
)
watch(
    () => quartersNumber.value,
    (newValue) => validateQuartersNumber(newValue)
)
</script>

<template>
    <OptionElement :class="bem({})" :number="number" :error="error">
        <template #header>
            {{ $t('general.enter') }}
            <span v-if="operation[OPS.CUTTING]">
                {{ $t(`calculator.options.${OPTIONS.PIECES_NUMBER.key}`) }} {{ $t('general.or') }}
                {{ $t(`calculator.options.${OPTIONS.QUARTERS_NUMBER.key}`) }}
            </span>
            <span v-else>
                {{ $t(`calculator.options.${OPTIONS.QUARTERS_NUMBER.key}`) }}
            </span>
        </template>

        <div :class="bem({ element: 'Content' })">
            <div
                :class="
                    bem({ element: 'InputWrapper', mod: { disabled: isUserEnteredQuartersNumber } })
                "
                v-if="operation[OPS.CUTTING]"
            >
                <input
                    :class="bem({ element: 'Input' })"
                    type="number"
                    v-model="piecesNumber"
                    @input="isUserInput = true"
                    @blur="validatePiecesNumber(piecesNumber, true)"
                    :disabled="isUserEnteredQuartersNumber"
                />
                <span :class="bem({ element: 'Label' })"> {{ ' ' + $t(`units.piece`) }} </span>
            </div>
            <PrimaryButton
                :class="bem({ element: 'Switch', mod: { rotate: isUserEnteredQuartersNumber } })"
                v-if="operation[OPS.CUTTING]"
                @click="isUserEnteredQuartersNumber = !isUserEnteredQuartersNumber"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M18 10L21 7M21 7L18 4M21 7H7M6 14L3 17M3 17L6 20M3 17H17"
                            stroke="#fff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </g>
                </svg>
            </PrimaryButton>
            <div
                :class="
                    bem({
                        element: 'InputWrapper',
                        mod: { disabled: !isUserEnteredQuartersNumber }
                    })
                "
            >
                <input
                    :class="bem({ element: 'Input' })"
                    type="number"
                    v-model="quartersNumber"
                    @input="isUserInput = true"
                    @blur="validateQuartersNumber(quartersNumber, true)"
                    :disabled="!isUserEnteredQuartersNumber"
                />
                <span :class="bem({ element: 'Label' })">
                    {{ ' ' + $t(`units.quarter`) }}
                </span>
            </div>
        </div>
    </OptionElement>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './PiecesAndQuartersNumberOptionElement.style.scss';
</style>
