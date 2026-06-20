-- Smart City Civic Services Kiosk Database Schema

-- Citizens Table
CREATE TABLE citizens (
    id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    aadhaar VARCHAR(12) UNIQUE NOT NULL,
    mobile VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(100),
    account_id VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- OTP Sessions Table
CREATE TABLE otp_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(20) NOT NULL, -- Can be aadhaar, mobile, or account_id
    identifier_type ENUM('aadhaar', 'mobile', 'account') NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier (identifier),
    INDEX idx_expires (expires_at)
);

-- User Sessions Table
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id VARCHAR(20) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id) ON DELETE CASCADE,
    INDEX idx_citizen (citizen_id),
    INDEX idx_token (token_hash),
    INDEX idx_expires (expires_at)
);

-- Audit Log Table
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id VARCHAR(20),
    action VARCHAR(50) NOT NULL,
    identifier_type VARCHAR(20),
    identifier_value VARCHAR(20),
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('success', 'failure') NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id) ON DELETE SET NULL,
    INDEX idx_citizen (citizen_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);

-- Insert sample citizen data
INSERT INTO citizens (id, full_name, aadhaar, mobile, email, account_id) VALUES 
('CIT-2026-001', 'Rajesh Kumar', '123456789012', '9876543210', 'rajesh.kumar@email.com', 'ACC-MH-2026-7890'),
('CIT-2026-002', 'Priya Sharma', '234567890123', '8765432109', 'priya.sharma@email.com', 'ACC-MH-2026-7891'),
('CIT-2026-003', 'Amit Patel', '345678901234', '7654321098', 'amit.patel@email.com', 'ACC-MH-2026-7892');
