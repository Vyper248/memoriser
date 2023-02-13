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