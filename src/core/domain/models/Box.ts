export interface Box {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    config: BoxConfig;
    createdAt: Date;
}

export interface BoxConfig {
    timezone: string;
    currency: string;
    features: {
        leaderboardEnabled: boolean;
        paymentIntegrationEnabled: boolean;
    };
}
