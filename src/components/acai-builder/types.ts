export interface AcaiSize {
    id: string;
    label: string;
    price: number;
}

export interface AcaiBase {
    id: string;
    label: string;
    description: string;
}

export interface Complement {
    id: string;
    label: string;
    category: 'fruit' | 'mousse' | 'crunch' | 'other';
}

export interface Location {
    lat?: number;
    lng?: number;
    address?: string;
    isManual?: boolean;
}

export interface CupOrder {
    size: AcaiSize | null;
    base: AcaiBase | null;
    complements: Complement[];
    notes?: string;
}
