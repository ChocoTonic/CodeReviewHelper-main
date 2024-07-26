import sqlite3


def fetch_data(db_path, query):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    return results


def main():
    db_path = "example.db"
    query = "SELECT * FROM Users"
    try:
        data = fetch_data(db_path, query)
        print(data)
    except Exception as e:
        print("An error occurred:", e)


if __name__ == "__main__":
    main()
