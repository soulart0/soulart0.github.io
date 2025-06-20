import { DIMENSIONS } from '@/constants/app'
import { PAPER_TYPES, PRINTING_TYPES } from '@/constants/options'

export const PIECE_MARGIN = 0.2

export const CUTTING_MACHINE_PRICE = 40

export const NUM_OF_QUARTERS_FOR_CUTTING_MACHINE_PRICE = 50

export const BENDING_LINE_PRICE = 0.5

export const QUARTER_SIZE = {
    [PAPER_TYPES.COUCHE_350G]: {
        [DIMENSIONS.HEIGHT]: 46, // Write here the highest value
        [DIMENSIONS.WIDTH]: 31
    },
    [PAPER_TYPES.COUCHE_150_250G]: {
        [DIMENSIONS.HEIGHT]: 46, // Write here the highest value
        [DIMENSIONS.WIDTH]: 31
    },
    [PAPER_TYPES.PAPER_STICKER]: {
        [DIMENSIONS.HEIGHT]: 44, // Write here the highest value
        [DIMENSIONS.WIDTH]: 30
    },
    [PAPER_TYPES.PLASTIC_STICKER]: {
        [DIMENSIONS.HEIGHT]: 44, // Write here the highest value
        [DIMENSIONS.WIDTH]: 30
    }
}

export const PRINTING_PRICE = {
    CUSTOMER_SUPPLIED_PAPER: 5,
    CELLOPHANE_COATED_PAPER: 1,
    TIERS: {
        [PAPER_TYPES.COUCHE_350G]: {
            [PRINTING_TYPES.SINGLE_SIDED]: [
                {
                    MIN: 1,
                    MAX: 100,
                    PRICE: 12
                },
                {
                    MIN: 101,
                    MAX: Infinity,
                    PRICE: 8.5
                }
            ],
            [PRINTING_TYPES.DOUBLE_SIDED]: [
                {
                    MIN: 1,
                    MAX: 100,
                    PRICE: 17
                },
                {
                    MIN: 101,
                    MAX: Infinity,
                    PRICE: 13.5
                }
            ]
        },
        [PAPER_TYPES.COUCHE_150_250G]: {
            [PRINTING_TYPES.SINGLE_SIDED]: [
                {
                    MIN: 1,
                    MAX: 100,
                    PRICE: 8
                },
                {
                    MIN: 101,
                    MAX: Infinity,
                    PRICE: 6.5
                }
            ],
            [PRINTING_TYPES.DOUBLE_SIDED]: [
                {
                    MIN: 1,
                    MAX: 100,
                    PRICE: 13
                },
                {
                    MIN: 101,
                    MAX: Infinity,
                    PRICE: 11.5
                }
            ]
        },
        [PAPER_TYPES.PAPER_STICKER]: {
            [PRINTING_TYPES.SINGLE_SIDED]: [
                {
                    MIN: 1,
                    MAX: 100,
                    PRICE: 14
                },
                {
                    MIN: 101,
                    MAX: Infinity,
                    PRICE: 10
                }
            ]
        },
        [PAPER_TYPES.PLASTIC_STICKER]: {
            [PRINTING_TYPES.SINGLE_SIDED]: [
                {
                    MIN: 1,
                    MAX: 100,
                    PRICE: 25
                },
                {
                    MIN: 101,
                    MAX: Infinity,
                    PRICE: 20
                }
            ]
        }
    }
}

export const CUTTING_PRICE = [
    {
        MIN: 1,
        MAX: 4,
        TIERS: [
            {
                MIN: 1,
                MAX: 25,
                PRICE: 10
            },
            {
                MIN: 26,
                MAX: 100,
                PRICE: 8
            },
            {
                MIN: 101,
                MAX: Infinity,
                PRICE: 6.5
            }
        ]
    },
    {
        MIN: 5,
        MAX: 50,
        TIERS: [
            {
                MIN: 1,
                MAX: 25,
                PRICE: 20
            },
            {
                MIN: 26,
                MAX: 100,
                PRICE: 15
            },
            {
                MIN: 101,
                MAX: Infinity,
                PRICE: 10
            }
        ]
    },
    {
        MIN: 51,
        MAX: Infinity,
        TIERS: [
            {
                MIN: 1,
                MAX: 25,
                PRICE: 35
            },
            {
                MIN: 26,
                MAX: 100,
                PRICE: 30
            },
            {
                MIN: 101,
                MAX: Infinity,
                PRICE: 25
            }
        ]
    }
]
