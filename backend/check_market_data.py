import pandas as pd

FILE = "data/market_prices.csv"

print("=" * 60)
print("ANALYZING MARKET DATASET")
print("=" * 60)

# Read only the columns we need
columns = [
    "STATE",
    "District Name",
    "Market Name",
    "Commodity",
    "Variety",
    "Grade",
    "Min_Price",
    "Max_Price",
    "Modal_Price",
    "Price Date"
]

df = pd.read_csv(
    FILE,
    usecols=columns
)

print("\nTotal rows:", len(df))

print("\nColumns:")
for column in df.columns:
    print("-", repr(column))


# Convert date
df["Price Date"] = pd.to_datetime(
    df["Price Date"],
    errors="coerce"
)

print("\nDate range:")
print("Start:", df["Price Date"].min())
print("End:", df["Price Date"].max())


# Unique values
print("\nUnique values:")

print("States:", df["STATE"].nunique())
print("Districts:", df["District Name"].nunique())
print("Markets:", df["Market Name"].nunique())
print("Commodities:", df["Commodity"].nunique())
print("Varieties:", df["Variety"].nunique())
print("Grades:", df["Grade"].nunique())


# Top commodities
print("\nTop 20 commodities:")

print(
    df["Commodity"]
    .value_counts()
    .head(20)
)


# Missing values
print("\nMissing values:")

print(
    df.isnull()
    .sum()
)


print("\n" + "=" * 60)
print("ANALYSIS COMPLETE")
print("=" * 60)