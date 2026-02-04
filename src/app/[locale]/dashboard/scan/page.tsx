"use client";

import { useState } from "react";
import {
  Search,
  ScanLine,
  Stamp,
  Star,
  Users,
  Gift,
  Check,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, Card, Badge, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

interface CustomerCard {
  cardId: string;
  customerId: string;
  customerName: string | null;
  customerEmail: string | null;
  serialNumber: string;
  currentStamps: number;
  currentPoints: number;
  totalRewardsRedeemed: number;
  programId: string;
  programName: string;
  programType: string;
  rewardThreshold: number;
  rewardDescription: string;
  designConfig: {
    primaryColor: string;
    secondaryColor: string;
    iconStyle: string;
  } | null;
}

const iconStyles: Record<string, string> = {
  coffee: "☕",
  food: "🍔",
  beauty: "💅",
  fitness: "💪",
  shopping: "🛍️",
  star: "⭐",
};

export default function ScanPage() {
  const t = useTranslations("Dashboard.scan");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customerCard, setCustomerCard] = useState<CustomerCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState(1);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setError(null);
    setCustomerCard(null);
    setSuccessMessage(null);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t("errors.notAuthenticated"));
      setIsSearching(false);
      return;
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!business) {
      setError(t("errors.businessNotFound"));
      setIsSearching(false);
      return;
    }

    // First try to search by serial number
    let card = null;

    const { data: cardBySerial } = await supabase
      .from("loyalty_cards")
      .select(
        `
        id,
        serial_number,
        current_stamps,
        current_points,
        total_rewards_redeemed,
        customer:customers!inner (
          id,
          name,
          email,
          business_id
        ),
        program:loyalty_programs!inner (
          id,
          name,
          type,
          reward_threshold,
          reward_description,
          design_config,
          business_id
        )
      `,
      )
      .ilike("serial_number", `%${searchTerm}%`)
      .limit(1);

    if (cardBySerial && cardBySerial.length > 0) {
      card = cardBySerial[0];
    } else {
      // If not found by serial, search by customer email
      const { data: customerByEmail } = await supabase
        .from("customers")
        .select("id")
        .eq("business_id", business.id)
        .ilike("email", `%${searchTerm}%`)
        .limit(1);

      if (customerByEmail && customerByEmail.length > 0) {
        const { data: cardByCustomer } = await supabase
          .from("loyalty_cards")
          .select(
            `
            id,
            serial_number,
            current_stamps,
            current_points,
            total_rewards_redeemed,
            customer:customers!inner (
              id,
              name,
              email,
              business_id
            ),
            program:loyalty_programs!inner (
              id,
              name,
              type,
              reward_threshold,
              reward_description,
              design_config,
              business_id
            )
          `,
          )
          .eq("customer_id", customerByEmail[0].id)
          .limit(1);

        if (cardByCustomer && cardByCustomer.length > 0) {
          card = cardByCustomer[0];
        }
      }
    }

    if (!card) {
      setError(t("errors.notFound"));
      setIsSearching(false);
      return;
    }
    const customer = card.customer as unknown as {
      id: string;
      name: string | null;
      email: string | null;
      business_id: string;
    };
    const program = card.program as unknown as {
      id: string;
      name: string;
      type: string;
      reward_threshold: number;
      reward_description: string;
      design_config: {
        primaryColor: string;
        secondaryColor: string;
        iconStyle: string;
      } | null;
      business_id: string;
    };

    // Verify the card belongs to this business
    if (
      customer.business_id !== business.id ||
      program.business_id !== business.id
    ) {
      setError(t("errors.notFound"));
      setIsSearching(false);
      return;
    }

    setCustomerCard({
      cardId: card.id,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      serialNumber: card.serial_number,
      currentStamps: card.current_stamps || 0,
      currentPoints: card.current_points || 0,
      totalRewardsRedeemed: card.total_rewards_redeemed || 0,
      programId: program.id,
      programName: program.name,
      programType: program.type,
      rewardThreshold: program.reward_threshold,
      rewardDescription: program.reward_description,
      designConfig: program.design_config,
    });

    setIsSearching(false);
  };

  const handleAddStamp = async () => {
    if (!customerCard) return;

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    const supabase = createClient();

    const isPoints = customerCard.programType === "points";
    const amountToAdd = isPoints ? pointsToAdd : 1;
    const newValue = isPoints
      ? customerCard.currentPoints + amountToAdd
      : customerCard.currentStamps + 1;

    // Update the card
    const updateData = isPoints
      ? { current_points: newValue }
      : { current_stamps: newValue };

    const { error: updateError } = await supabase
      .from("loyalty_cards")
      .update(updateData)
      .eq("id", customerCard.cardId);

    if (updateError) {
      setError(t("errors.updateError"));
      setIsProcessing(false);
      return;
    }

    // Record transaction
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (business) {
      await supabase.from("transactions").insert({
        business_id: business.id,
        customer_id: customerCard.customerId,
        loyalty_card_id: customerCard.cardId,
        type: isPoints ? "points_added" : "stamp_added",
        points_change: isPoints ? amountToAdd : 0,
        stamps_change: isPoints ? 0 : 1,
        description: isPoints
          ? t("transaction.pointsAdded", { amount: amountToAdd })
          : t("transaction.stampAdded"),
      });

      // Record analytics event
      await supabase.from("analytics_events").insert({
        business_id: business.id,
        customer_id: customerCard.customerId,
        event_type: isPoints ? "points_added" : "stamp_added",
        metadata: { amount: amountToAdd, card_id: customerCard.cardId },
      });
    }

    // Update local state
    setCustomerCard({
      ...customerCard,
      currentStamps: isPoints ? customerCard.currentStamps : newValue,
      currentPoints: isPoints ? newValue : customerCard.currentPoints,
    });

    setSuccessMessage(
      isPoints
        ? t("success.pointsAdded", { amount: amountToAdd })
        : t("success.stampAdded"),
    );
    setIsProcessing(false);
  };

  const handleRedeemReward = async () => {
    if (!customerCard) return;

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    const supabase = createClient();

    const isPoints = customerCard.programType === "points";
    const currentValue = isPoints
      ? customerCard.currentPoints
      : customerCard.currentStamps;

    if (currentValue < customerCard.rewardThreshold) {
      setError(t("errors.notEnough"));
      setIsProcessing(false);
      return;
    }

    const newValue = currentValue - customerCard.rewardThreshold;
    const updateData = isPoints
      ? {
          current_points: newValue,
          total_rewards_redeemed: customerCard.totalRewardsRedeemed + 1,
        }
      : {
          current_stamps: newValue,
          total_rewards_redeemed: customerCard.totalRewardsRedeemed + 1,
        };

    const { error: updateError } = await supabase
      .from("loyalty_cards")
      .update(updateData)
      .eq("id", customerCard.cardId);

    if (updateError) {
      setError(t("errors.updateError"));
      setIsProcessing(false);
      return;
    }

    // Record transaction
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (business) {
      await supabase.from("transactions").insert({
        business_id: business.id,
        customer_id: customerCard.customerId,
        loyalty_card_id: customerCard.cardId,
        type: "reward_redeemed",
        points_change: isPoints ? -customerCard.rewardThreshold : 0,
        stamps_change: isPoints ? 0 : -customerCard.rewardThreshold,
        description: t("transaction.rewardRedeemed", {
          reward: customerCard.rewardDescription,
        }),
      });

      await supabase.from("analytics_events").insert({
        business_id: business.id,
        customer_id: customerCard.customerId,
        event_type: "reward_redeemed",
        metadata: {
          reward: customerCard.rewardDescription,
          card_id: customerCard.cardId,
        },
      });
    }

    // Update local state
    setCustomerCard({
      ...customerCard,
      currentStamps: isPoints ? customerCard.currentStamps : newValue,
      currentPoints: isPoints ? newValue : customerCard.currentPoints,
      totalRewardsRedeemed: customerCard.totalRewardsRedeemed + 1,
    });

    setSuccessMessage(t("success.rewardRedeemed"));
    setIsProcessing(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCustomerCard(null);
    setError(null);
    setSuccessMessage(null);
    setPointsToAdd(1);
  };

  const currentProgress = customerCard
    ? customerCard.programType === "points"
      ? customerCard.currentPoints
      : customerCard.currentStamps
    : 0;

  const canRedeem =
    customerCard && currentProgress >= customerCard.rewardThreshold;

  const progressPercent = customerCard
    ? Math.min((currentProgress / customerCard.rewardThreshold) * 100, 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Search Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ScanLine className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-almost-black">
            {t("searchTitle")}
          </h2>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
          >
            {isSearching ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              t("search")
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}
      </Card>

      {/* Customer Card Display */}
      {customerCard && (
        <Card className="overflow-hidden">
          {/* Card Preview */}
          <div className="p-6 bg-gray-50 flex justify-center">
            <div
              className="w-full max-w-[320px] rounded-2xl shadow-xl p-6"
              style={{
                backgroundColor:
                  customerCard.designConfig?.primaryColor || "#3b82f6",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p
                    className="text-sm opacity-80"
                    style={{
                      color:
                        customerCard.designConfig?.secondaryColor || "#FFFFFF",
                    }}
                  >
                    {customerCard.programName}
                  </p>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      color:
                        customerCard.designConfig?.secondaryColor || "#FFFFFF",
                    }}
                  >
                    {customerCard.customerName || customerCard.customerEmail}
                  </h3>
                </div>
                <span className="text-3xl">
                  {iconStyles[customerCard.designConfig?.iconStyle || "star"] ||
                    "⭐"}
                </span>
              </div>

              {/* Progress Display */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span
                    style={{
                      color:
                        customerCard.designConfig?.secondaryColor || "#FFFFFF",
                    }}
                  >
                    {t("progress")}
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color:
                        customerCard.designConfig?.secondaryColor || "#FFFFFF",
                    }}
                  >
                    {currentProgress} / {customerCard.rewardThreshold}
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: `${customerCard.designConfig?.secondaryColor || "#FFFFFF"}30`,
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor:
                        customerCard.designConfig?.secondaryColor || "#FFFFFF",
                    }}
                  />
                </div>
              </div>

              {/* Stamps/Points Grid */}
              {customerCard.programType !== "points" && (
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Array.from({ length: customerCard.rewardThreshold }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg border-2 flex items-center justify-center"
                        style={{
                          borderColor:
                            customerCard.designConfig?.secondaryColor ||
                            "#FFFFFF",
                          borderStyle: i < currentProgress ? "solid" : "dashed",
                          opacity: i < currentProgress ? 1 : 0.4,
                        }}
                      >
                        {i < currentProgress && (
                          <Check
                            className="w-5 h-5"
                            style={{
                              color:
                                customerCard.designConfig?.secondaryColor ||
                                "#FFFFFF",
                            }}
                          />
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Reward Info */}
              <div
                className="text-center py-3 rounded-xl"
                style={{
                  backgroundColor:
                    customerCard.designConfig?.secondaryColor || "#FFFFFF",
                  color: customerCard.designConfig?.primaryColor || "#3b82f6",
                }}
              >
                <p className="text-sm font-medium">
                  {customerCard.rewardThreshold}{" "}
                  {customerCard.programType === "points"
                    ? t("points")
                    : t("stamps")}{" "}
                  = {customerCard.rewardDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-white space-y-4">
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
                <Check className="w-5 h-5" />
                {successMessage}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {customerCard.programType === "stamps" ? (
                  <Stamp className="w-5 h-5 text-gray-500" />
                ) : (
                  <Star className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-gray-700">{t("serialNumber")}</span>
              </div>
              <span className="font-mono text-sm text-gray-500">
                {customerCard.serialNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{t("totalRedeemed")}</span>
              </div>
              <Badge variant="default">
                {customerCard.totalRewardsRedeemed} {t("rewards")}
              </Badge>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              {/* Add Stamp/Points */}
              <div className="flex items-center gap-3">
                {customerCard.programType === "points" && (
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() =>
                        setPointsToAdd(Math.max(1, pointsToAdd - 1))
                      }
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {pointsToAdd}
                    </span>
                    <button
                      onClick={() => setPointsToAdd(pointsToAdd + 1)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <Button
                  variant="primary"
                  onClick={handleAddStamp}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {customerCard.programType === "points" ? (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      {t("addPoints", { count: pointsToAdd })}
                    </>
                  ) : (
                    <>
                      <Stamp className="w-4 h-4 mr-2" />
                      {t("addStamp")}
                    </>
                  )}
                </Button>
              </div>

              {/* Redeem Reward */}
              {canRedeem && (
                <Button
                  variant="secondary"
                  onClick={handleRedeemReward}
                  disabled={isProcessing}
                  className="w-full !bg-green-600 hover:!bg-green-700 !text-white"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {t("redeemReward")}
                </Button>
              )}

              {/* New Search */}
              <Button variant="ghost" onClick={handleReset} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                {t("newSearch")}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!customerCard && !isSearching && !error && (
        <Card className="p-12 text-center">
          <ScanLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t("emptyTitle")}
          </h3>
          <p className="text-gray-500">{t("emptyDescription")}</p>
        </Card>
      )}
    </div>
  );
}
