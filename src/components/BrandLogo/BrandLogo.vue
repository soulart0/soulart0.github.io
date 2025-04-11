<script setup>
// eslint-disable-next-line no-unused-vars
const unusedVariableCreatedToEnableTheBemMixin = false
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <svg
            :class="bem({ element: 'Logo' })"
            width="200"
            height="200"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="white"
            stroke-width="8"
        >
            <!-- Long right horizontal line (upper) -->
            <line x1="100" y1="130" x2="280" y2="130" />

            <!-- Upper half-circle (curve on left, top half) -->
            <path d="M100 130 A55 55 0 0 1 100 10" />

            <!-- Short right line on top -->
            <line x1="100" y1="10" x2="145" y2="10" />

            <!-- Long left horizontal line (lower) -->
            <line x1="100" y1="70" x2="-80" y2="70" />

            <!-- Lower half-circle (curve on right, mirrored) -->
            <path d="M100 70 A55 55 0 0 1 100 190" />

            <!-- Short left line on bottom -->
            <line x1="100" y1="190" x2="70" y2="190" />
        </svg>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './BrandLogo.style.scss';
</style>
