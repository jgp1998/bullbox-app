import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlateBreakdown from '@/src/shared/components/calculators/PlateBreakdown';
import type { User } from "@/src/features/auth/types";

// Mock context/i18n
vi.mock("@/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string, params?: any) => {
      if (key === "percentageCalculator.plateBreakdown") {
        return `Breakdown for ${params.weight}${params.unit}`;
      }
      if (key === "percentageCalculator.assumesBarbell") {
        return `Assumes ${params.weight}${params.unit} barbell`;
      }
      if (key === "percentageCalculator.lessThanBarbell") {
        return "Less than barbell";
      }
      return key;
    },
  }),
}));

describe("PlateBreakdown", () => {
  const mockUser: User = {
    uid: "test-uid",
    username: "testuser",
    gender: "Male",
    email: "test@test.com",
    dob: "1990-01-01",
  };

  it("renders the title with the correct weight and units", () => {
    render(
      <PlateBreakdown
        totalWeight={100}
        weightUnit="kg"
        plateUnit="kg"
        user={mockUser}
      />,
    );

    expect(screen.getByText("Breakdown for 100.0kg")).toBeInTheDocument();
    expect(screen.getByText("(kg plates)")).toBeInTheDocument();
    expect(screen.getByText("Assumes 20kg barbell")).toBeInTheDocument();
  });

  it("renders weight and bar labels correctly when assuming a female barbell weight", () => {
    const femaleUser = { ...mockUser, gender: "Female" as const };
    render(
      <PlateBreakdown
        totalWeight={50}
        weightUnit="kg"
        plateUnit="kg"
        user={femaleUser}
      />,
    );

    expect(screen.getByText("Assumes 15kg barbell")).toBeInTheDocument();
  });

  it("renders no plates if weight is less than the barbell weight", () => {
    render(
      <PlateBreakdown
        totalWeight={15}
        weightUnit="kg"
        plateUnit="kg"
        user={mockUser}
      />,
    );

    expect(screen.getByText("Less than barbell")).toBeInTheDocument();
  });

  it("renders plate counts when they are available", () => {
    // 100kg total with 20kg bar = 80kg total plates = 40kg per side.
    // 40kg per side = one 25kg red and one 15kg yellow.
    render(
      <PlateBreakdown
        totalWeight={100}
        weightUnit="kg"
        plateUnit="kg"
        user={mockUser}
      />,
    );

    expect(screen.getByText("1x 25 kg")).toBeInTheDocument();
    expect(screen.getByText("1x 15 kg")).toBeInTheDocument();
  });
});

