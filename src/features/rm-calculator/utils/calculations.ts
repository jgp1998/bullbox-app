/**
 * Calculates 1RM (One Rep Max) using Epley Formula: 1RM = weight * (1 + reps/30)
 * For 1 rep, it returns just the weight.
 * 
 * @param weight - The weight lifted
 * @param reps - Number of repetitions performed
 * @returns The estimated one rep max
 */
export const calculate1RM = (weight?: number, reps?: number): number => {
    if (!weight) return 0;
    if (!reps || reps <= 1) return weight;
    return weight * (1 + (reps / 30));
};

/**
 * Calculates the percentage of a given max weight.
 * 
 * @param max - The reference weight (usually 1RM)
 * @param percentage - The percentage to calculate (e.g., 85 for 85%)
 * @returns The calculated percentage of the weight
 */
export const calculatePercentage = (max: number, percentage: number): number => {
    return (max * percentage) / 100;
};
