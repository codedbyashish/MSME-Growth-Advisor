import os
import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def load_data(data_path):
    """Load MSME monthly sales dataset."""

    if not os.path.exists(data_path):
        raise FileNotFoundError(
            f"Dataset not found at: {data_path}"
        )

    df = pd.read_csv(data_path)

    print(f"Dataset loaded successfully. Shape: {df.shape}")

    return df


def preprocess_data(df):
    """Prepare historical MSME data for sales prediction."""

    # Convert month to datetime
    df["month"] = pd.to_datetime(df["month"])

    # Sort each MSME chronologically
    df = df.sort_values(["msme_id", "month"]).reset_index(drop=True)

    # Create previous-month features separately for each MSME
    df["previous_sales"] = (
        df.groupby("msme_id")["sales"].shift(1)
    )

    df["previous_customers"] = (
        df.groupby("msme_id")["customers"].shift(1)
    )

    df["previous_orders"] = (
        df.groupby("msme_id")["orders"].shift(1)
    )

    # Month number
    df["month_number"] = df["month"].dt.month

    # Remove rows where previous-month data doesn't exist
    df = df.dropna().reset_index(drop=True)

    return df


def train_model():

    # --------------------------------------------------
    # 1. Dataset path
    # --------------------------------------------------

    base_dir = os.path.dirname(os.path.abspath(__file__))

    data_path = os.path.join(
        base_dir,
        "data",
        "sales_data.csv"
    )

    # --------------------------------------------------
    # 2. Load data
    # --------------------------------------------------

    df = load_data(data_path)

    # --------------------------------------------------
    # 3. Basic data information
    # --------------------------------------------------

    print("\n--- Data Summary ---")

    print(df.head())

    print("\nColumns:")
    print(df.columns.tolist())

    print("\nMissing values:")
    print(df.isnull().sum())

    # --------------------------------------------------
    # 4. Prepare data
    # --------------------------------------------------

    df = preprocess_data(df)

    print("\n--- Prepared Data ---")

    print(df.head())

    print("\nPrepared dataset shape:")
    print(df.shape)

    # --------------------------------------------------
    # 5. Features and target
    # --------------------------------------------------

    feature_cols = [
        "previous_sales",
        "previous_customers",
        "previous_orders",
        "month_number"
    ]

    X = df[feature_cols]

    # Target = current month's sales
    y = df["sales"]

    # --------------------------------------------------
    # 6. Time-based train/test split
    # --------------------------------------------------

    # Last 20% of each MSME's history is used for testing.
    train_indices = []
    test_indices = []

    for msme_id, group in df.groupby("msme_id"):

        group_indices = group.index.tolist()

        split_point = int(len(group_indices) * 0.8)

        train_indices.extend(group_indices[:split_point])
        test_indices.extend(group_indices[split_point:])

    X_train = X.loc[train_indices]
    X_test = X.loc[test_indices]

    y_train = y.loc[train_indices]
    y_test = y.loc[test_indices]

    print("\n--- Train/Test Split ---")

    print("Training rows:", len(X_train))
    print("Testing rows:", len(X_test))

    # --------------------------------------------------
    # 7. Models
    # --------------------------------------------------

    models = {

        "Random Forest": RandomForestRegressor(
            n_estimators=200,
            random_state=42,
            n_jobs=-1
        ),

        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.05,
            max_depth=3,
            random_state=42
        )
    }

    # --------------------------------------------------
    # 8. Train models
    # --------------------------------------------------

    best_model = None
    best_model_name = None
    best_mae = float("inf")

    print("\n--- Model Training ---")

    for name, model in models.items():

        print(f"\nTraining {name}...")

        # Train
        model.fit(X_train, y_train)

        # Predict
        predictions = model.predict(X_test)

        # Evaluation
        mae = mean_absolute_error(
            y_test,
            predictions
        )

        rmse = np.sqrt(
            mean_squared_error(
                y_test,
                predictions
            )
        )

        r2 = r2_score(
            y_test,
            predictions
        )

        print(f"MAE:  ₹{mae:,.2f}")
        print(f"RMSE: ₹{rmse:,.2f}")
        print(f"R²:   {r2:.4f}")

        # Select best model
        if mae < best_mae:

            best_mae = mae
            best_model = model
            best_model_name = name

    # --------------------------------------------------
    # 9. Best model
    # --------------------------------------------------

    print("\n==============================")
    print("BEST MODEL")
    print("==============================")

    print("Model:", best_model_name)
    print(f"MAE: ₹{best_mae:,.2f}")

    # --------------------------------------------------
    # 10. Save model
    # --------------------------------------------------

    model_dir = os.path.join(
        base_dir,
        "model"
    )

    os.makedirs(
        model_dir,
        exist_ok=True
    )

    model_path = os.path.join(
        model_dir,
        "sales_model.pkl"
    )

    joblib.dump(
        best_model,
        model_path
    )

    print("\nModel saved successfully:")
    print(model_path)


if __name__ == "__main__":
    train_model()