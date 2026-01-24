-- ============================================
-- STAMPY - ESQUEMA INICIAL DE BASE DE DATOS
-- ============================================
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. COMERCIOS (businesses)
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  business_type VARCHAR(100), -- restaurant, salon, gym, etc.
  logo_url TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, basic, pro, enterprise
  subscription_status VARCHAR(50) DEFAULT 'active',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PROGRAMAS DE LEALTAD (loyalty_programs)
-- ============================================
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- stamps, points, visits
  reward_threshold INTEGER NOT NULL, -- cuántos sellos/puntos para recompensa
  reward_description TEXT, -- "1 café gratis", "20% descuento"
  design_config JSONB, -- colores, layout, imágenes
  apple_pass_type_id VARCHAR(255),
  google_class_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CLIENTES (customers)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE,
  total_visits INTEGER DEFAULT 0,
  UNIQUE(business_id, email)
);

-- ============================================
-- 4. TARJETAS DE LEALTAD (loyalty_cards)
-- ============================================
CREATE TABLE IF NOT EXISTS loyalty_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  current_points INTEGER DEFAULT 0,
  current_stamps INTEGER DEFAULT 0,
  total_rewards_redeemed INTEGER DEFAULT 0,
  qr_code TEXT, -- código QR único para escaneo
  apple_pass_url TEXT,
  google_pass_url TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, redeemed, expired
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(program_id, customer_id)
);

-- ============================================
-- 5. CUPONES (coupons)
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(50), -- percentage, fixed_amount, free_item
  discount_value DECIMAL(10, 2),
  terms_conditions TEXT,
  design_config JSONB,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  apple_pass_type_id VARCHAR(255),
  google_class_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. INSTANCIAS DE CUPONES (coupon_instances)
-- ============================================
CREATE TABLE IF NOT EXISTS coupon_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  qr_code TEXT,
  apple_pass_url TEXT,
  google_pass_url TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, redeemed, expired
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. TRANSACCIONES (transactions)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  loyalty_card_id UUID REFERENCES loyalty_cards(id),
  coupon_instance_id UUID REFERENCES coupon_instances(id),
  type VARCHAR(50) NOT NULL, -- stamp_added, points_added, reward_redeemed, coupon_redeemed
  points_change INTEGER DEFAULT 0,
  stamps_change INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. NOTIFICACIONES (notifications)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- push, geolocation
  target_audience VARCHAR(50), -- all, active_customers, specific_segment
  geofence_radius INTEGER, -- metros, solo para notificaciones geo
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. ANALYTICS EVENTS (analytics_events)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- pass_created, pass_installed, pass_opened, stamp_added, etc.
  customer_id UUID REFERENCES customers(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MEJORAR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_businesses_user ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_programs_business ON loyalty_programs(business_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_customer ON loyalty_cards(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_program ON loyalty_cards(program_id);
CREATE INDEX IF NOT EXISTS idx_customers_business ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_coupons_business ON coupons(business_id);
CREATE INDEX IF NOT EXISTS idx_coupon_instances_coupon ON coupon_instances(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_instances_customer ON coupon_instances(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_business ON transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_business ON analytics_events(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_notifications_business ON notifications(business_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para auto-actualizar updated_at
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_programs_updated_at
  BEFORE UPDATE ON loyalty_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_cards_updated_at
  BEFORE UPDATE ON loyalty_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
