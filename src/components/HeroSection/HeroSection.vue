<script setup>
import BrandLogo from 'components/BrandLogo/BrandLogo.vue'
import ColorfulCircle from 'components/ColorfulCircle/ColorfulCircle.vue'
import LanguageButton from 'components/LanguageButton/LanguageButton.vue'
import ScrollDown from 'components/ScrollDown/ScrollDown.vue'

import translation from '@/i18n/translation'
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <div :class="bem({ element: 'Content' })">
            <div :class="bem({ element: 'LeftColumn' })">
                <span
                    :class="
                        bem({ element: 'Border', mod: { type: 'vertical', location: 'leftRight' } })
                    "
                ></span>
                <span
                    :class="
                        bem({ element: 'Border', mod: { type: 'vertical', location: 'leftLeft' } })
                    "
                ></span>
                <ColorfulCircle color="primary" location="topLeft" />
            </div>
            <div :class="bem({ element: 'RightColumn' })">
                <span
                    :class="
                        bem({
                            element: 'Border',
                            mod: { type: 'vertical', location: 'rightRight' }
                        })
                    "
                ></span>
                <span
                    :class="
                        bem({ element: 'Border', mod: { type: 'vertical', location: 'rightLeft' } })
                    "
                ></span>
                <span :class="bem({ element: 'RightColumnFarLeftBorder' })"></span>
                <ColorfulCircle color="primary" location="bottomRight" />
            </div>
            <div :class="bem({ element: 'UpperRow' })">
                <span
                    :class="
                        bem({ element: 'Border', mod: { type: 'horizontal', location: 'lower' } })
                    "
                ></span>
                <BrandLogo />
            </div>
            <div :class="bem({ element: 'LowerRow' })">
                <span
                    :class="
                        bem({ element: 'Border', mod: { type: 'horizontal', location: 'upper' } })
                    "
                ></span>
                <div :class="bem({ element: 'ScrollDown' })">
                    <ScrollDown />
                </div>
            </div>
            <div :class="bem({ element: 'CenterWrapper' })">
                <ColorfulCircle color="secondary" location="bottomLeft" />
                <ColorfulCircle color="secondary" location="topRight" />
                <h1 :class="bem({ element: 'Title' })">SOUL ART</h1>
                <h2 :class="bem({ element: 'SubTitle' })">
                    {{ $t('seo.description') }}
                </h2>

                <LanguageButton
                    :class="bem({ element: 'LanguageButton' })"
                    :locale="
                        translation.supportedLocales.find(
                            (locale) => locale !== translation.currentLocale
                        )
                    "
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './HeroSection.style.scss';
</style>
