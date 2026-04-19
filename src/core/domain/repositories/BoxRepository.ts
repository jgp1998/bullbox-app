import { Box } from "../models/Box";

export interface BoxRepository {
    getBoxById(id: string): Promise<Box | null>;
    getBoxBySlug(slug: string): Promise<Box | null>;
    createBox(box: Omit<Box, 'id' | 'createdAt'>): Promise<string>;
    updateBox(id: string, box: Partial<Box>): Promise<void>;
}
