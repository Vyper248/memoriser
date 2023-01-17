export type Card = {
    id: string;
    question: string;
    answer: string;
    points?: number;
    lastChecked?: number;
    lastCheckingPeriod?: string;
}

export type Group = {
	id: string;
	name: string;
	cards: Card[];
}