#!/bin/sh

# ==============================================================================
# Script: automate_db.sh
# Description: Imports CSV files from /subject directory into PostgreSQL tables
# ==============================================================================

# Database credentials (from environment variables)
DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"

# Subject directory containing CSV files
SUBJECT_DIR="/subject"

# Function to create table and import CSV
import_csv() {
    local csv_file="$1"
    local table_name="$2"
    
    echo "========================================"
    echo "📥 Importing: $csv_file"
    echo "📋 Table name: $table_name"
    
    # Read the header line to get column names
    header=$(head -n 1 "$csv_file")
    
    # Convert header to SQL column definitions (all TEXT type initially)
    columns=$(echo "$header" | sed 's/,/ TEXT, /g')
    columns="$columns TEXT"
    
    echo "📊 Columns: $columns"
    
    # Create table and import data
    psql -U "$DB_USER" -d "$DB_NAME" <<EOSQL
-- Drop table if exists
DROP TABLE IF EXISTS $table_name;

-- Create table with columns from CSV header
CREATE TABLE $table_name (
    $columns    
);

-- Import CSV data (skip header row)
\COPY $table_name FROM '$csv_file' WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- Show row count
SELECT '$table_name' AS table_name, COUNT(*) AS row_count FROM $table_name;
EOSQL

    echo "✅ Done importing $table_name"
    echo ""
}

# ==============================================================================
# MAIN SCRIPT
# ==============================================================================

echo ""
echo "🚀 Starting CSV to PostgreSQL import..."
echo "📂 Subject directory: $SUBJECT_DIR"
echo "🗄️  Database: $DB_NAME"
echo "👤 User: $DB_USER"
echo ""

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until psql -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
    sleep 1
done
echo "✅ PostgreSQL is ready!"
echo ""

# ------------------------------------------------------------------------------
# Import CUSTOMER data
# ------------------------------------------------------------------------------
CUSTOMER_DIR="$SUBJECT_DIR/customer"

if [ -d "$CUSTOMER_DIR" ]; then
    echo "📁 Processing customer directory..."
    
    for csv_file in "$CUSTOMER_DIR"/*.csv; do
        if [ -f "$csv_file" ]; then
            # Extract table name from filename (e.g., data_2022_oct.csv -> customers_data_2022_oct)
            filename=$(basename "$csv_file" .csv)
            table_name="customers_$filename"
            
            import_csv "$csv_file" "$table_name"
        fi
    done
fi

# ------------------------------------------------------------------------------
# Import ITEM data
# ------------------------------------------------------------------------------
ITEM_DIR="$SUBJECT_DIR/item"

if [ -d "$ITEM_DIR" ]; then
    echo "📁 Processing item directory..."
    
    for csv_file in "$ITEM_DIR"/*.csv; do
        if [ -f "$csv_file" ]; then
            # Extract table name from filename
            filename=$(basename "$csv_file" .csv)
            table_name="$filename"
            
            import_csv "$csv_file" "$table_name"
        fi
    done
fi

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------
echo "========================================"
echo "📊 IMPORT SUMMARY"
echo "========================================"
psql -U "$DB_USER" -d "$DB_NAME" <<EOSQL
SELECT table_name, 
       pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOSQL

echo ""
echo "🎉 All CSV files imported successfully!"
