-- ============================================
-- STAMPY - ROW LEVEL SECURITY (RLS)
-- ============================================
-- Ejecutar DESPUÉS de 001_initial_schema.sql
-- ============================================

-- ============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA BUSINESSES
-- ============================================
-- Los usuarios solo pueden ver su propio negocio
CREATE POLICY "Users can view own business"
  ON businesses FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden insertar su propio negocio
CREATE POLICY "Users can insert own business"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar su propio negocio
CREATE POLICY "Users can update own business"
  ON businesses FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar su propio negocio
CREATE POLICY "Users can delete own business"
  ON businesses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA LOYALTY_PROGRAMS
-- ============================================
-- Los usuarios pueden ver programas de su negocio
CREATE POLICY "Users can view own programs"
  ON loyalty_programs FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear programas para su negocio
CREATE POLICY "Users can insert own programs"
  ON loyalty_programs FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden actualizar programas de su negocio
CREATE POLICY "Users can update own programs"
  ON loyalty_programs FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden eliminar programas de su negocio
CREATE POLICY "Users can delete own programs"
  ON loyalty_programs FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PARA CUSTOMERS
-- ============================================
-- Los usuarios pueden ver clientes de su negocio
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear clientes para su negocio
CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden actualizar clientes de su negocio
CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden eliminar clientes de su negocio
CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PARA LOYALTY_CARDS
-- ============================================
-- Los usuarios pueden ver tarjetas de programas de su negocio
CREATE POLICY "Users can view own loyalty cards"
  ON loyalty_cards FOR SELECT
  USING (
    program_id IN (
      SELECT lp.id FROM loyalty_programs lp
      JOIN businesses b ON lp.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear tarjetas para programas de su negocio
CREATE POLICY "Users can insert own loyalty cards"
  ON loyalty_cards FOR INSERT
  WITH CHECK (
    program_id IN (
      SELECT lp.id FROM loyalty_programs lp
      JOIN businesses b ON lp.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Los usuarios pueden actualizar tarjetas de programas de su negocio
CREATE POLICY "Users can update own loyalty cards"
  ON loyalty_cards FOR UPDATE
  USING (
    program_id IN (
      SELECT lp.id FROM loyalty_programs lp
      JOIN businesses b ON lp.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Los usuarios pueden eliminar tarjetas de programas de su negocio
CREATE POLICY "Users can delete own loyalty cards"
  ON loyalty_cards FOR DELETE
  USING (
    program_id IN (
      SELECT lp.id FROM loyalty_programs lp
      JOIN businesses b ON lp.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PARA COUPONS
-- ============================================
-- Los usuarios pueden ver cupones de su negocio
CREATE POLICY "Users can view own coupons"
  ON coupons FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear cupones para su negocio
CREATE POLICY "Users can insert own coupons"
  ON coupons FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden actualizar cupones de su negocio
CREATE POLICY "Users can update own coupons"
  ON coupons FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden eliminar cupones de su negocio
CREATE POLICY "Users can delete own coupons"
  ON coupons FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PARA COUPON_INSTANCES
-- ============================================
-- Los usuarios pueden ver instancias de cupones de su negocio
CREATE POLICY "Users can view own coupon instances"
  ON coupon_instances FOR SELECT
  USING (
    coupon_id IN (
      SELECT c.id FROM coupons c
      JOIN businesses b ON c.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear instancias de cupones de su negocio
CREATE POLICY "Users can insert own coupon instances"
  ON coupon_instances FOR INSERT
  WITH CHECK (
    coupon_id IN (
      SELECT c.id FROM coupons c
      JOIN businesses b ON c.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Los usuarios pueden actualizar instancias de cupones de su negocio
CREATE POLICY "Users can update own coupon instances"
  ON coupon_instances FOR UPDATE
  USING (
    coupon_id IN (
      SELECT c.id FROM coupons c
      JOIN businesses b ON c.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Los usuarios pueden eliminar instancias de cupones de su negocio
CREATE POLICY "Users can delete own coupon instances"
  ON coupon_instances FOR DELETE
  USING (
    coupon_id IN (
      SELECT c.id FROM coupons c
      JOIN businesses b ON c.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PARA TRANSACTIONS
-- ============================================
-- Los usuarios pueden ver transacciones de su negocio
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear transacciones para su negocio
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PARA NOTIFICATIONS
-- ============================================
-- Los usuarios pueden ver notificaciones de su negocio
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear notificaciones para su negocio
CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden actualizar notificaciones de su negocio
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden eliminar notificaciones de su negocio
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PARA ANALYTICS_EVENTS
-- ============================================
-- Los usuarios pueden ver eventos de analytics de su negocio
CREATE POLICY "Users can view own analytics"
  ON analytics_events FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Los usuarios pueden crear eventos de analytics para su negocio
CREATE POLICY "Users can insert own analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS PÚBLICAS PARA CLIENTES FINALES
-- ============================================
-- Permitir que clientes finales vean programas activos (para agregar a wallet)
CREATE POLICY "Public can view active programs"
  ON loyalty_programs FOR SELECT
  USING (is_active = true);

-- Permitir que clientes finales vean cupones activos
CREATE POLICY "Public can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));
