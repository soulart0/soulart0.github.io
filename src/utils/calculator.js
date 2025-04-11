import { DIMENSIONS } from '@/constants/app'
import { OPS } from '@/constants/operations'
import { BOOLEAN_OPTIONS, PRINTING_TYPES } from '@/constants/options'
import { QUARTER_SIZE, PRINTING_PRICE, CUTTING_PRICE } from '@/constants/price'

const getOrientationDetails = (pieceSize) => {
    const { WIDTH, HEIGHT } = DIMENSIONS
    const { [WIDTH]: qWidth, [HEIGHT]: qHeight } = QUARTER_SIZE
    const { [WIDTH]: pWidth, [HEIGHT]: pHeight } = pieceSize

    const calculateOrientation = (pieceW, pieceH) => {
        const piecesPerRow = Math.floor(qWidth / pieceW)
        const piecesPerColumn = Math.floor(qHeight / pieceH)

        return {
            piecesPerRow,
            piecesPerColumn,
            maxPiecesPerQuarter: piecesPerRow * piecesPerColumn
        }
    }

    const original = calculateOrientation(pWidth, pHeight)
    const rotated = calculateOrientation(pHeight, pWidth)

    if (original.maxPiecesPerQuarter >= rotated.maxPiecesPerQuarter) {
        return original
    }

    return rotated
}

export const calculateQuartersNumber = (pieceSize, piecesNumber) => {
    const { maxPiecesPerQuarter, piecesPerRow, piecesPerColumn } = getOrientationDetails(pieceSize)

    return {
        quartersNumber: Math.ceil(piecesNumber / maxPiecesPerQuarter),
        maxPiecesPerQuarter,
        piecesPerRow,
        piecesPerColumn
    }
}

export const calculatePiecesNumber = (pieceSize, quartersNumber) => {
    const { maxPiecesPerQuarter, piecesPerRow, piecesPerColumn } = getOrientationDetails(pieceSize)

    return {
        piecesNumber: maxPiecesPerQuarter * quartersNumber,
        maxPiecesPerQuarter,
        piecesPerRow,
        piecesPerColumn
    }
}

const calculatePrintingPrice = (options) => {
    const {
        PAPER_TYPE,
        PRINTING_TYPE,
        CUSTOMER_SUPPLIED_PAPER,
        CELLOPHANE_COATED_PAPER,
        QUARTERS_NUMBER
    } = options

    let price = 0

    if (CELLOPHANE_COATED_PAPER === BOOLEAN_OPTIONS.YES) {
        price += PRINTING_PRICE.CELLOPHANE_COATED_PAPER
    }

    if (CUSTOMER_SUPPLIED_PAPER === BOOLEAN_OPTIONS.YES) {
        return (
            price +
            PRINTING_PRICE.CUSTOMER_SUPPLIED_PAPER *
                (PRINTING_TYPE == PRINTING_TYPES.SINGLE_SIDED ? 1 : 2)
        )
    }

    const tiers = PRINTING_PRICE.TIERS?.[PAPER_TYPE]?.[PRINTING_TYPE]

    if (!tiers) return price // Fallback if config is missing

    const tier = tiers.find(({ MIN, MAX }) => {
        const min = MIN ?? 0
        const max = MAX ?? Infinity

        return QUARTERS_NUMBER >= min && QUARTERS_NUMBER <= max
    })

    if (!tier) return price // Fallback if no matching tier

    return price + tier.PRICE
}

const calculateCuttingPrice = (options, maxPiecesPerQuarter) => {
    const { QUARTERS_NUMBER } = options

    const cuttingTierGroup = CUTTING_PRICE.find(({ MIN, MAX }) => {
        const min = MIN ?? 0
        const max = MAX ?? Infinity

        return maxPiecesPerQuarter >= min && maxPiecesPerQuarter <= max
    })

    if (!cuttingTierGroup) return 0

    const priceTier = cuttingTierGroup.TIERS.find(({ MIN, MAX }) => {
        const min = MIN ?? 0
        const max = MAX ?? Infinity

        return QUARTERS_NUMBER >= min && QUARTERS_NUMBER <= max
    })

    return priceTier?.PRICE ?? 0
}

export const calculatePrice = (operation, options, maxPiecesPerQuarter) => {
    const { QUARTERS_NUMBER } = options

    const quarterPrintingPrice = operation.ops[OPS.PRINTING] ? calculatePrintingPrice(options) : 0
    const quarterCuttingPrice = operation.ops[OPS.CUTTING]
        ? calculateCuttingPrice(options, maxPiecesPerQuarter)
        : 0
    const quarterTotalPrice = quarterCuttingPrice + quarterPrintingPrice

    return {
        quarterCuttingPrice,
        quarterPrintingPrice,
        quarterTotalPrice,
        totalPrice: quarterTotalPrice * QUARTERS_NUMBER
    }
}
