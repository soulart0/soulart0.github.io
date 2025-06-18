<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    },
    combobox: {
        type: Boolean,
        default: false
    },
    inversedDir: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <button :class="bem({ mod: { active: active || !combobox, combobox, inversed: inversedDir } })">
        <slot></slot>
    </button>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './SecondaryButton.style.scss';
</style>
