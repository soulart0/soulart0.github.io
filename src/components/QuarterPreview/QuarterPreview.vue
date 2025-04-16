<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { DIMENSIONS } from '@/constants/app'
import { QUARTER_SIZE } from '@/constants/price'
import { MIN_PIECE_SIZE } from '@/constants/options'
import { getOppositeDimension } from '@/utils/validation'
import { OPS } from '@/constants/operations'
import { PIECE_MARGIN } from '@/constants/price'

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
    },
    operations: {
        type: Object,
        required: true
    }
})

const quarter = ref(null)
const dimensionWidth = ref(0)
const quarterHeight = ref(0)
let observer

const getGridLineCount = (count, dimension, opposite = false) => {
    const multiplier =
        Number(
            (
                count *
                    (props.pieceSize[opposite ? getOppositeDimension(dimension) : dimension] +
                        margin.value) -
                margin.value
            ).toFixed(1)
        ) < QUARTER_SIZE[props.paperType][dimension]
            ? 0
            : 1

    return Math.min(
        Math.max(0, count - 1 * multiplier),
        Math.floor(QUARTER_SIZE[props.paperType][DIMENSIONS.HEIGHT] / MIN_PIECE_SIZE)
    )
}

const calculateLinePosition = (index, dimension, opposite = false) => {
    return (
        (100 *
            (index * props.pieceSize[opposite ? getOppositeDimension(dimension) : dimension] +
                (index - 1) * margin.value)) /
        QUARTER_SIZE[props.paperType][dimension]
    )
}

const calculateMarginLinePosition = (index, dimension, opposite = false) => {
    return (
        (100 *
            index *
            (props.pieceSize[opposite ? getOppositeDimension(dimension) : dimension] +
                margin.value)) /
        QUARTER_SIZE[props.paperType][dimension]
    )
}

const getLines = (pieces, dimension, key) => {
    const count = getGridLineCount(pieces, dimension, isOpposite.value)

    return Array.from({ length: count }, (_, i) => {
        const line = {
            key: `${key}-${i * 2 + 1}`,
            position: calculateLinePosition(i + 1, dimension, isOpposite.value),
            isLast: i + 1 === count && pieces === count
        }

        return props.operations[OPS.CUTTING] && i + 1 <= count && !line.isLast
            ? [
                  line,
                  {
                      key: `${key}-${i * 2 + 2}`,
                      position: calculateMarginLinePosition(i + 1, dimension, isOpposite.value),
                      isLast: false
                  }
              ]
            : line
    }).flat()
}

const margin = computed(() => {
    return props.operations[OPS.CUTTING] ? PIECE_MARGIN : 0
})

const isOpposite = computed(() => {
    const checkMaxSize = (pieces, pieceSize, dimension) => {
        return (
            Number((pieces * (pieceSize[dimension] + margin.value) - margin.value).toFixed(1)) >
            QUARTER_SIZE[props.paperType][dimension]
        )
    }

    return (
        checkMaxSize(props.piecesPerRow, props.pieceSize, DIMENSIONS.WIDTH) ||
        checkMaxSize(props.piecesPerColumn, props.pieceSize, DIMENSIONS.HEIGHT)
    )
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
