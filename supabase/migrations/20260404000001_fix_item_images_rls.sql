-- Fix: restrict item_images writes to admin/superadmin only
DROP POLICY IF EXISTS "Authenticated users can manage item images" ON item_images;

CREATE POLICY "Admin users can manage item images"
    ON item_images FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'superadmin'))
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'superadmin'))
    );

-- Enforce HTTPS URLs only
ALTER TABLE item_images ADD CONSTRAINT image_url_must_be_https CHECK (image_url LIKE 'https://%');
