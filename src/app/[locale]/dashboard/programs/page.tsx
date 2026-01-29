"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  CreditCard,
  Stamp,
  Star,
  Users,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type LoyaltyProgram = Database["public"]["Tables"]["loyalty_programs"]["Row"];

const programTypeIcons = {
  stamps: Stamp,
  points: Star,
  visits: Users,
};

export default function ProgramsPage() {
  const t = useTranslations("Dashboard.programs");
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const programTypeLabels = {
    stamps: t("types.stamps"),
    points: t("types.points"),
    visits: t("types.visits"),
  };

  useEffect(() => {
    async function fetchPrograms() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("loyalty_programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching programs:", error);
      } else {
        setPrograms(data || []);
      }
      setIsLoading(false);
    }

    fetchPrograms();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-almost-black">
              {t("title")}
            </h1>
            <p className="text-gray-500 mt-1">{t("subtitle")}</p>
          </div>
        </div>

        <EmptyState
          icon={CreditCard}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("emptyAction")}
          actionHref="/dashboard/programs/new"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <Link href="/dashboard/programs/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            {t("createProgram")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => {
          const TypeIcon =
            programTypeIcons[program.type as keyof typeof programTypeIcons] ||
            CreditCard;
          const typeLabel =
            programTypeLabels[program.type as keyof typeof programTypeLabels] ||
            program.type;

          return (
            <Card key={program.id} className="relative group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={program.is_active ? "success" : "default"}>
                      {program.is_active ? t("active") : t("inactive")}
                    </Badge>
                    <button className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-almost-black mb-1">
                  {program.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {program.description || t("noDescription")}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <TypeIcon className="w-4 h-4" />
                    <span>{typeLabel}</span>
                  </div>
                  <div className="text-gray-600">
                    {t("rewardEquation", {
                      threshold: program.reward_threshold,
                      type: typeLabel.toLowerCase(),
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {t("created", {
                      date: new Date(program.created_at).toLocaleDateString(),
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/programs/${program.id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
