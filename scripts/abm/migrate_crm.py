#!/usr/bin/env python3
"""Idempotent CRM schema migration for ABM pipeline columns."""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm.db')


def column_exists(cursor, table, column):
    cursor.execute(f"PRAGMA table_info({table})")
    return any(row[1] == column for row in cursor.fetchall())


def migrate(db_path=DB_PATH):
    db_path = os.path.abspath(db_path)
    if not os.path.exists(db_path):
        print(f"[!] Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    alterations = [
        # accounts
        ("accounts", "exa_research", "TEXT"),
        ("accounts", "apollo_id", "TEXT"),
        ("accounts", "employee_count", "INTEGER"),
        ("accounts", "funding", "TEXT"),
        ("accounts", "tech_stack", "TEXT"),
        # contacts
        ("contacts", "apollo_id", "TEXT"),
        ("contacts", "title", "TEXT"),
        ("contacts", "vibe", "TEXT"),
        # landing_pages
        ("landing_pages", "slug", "TEXT"),
        ("landing_pages", "contact_id", "INTEGER REFERENCES contacts(id)"),
        ("landing_pages", "page_data", "TEXT"),
    ]

    added = 0
    for table, col, col_type in alterations:
        col_name = col.split()[0]  # handle "contact_id INTEGER REFERENCES..."
        if not column_exists(cur, table, col_name):
            cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}")
            print(f"  [+] {table}.{col_name}")
            added += 1
        else:
            print(f"  [=] {table}.{col_name} already exists")

    conn.commit()
    conn.close()
    print(f"\nMigration complete. {added} columns added.")


if __name__ == "__main__":
    migrate()
