export const OPS = {
    CUTTING: 'cutting',
    PRINTING: 'printing'
}

export const OPERATIONS = {
    PRINTING_AND_CUTTING: {
        key: 'printing-and-cutting',
        ops: {
            [OPS.CUTTING]: true,
            [OPS.PRINTING]: true
        }
    },
    CUTTING_ONLY: {
        key: 'cutting-only',
        ops: {
            [OPS.CUTTING]: true,
            [OPS.PRINTING]: false
        }
    },
    PRINTING_ONLY: {
        key: 'printing-only',
        ops: {
            [OPS.CUTTING]: false,
            [OPS.PRINTING]: true
        }
    }
}

export const DEFAULT_OPERATION = OPERATIONS.PRINTING_AND_CUTTING
