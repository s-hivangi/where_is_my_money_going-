import pandas as pd
import psycopg2
import hashlib
from datetime import datetime

import os
from dotenv import load_dotenv
load_dotenv()

# ---------- 1. load and clean data ----------

df = pd.read_csv('data/archive/personal_transactions_dashboard.csv')

# clean date — remove timestamp
df['Date'] = pd.to_datetime(df['Date']).dt.date

# category mapping
category_map = {
    'Shopping': 'Shopping',
    'Mortgage & Rent': 'Bills',
    'Restaurants': 'Food',
    'Credit Card Payment': 'Transfer',
    'Movies & Dvds': 'Entertainment',
    'Home Improvement': 'Shopping',
    'Utilities': 'Bills',
    'Music': 'Entertainment',
    'Mobile Phone': 'Bills',
    'Gas & Fuel': 'Transport',
    'Groceries': 'Food',
    'Paycheck': 'Salary',
    'Fast Food': 'Food',
    'Coffee Shops': 'Food',
    'Internet': 'Bills',
    'Haircut': 'Other',
    'Alcohol & Bars': 'Food',
    'Auto Insurance': 'Insurance',
    'Entertainment': 'Entertainment',
    'Food & Dining': 'Food',
    'Television': 'Entertainment',
    'Electronics & Software': 'Shopping'
}

df['mapped_category'] = df['Category'].map(category_map).fillna('Other')

print(f"loaded {len(df)} rows")
print("sample after cleaning:")
print(df[['Date', 'Description', 'Amount', 'Transaction Type', 'mapped_category']].head())

# ---------- 2. connect to database ----------

conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

cur = conn.cursor()
print("connected to database")

# ---------- 3. create fake user ----------

cur.execute("SELECT id FROM users WHERE email = 'shivangi@test.com'")
user = cur.fetchone()

if user:
    user_id = user[0]
    print(f"user already exists, id: {user_id}")
else:
    cur.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id",
        ('Shivangi', 'shivangi@test.com', 'hashed_password_placeholder')
    )
    user_id = cur.fetchone()[0]
    print(f"created user, id: {user_id}")

# ---------- 4. create bank accounts ----------

accounts = df['Account Name'].unique()
account_ids = {}

for account in accounts:
    cur.execute("SELECT id FROM bank_accounts WHERE user_id = %s AND bank_name = %s", (user_id, account))
    existing = cur.fetchone()
    if existing:
        account_ids[account] = existing[0]
    else:
        cur.execute(
            "INSERT INTO bank_accounts (user_id, bank_name, account_type) VALUES (%s, %s, %s) RETURNING id",
            (user_id, account, 'checking')
        )
        account_ids[account] = cur.fetchone()[0]

print(f"bank accounts ready: {account_ids}")

# ---------- 5. create statement ----------

cur.execute("SELECT id FROM statements WHERE user_id = %s AND bank_name = %s", (user_id, 'Personal Finance Dataset'))
existing_statement = cur.fetchone()

if existing_statement:
    statement_id = existing_statement[0]
    print(f"statement already exists, id: {statement_id}")
else:
    cur.execute(
        "INSERT INTO statements (user_id, bank_name, status) VALUES (%s, %s, %s) RETURNING id",
        (user_id, 'Personal Finance Dataset', 'COMPLETED')
    )
    statement_id = cur.fetchone()[0]
    print(f"created statement, id: {statement_id}")

# ---------- 6. get category ids ----------

cur.execute("SELECT id, name FROM categories")
categories = {row[1]: row[0] for row in cur.fetchall()}
print(f"loaded {len(categories)} categories")

# ---------- 7. insert transactions ----------

print("inserting transactions...")
inserted = 0
skipped = 0

for _, row in df.iterrows():
    # generate hash for duplicate detection
    hash_input = f"{row['Date']}{row['Description']}{row['Amount']}"
    tx_hash = hashlib.sha256(hash_input.encode()).hexdigest()

    # check duplicate
    cur.execute("SELECT id FROM transactions WHERE hash = %s", (tx_hash,))
    if cur.fetchone():
        skipped += 1
        continue

    category_id = categories.get(row['mapped_category'], categories.get('Other'))
    bank_account_id = account_ids.get(row['Account Name'])

    cur.execute("""
        INSERT INTO transactions 
        (user_id, statement_id, bank_account_id, date, description, merchant, 
         merchant_normalized, amount, type, category_id, hash)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user_id,
        statement_id,
        bank_account_id,
        row['Date'],
        row['Description'],
        row['Description'],
        row['Description'].strip().title(),
        float(row['Amount']),
        row['Transaction Type'].lower(),
        category_id,
        tx_hash
    ))
    inserted += 1

print(f"inserted {inserted} transactions")
print(f"skipped {skipped} duplicates")

# ---------- 8. insert monthly summaries ----------

print("inserting monthly summaries...")

df['month_date'] = pd.to_datetime(df['Date']).dt.to_period('M').dt.to_timestamp()

for month, group in df.groupby('month_date'):
    credits = group[group['Transaction Type'] == 'credit']['Amount'].sum()
    debits = group[group['Transaction Type'] == 'debit']['Amount'].sum()
    savings_rate = ((credits - debits) / credits * 100) if credits > 0 else 0

    cur.execute("SELECT id FROM monthly_summaries WHERE user_id = %s AND month = %s", (user_id, month.date()))
    if not cur.fetchone():
        cur.execute("""
            INSERT INTO monthly_summaries (user_id, month, total_income, total_spending, savings_rate)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, month.date(), float(credits), float(debits), float(round(savings_rate, 2))))

conn.commit()
cur.close()
conn.close()

print("database seeded")
