import { i18n } from '@/i18n'
import { DIMENSIONS } from '@/constants/app'
import { MIN_PIECE_SIZE } from '@/constants/options'
import { QUARTER_SIZE } from '@/constants/price'

const getMaxDimension = (size) => {
    const { width, height } = size

    if (width > height) {
        return DIMENSIONS.WIDTH
    }

    return DIMENSIONS.HEIGHT
}

export const getOppositeDimension = (dimension) => {
    if (dimension === DIMENSIONS.WIDTH) {
        return DIMENSIONS.HEIGHT
    }

    return DIMENSIONS.WIDTH
}

export const MAX_QUARTER_DIMENSION = getMaxDimension(QUARTER_SIZE)
export const MIN_QUARTER_DIMENSION = getOppositeDimension(MAX_QUARTER_DIMENSION)

const getDimensionToCompareWith = (size, dimension) => {
    const oppositeDimension = getOppositeDimension(dimension)

    if (size[oppositeDimension] > QUARTER_SIZE[MIN_QUARTER_DIMENSION]) {
        return MIN_QUARTER_DIMENSION
    }

    return MAX_QUARTER_DIMENSION
}

export const validatePieceSize = (pieceSize, dimension, newValue, validateMin = false) => {
    const dimensionToCompareWith = getDimensionToCompareWith(pieceSize, dimension)

    if (newValue > QUARTER_SIZE[dimensionToCompareWith]) {
        return {
            value: QUARTER_SIZE[dimensionToCompareWith],
            error: i18n.global.t('errors.max-piece-size', {
                dimension: i18n.global.t(`general.${dimensionToCompareWith}`),
                value: QUARTER_SIZE[dimensionToCompareWith]
            })
        }
    }

    return validateNumber(
        pieceSize[dimension],
        newValue,
        MIN_PIECE_SIZE,
        i18n.global.t('errors.min-piece-size', {
            dimension: i18n.global.t(`general.${dimension}`),
            value: MIN_PIECE_SIZE
        }),
        validateMin,
        true
    )
}

export const validateNumber = (
    oldValue,
    newValue,
    minValue,
    minError,
    validateMin = false,
    isFloat = false
) => {
    if (newValue === '' && !validateMin) {
        return {
            value: newValue,
            error: ''
        }
    }

    const numberRegex = isFloat
        ? /^(\d+)?(\.\d*)?$/ // allow any number of decimal digits
        : /^\d+$/ // only integers

    if (!numberRegex.test(newValue)) {
        return {
            value: oldValue,
            error: i18n.global.t('errors.not-a-number')
        }
    }

    let parsedValue = isFloat ? parseFloat(newValue) : parseInt(newValue, 10)

    if (isNaN(parsedValue)) {
        return {
            value: oldValue,
            error: i18n.global.t('errors.not-a-number')
        }
    }

    // Truncate to 2 decimal places if float
    if (isFloat) {
        parsedValue = Math.floor(parsedValue * 100) / 100
    }

    if (validateMin && parsedValue < minValue) {
        return {
            value: minValue,
            error: minError
        }
    }

    return {
        value: parsedValue,
        error: ''
    }
}
