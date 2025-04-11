<script setup>
import PrimaryButton from 'components/PrimaryButton/PrimaryButton.vue'

import { useRouter } from 'vue-router'
import translation from '@/i18n/translation'

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
})

const router = useRouter()

const switchLanguage = async () => {
    const { locale } = props

    await translation.switchLanguage(locale)

    try {
        await router.replace({ params: { locale } })
    } catch (e) {
        router.push('/')
    }
}
</script>

<template>
    <PrimaryButton @click="switchLanguage" :inversedDir="true">
        {{ $t(`locale.${locale}.name`) }}
    </PrimaryButton>
</template>
