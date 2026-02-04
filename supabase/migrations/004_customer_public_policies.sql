-- ============================================
-- STAMPY - PUBLIC POLICIES FOR CUSTOMER REGISTRATION
-- ============================================
-- Ejecutar DESPUÉS de 002_row_level_security.sql
-- Permite registro público de clientes finales
-- ============================================

-- Permitir INSERT público en customers (registro sin auth)
CREATE POLICY "Public can insert customers"
  ON customers FOR INSERT
  WITH CHECK (true);

-- Permitir INSERT público en loyalty_cards (crear tarjeta sin auth)
CREATE POLICY "Public can insert loyalty cards"
  ON loyalty_cards FOR INSERT
  WITH CHECK (true);

-- Permitir SELECT público en loyalty_cards por serial_number
CREATE POLICY "Public can view own loyalty card"
  ON loyalty_cards FOR SELECT
  USING (true);

-- Permitir INSERT público en analytics_events (registrar eventos)
CREATE POLICY "Public can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);
