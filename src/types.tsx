export interface Card {
    id: string;
    groupId: string;
    question: string;
    answer: string;
    points?: number;
    lastChecked?: number;
    lastCheckingPeriod?: string;
}

export type Group = {
	id: string;
	name: string;
}

interface FilterObjectColor {
    type: 'color',
    color: 'red' | 'orange' | 'green'
}

interface FilterObjectPoints {
    type: 'points',
    points: number
}

interface FilterObjectNone {
    type: 'none'
}

export type FilterObject = FilterObjectColor | FilterObjectPoints | FilterObjectNone;