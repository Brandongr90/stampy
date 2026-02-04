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
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, Card, Badge, DropdownMenu, Modal } from "@/components/ui";
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
  const tCommon = useTranslations("Common");
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    program: LoyaltyProgram | null;
  }>({ isOpen: false, program: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const programTypeLabels = {
    stamps: t("types.stamps"),
    points: t("types.points"),
    visits: t("types.visits"),
  };

  const fetchPrograms = async () => {
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
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleToggleActive = async (program: LoyaltyProgram) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("loyalty_programs")
      .update({ is_active: !program.is_active })
      .eq("id", program.id);

    if (error) {
      console.error("Error toggling program status:", error);
    } else {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === program.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    }
  };

  const handleDeleteProgram = async () => {
    if (!deleteModal.program) return;

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("loyalty_programs")
      .delete()
      .eq("id", deleteModal.program.id);

    if (error) {
      console.error("Error deleting program:", error);
    } else {
      setPrograms((prev) =>
        prev.filter((p) => p.id !== deleteModal.program?.id)
      );
    }

    setIsDeleting(false);
    setDeleteModal({ isOpen: false, program: null });
  };

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
                    <DropdownMenu
                      trigger={
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      }
                      items={[
                        {
                          label: tCommon("edit"),
                          icon: <Pencil className="w-4 h-4" />,
                          onClick: () => {
                            window.location.href = `/dashboard/programs/${program.id}`;
                          },
                        },
                        {
                          label: program.is_active
                            ? t("deactivate")
                            : t("activate"),
                          icon: program.is_active ? (
                            <ToggleLeft className="w-4 h-4" />
                          ) : (
                            <ToggleRight className="w-4 h-4" />
                          ),
                          onClick: () => handleToggleActive(program),
                        },
                        {
                          label: tCommon("delete"),
                          icon: <Trash2 className="w-4 h-4" />,
                          onClick: () =>
                            setDeleteModal({ isOpen: true, program }),
                          variant: "danger" as const,
                        },
                      ]}
                    />
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
                      date: new Date(
                        program.created_at as string
                      ).toLocaleDateString(),
                    })}
                  </span>
                  <Link
                    href={`/dashboard/programs/${program.id}`}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    {tCommon("edit")}
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, program: null })}
        title={t("deleteConfirmTitle")}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {t("deleteConfirmMessage", { name: deleteModal.program?.name || "" })}
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {t("deleteWarning")}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, program: null })}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteProgram}
              disabled={isDeleting}
              className="!bg-red-600 hover:!bg-red-700"
            >
              {isDeleting ? t("deleting") : tCommon("delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
