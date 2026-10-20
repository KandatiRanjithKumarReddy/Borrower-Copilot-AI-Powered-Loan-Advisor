-- ── Borrower Copilot Database Schema ───────────────────────────────────────

-- ── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  google_id     VARCHAR(255) NULL UNIQUE,
  name          VARCHAR(100) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Assessments ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  input_json      JSON NOT NULL,
  result_json     JSON NOT NULL,
  recommendation  ENUM('BORROW','BORROW_LESS','DONT_BORROW') NOT NULL,
  requested_amount DECIMAL(15,2) NOT NULL,
  loan_purpose    VARCHAR(50)  NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assessments_user (user_id),
  INDEX idx_assessments_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── AI Summaries ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_summaries (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id  INT UNSIGNED NOT NULL UNIQUE,
  summary_text   TEXT NOT NULL,
  model_used     VARCHAR(50)  NOT NULL,
  prompt_tokens  INT UNSIGNED DEFAULT NULL,
  response_tokens INT UNSIGNED DEFAULT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  INDEX idx_ai_summaries_assessment (assessment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Contact Inquiries ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  subject        VARCHAR(200) NOT NULL,
  message        TEXT NOT NULL,
  status         ENUM('unread', 'read', 'resolved') DEFAULT 'unread',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── User Feedback ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED NULL,
  category       ENUM('Idea', 'Problem', 'Other') NOT NULL,
  message        TEXT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_feedback_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
