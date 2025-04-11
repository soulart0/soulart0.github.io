<script setup>
import { onMounted, ref, defineModel, watch } from 'vue'
import ComboButtons from 'components/ComboButtons/ComboButtons.vue'
import { OPERATIONS } from '@/constants/operations'

const wrapper = ref(null)
const operation = defineModel()
const op = ref(operation.value.key)

const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const header = entry.target.querySelector('.OperationSelector-Header')

                if (header) {
                    header.classList.add('OperationSelector-Header_inView')
                }

                observer.unobserve(entry.target) // To Trigger only once
            }
        })
    },
    {
        threshold: 0.5 // Trigger when 50% of the wrapper on the view port
    }
)

onMounted(() => observer.observe(wrapper.value))

watch(
    () => op.value,
    (newValue) => {
        operation.value = Object.values(OPERATIONS).find((op) => op.key === newValue)
    }
)
</script>

<template>
    <div ref="wrapper" :class="bem({ element: 'Wrapper' })">
        <span :class="bem({ element: 'Header' })">
            {{ $t('calculator.choose-an-operation') }}
        </span>
        <ComboButtons
            :options="Object.values(OPERATIONS).map((op) => op.key)"
            translationKey="calculator.operations"
            v-model="op"
        />
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './OperationSelector.style.scss';
</style>
