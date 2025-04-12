import { DIMENSIONS } from '@/constants/app'
import { OPS } from '@/constants/operations'
import {
    CUSTOMER_SUPPLIED_PAPER_TYPES,
    PRINTING_TYPES,
    CELLOPHANE_COATED_PAPER_TYPES
} from '@/constants/options'
import { QUARTER_SIZE, PRINTING_PRICE, CUTTING_PRICE } from '@/constants/price'

const getOrientationDetails = (pieceSize, paperType) => {
    const { WIDTH, HEIGHT } = DIMENSIONS
    const { [WIDTH]: qWidth, [HEIGHT]: qHeight } = QUARTER_SIZE[paperType]
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

export const calculateQuartersNumber = (pieceSize, piecesNumber, paperType) => {
    const { maxPiecesPerQuarter, piecesPerRow, piecesPerColumn } = getOrientationDetails(
        pieceSize,
        paperType
    )

    return {
        quartersNumber: Math.ceil(piecesNumber / maxPiecesPerQuarter),
        maxPiecesPerQuarter,
        piecesPerRow,
        piecesPerColumn
    }
}

export const calculatePiecesNumber = (pieceSize, quartersNumber, paperType) => {
    const { maxPiecesPerQuarter, piecesPerRow, piecesPerColumn } = getOrientationDetails(
        pieceSize,
        paperType
    )

    return {
        piecesNumber: maxPiecesPerQuarter * quartersNumber,
        maxPiecesPerQuarter,
        piecesPerRow,
        piecesPerColumn
    }
}

const calculateCellophanePrice = (options) => {
    const { CELLOPHANE_COATED_PAPER } = options

    switch (CELLOPHANE_COATED_PAPER) {
        case CELLOPHANE_COATED_PAPER_TYPES.SINGLE_SIDED:
            return PRINTING_PRICE.CELLOPHANE_COATED_PAPER
        case CELLOPHANE_COATED_PAPER_TYPES.DOUBLE_SIDED:
            return PRINTING_PRICE.CELLOPHANE_COATED_PAPER * 2
        default:
            return 0
    }
}

const calculatePrintingPrice = (options) => {
    const { PAPER_TYPE, PRINTING_TYPE, CUSTOMER_SUPPLIED_PAPER, QUARTERS_NUMBER } = options

    let price = calculateCellophanePrice(options)

    if (CUSTOMER_SUPPLIED_PAPER === CUSTOMER_SUPPLIED_PAPER_TYPES.YES) {
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
