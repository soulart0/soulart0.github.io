<script setup>
defineProps({
    number: {
        type: Number,
        required: true
    },
    error: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <h3 :class="bem({ element: 'Header' })">{{ number }} . <slot name="header"></slot></h3>

        <div :class="bem({ element: 'Content' })">
            <slot></slot>

            <span :class="bem({ element: 'Error' })">
                {{ error }}
            </span>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './OptionElement.style.scss';
</style>
