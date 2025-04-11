<script setup>
import { onMounted, ref, defineModel } from 'vue'
import PrimaryButton from 'components/PrimaryButton/PrimaryButton.vue'

defineProps({
    options: {
        type: Array,
        required: true
    },
    translationKey: {
        type: String,
        required: true
    }
})

const wrapper = ref(null)
const option = defineModel()

const handleChange = (selectedOption) => {
    option.value = selectedOption
}

const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target) {
                    entry.target.classList.add('ComboButtons-Container_inView')
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
</script>

<template>
    <div ref="wrapper" :class="bem({ element: 'Container' })">
        <PrimaryButton
            v-for="(op, index) in options"
            :key="index"
            :combobox="true"
            :active="op === option"
            @click="handleChange(op)"
        >
            {{ $t(`${translationKey}.${op}`) }}
        </PrimaryButton>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './ComboButtons.style.scss';
</style>
