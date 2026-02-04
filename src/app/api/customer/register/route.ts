import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import QRCode from "qrcode";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programId, name, email, phone } = body;

    if (!programId || !name || !email) {
      return NextResponse.json(
        { error: "programId, name, and email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Verify program exists and is active
    const { data: program, error: programError } = await supabase
      .from("loyalty_programs")
      .select("*, businesses(id, name)")
      .eq("id", programId)
      .eq("is_active", true)
      .single();

    if (programError || !program) {
      return NextResponse.json(
        { error: "Program not found or inactive" },
        { status: 404 }
      );
    }

    const businessId = program.business_id;

    // Upsert customer by business_id + email
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("business_id", businessId)
      .eq("email", email)
      .single();

    let customerId: string;

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          business_id: businessId,
          name,
          email,
          phone: phone || null,
        })
        .select("id")
        .single();

      if (customerError || !newCustomer) {
        return NextResponse.json(
          { error: "Failed to create customer" },
          { status: 500 }
        );
      }
      customerId = newCustomer.id;
    }

    // Check if card already exists for this customer + program
    const { data: existingCard } = await supabase
      .from("loyalty_cards")
      .select("*")
      .eq("program_id", programId)
      .eq("customer_id", customerId)
      .single();

    if (existingCard) {
      return NextResponse.json({
        card: existingCard,
        program,
        isExisting: true,
      });
    }

    // Create loyalty card
    const serialNumber = randomUUID();
    const qrCodeDataUrl = await QRCode.toDataURL(serialNumber, {
      width: 300,
      margin: 2,
    });

    const { data: card, error: cardError } = await supabase
      .from("loyalty_cards")
      .insert({
        program_id: programId,
        customer_id: customerId,
        serial_number: serialNumber,
        current_points: 0,
        current_stamps: 0,
        total_rewards_redeemed: 0,
        qr_code: qrCodeDataUrl,
        status: "active",
      })
      .select("*")
      .single();

    if (cardError || !card) {
      return NextResponse.json(
        { error: "Failed to create loyalty card" },
        { status: 500 }
      );
    }

    // Record analytics event
    await supabase.from("analytics_events").insert({
      business_id: businessId,
      event_type: "pass_created",
      customer_id: customerId,
      metadata: { program_id: programId, card_id: card.id },
    });

    return NextResponse.json({
      card,
      program,
      isExisting: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
