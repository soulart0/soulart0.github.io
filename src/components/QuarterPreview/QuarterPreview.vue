<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { DIMENSIONS } from '@/constants/app'
import { QUARTER_SIZE } from '@/constants/price'
import { MIN_PIECE_SIZE } from '@/constants/options'
import { getOppositeDimension } from '@/utils/validation'

const props = defineProps({
    piecesPerRow: {
        type: Number,
        required: true
    },
    piecesPerColumn: {
        type: Number,
        required: true
    },
    pieceSize: {
        type: Object,
        required: true
    },
    paperType: {
        type: String,
        required: true
    }
})

const quarter = ref(null)
const dimensionWidth = ref(0)
const quarterHeight = ref(0)
let observer

const getGridLineCount = (count, dimension, opposite = false) => {
    const multiplier =
        count * props.pieceSize[opposite ? getOppositeDimension(dimension) : dimension] <
        QUARTER_SIZE[props.paperType][dimension]
            ? 0
            : 1

    return Math.min(
        Math.max(0, count - 1 * multiplier),
        Math.floor(QUARTER_SIZE[props.paperType][DIMENSIONS.HEIGHT] / MIN_PIECE_SIZE)
    )
}

const calculateLinePosition = (base, index, dimension, opposite = false) => {
    return (
        (index / base) *
        ((base * props.pieceSize[opposite ? getOppositeDimension(dimension) : dimension]) /
            QUARTER_SIZE[props.paperType][dimension]) *
        100
    )
}

const getLines = (pieces, dimension, key) => {
    const count = getGridLineCount(pieces, dimension, isOpposite.value)

    return Array.from({ length: count }, (_, i) => ({
        key: `${key}-${i + 1}`,
        position: calculateLinePosition(pieces, i + 1, dimension, isOpposite.value),
        isLast: i + 1 === count && pieces === count
    }))
}

const isOpposite = computed(() => {
    if (
        props.piecesPerRow * props.pieceSize[DIMENSIONS.HEIGHT] ===
            QUARTER_SIZE[props.paperType][DIMENSIONS.WIDTH] &&
        props.piecesPerColumn * props.pieceSize[DIMENSIONS.WIDTH] ===
            QUARTER_SIZE[props.paperType][DIMENSIONS.HEIGHT]
    ) {
        return true
    }

    const verticalOverflow =
        calculateLinePosition(
            props.piecesPerRow,
            getGridLineCount(props.piecesPerRow, DIMENSIONS.WIDTH),
            DIMENSIONS.WIDTH
        ) > 100

    const horizontalOverflow =
        calculateLinePosition(
            props.piecesPerColumn,
            getGridLineCount(props.piecesPerColumn, DIMENSIONS.HEIGHT),
            DIMENSIONS.HEIGHT
        ) > 100

    return verticalOverflow || horizontalOverflow
})

const verticalLines = computed(() => {
    return getLines(props.piecesPerRow, DIMENSIONS.WIDTH, 'v')
})

const horizontalLines = computed(() => {
    return getLines(props.piecesPerColumn, DIMENSIONS.HEIGHT, 'h')
})

onMounted(() => {
    observer = new ResizeObserver(([entry]) => {
        dimensionWidth.value = entry.contentRect.width
        quarterHeight.value = entry.contentRect.height
    })

    if (quarter.value) {
        observer.observe(quarter.value)
    }
})

onBeforeUnmount(() => {
    if (observer && quarter.value) {
        observer.unobserve(quarter.value)
    }
})
</script>

<template>
    <div :class="bem({ element: 'Wrapper' })">
        <div
            :class="bem({ element: 'ContentWrapper' })"
            :style="{ '--quarter-height': `${quarterHeight}px` }"
        >
            <!-- Quarter with grid -->
            <div
                ref="quarter"
                :class="bem({ element: 'Quarter' })"
                :style="{
                    aspectRatio:
                        QUARTER_SIZE[props.paperType][DIMENSIONS.WIDTH] /
                        QUARTER_SIZE[props.paperType][DIMENSIONS.HEIGHT]
                }"
            >
                <!-- Vertical grid lines -->
                <div
                    v-for="{ key, isLast, position } in verticalLines"
                    :key="key"
                    :class="bem({ element: 'GridLine', mod: { vertical: true, last: isLast } })"
                    :style="{ left: `${position}%` }"
                ></div>

                <!-- Horizontal grid lines -->
                <div
                    v-for="{ key, isLast, position } in horizontalLines"
                    :key="key"
                    :class="bem({ element: 'GridLine', mod: { horizontal: true, last: isLast } })"
                    :style="{ top: `${position}%` }"
                ></div>

                <!-- Top right box size indicator -->
                <div
                    :class="bem({ element: 'BoxSize' })"
                    :style="{
                        top: `${(1 / piecesPerColumn) * 50}%`,
                        right: `${(1 / piecesPerRow) * 50}%`
                    }"
                >
                    <div :class="bem({ element: 'BoxSizeLabel' })">
                        <span :class="bem({ element: 'Text' })">
                            {{ pieceSize.width }}x{{ pieceSize.height }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Height dimension -->
            <div :class="bem({ element: 'Dimension', mod: { height: true } })">
                <div :class="bem({ element: 'DimensionLine' })">
                    <div :class="bem({ element: 'Arrow', mod: { top: true } })"></div>
                    <span :class="bem({ element: 'Text' })">
                        {{ QUARTER_SIZE[props.paperType][DIMENSIONS.HEIGHT] }} {{ $t('units.cm') }}
                    </span>
                    <div :class="bem({ element: 'Arrow', mod: { bottom: true } })"></div>
                </div>
            </div>
        </div>

        <!-- Width dimension -->
        <div
            :class="bem({ element: 'Dimension', mod: { width: true } })"
            :style="{ width: `${dimensionWidth}px` }"
        >
            <div :class="bem({ element: 'DimensionLine' })">
                <div :class="bem({ element: 'Arrow', mod: { left: true } })"></div>
                <span :class="bem({ element: 'Text' })">
                    {{ QUARTER_SIZE[props.paperType][DIMENSIONS.WIDTH] }} {{ $t('units.cm') }}
                </span>
                <div :class="bem({ element: 'Arrow', mod: { right: true } })"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/styles/_media.scss';
@import './QuarterPreview.style.scss';
</style>
