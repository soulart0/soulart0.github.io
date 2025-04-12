import { DIMENSIONS } from '@/constants/app'

export const MIN_PIECE_SIZE = 2
export const MIN_PIECES_NUMBER = 1
export const MIN_QUARTERS_NUMBER = 1

export const PRINTING_TYPES = {
    SINGLE_SIDED: 'single-sided',
    DOUBLE_SIDED: 'double-sided'
}

export const PAPER_TYPES = {
    COUCHE_350G: 'couche-350g',
    COUCHE_150_250G: 'couche-150-250g',
    STICKER: 'sticker'
}

export const CUSTOMER_SUPPLIED_PAPER_TYPES = {
    YES: 'yes',
    NO: 'no'
}

export const CELLOPHANE_COATED_PAPER_TYPES = {
    SINGLE_SIDED: 'single-sided',
    DOUBLE_SIDED: 'double-sided',
    NONE: 'none'
}

export const OPTIONS = {
    PIECE_SIZE: {
        key: 'piece-size',
        default: {
            [DIMENSIONS.WIDTH]: 3,
            [DIMENSIONS.HEIGHT]: 4
        }
    },
    PIECES_NUMBER: {
        key: 'pieces-number',
        default: MIN_PIECES_NUMBER
    },
    QUARTERS_NUMBER: {
        key: 'quarters-number',
        default: 0
    },
    PAPER_TYPE: {
        key: 'paper-type',
        default: PAPER_TYPES.COUCHE_150_250G
    },
    PRINTING_TYPE: {
        key: 'printing-type',
        default: PRINTING_TYPES.SINGLE_SIDED
    },
    CUSTOMER_SUPPLIED_PAPER: {
        key: 'customer-supplied-paper',
        default: CUSTOMER_SUPPLIED_PAPER_TYPES.NO
    },
    CELLOPHANE_COATED_PAPER: {
        key: 'cellophane-coated-paper',
        default: CELLOPHANE_COATED_PAPER_TYPES.NONE
    }
}

export const DEFAULT_OPTIONS = Object.fromEntries(
    Object.entries(OPTIONS).map(([key, value]) => [key, value.default])
)
