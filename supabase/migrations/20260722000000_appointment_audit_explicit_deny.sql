-- Explicitly deny UPDATE and DELETE operations to ensure absolute immutability

CREATE POLICY audit_update_policy ON appointment.appointment_audit
    FOR UPDATE USING (false);

CREATE POLICY audit_delete_policy ON appointment.appointment_audit
    FOR DELETE USING (false);
