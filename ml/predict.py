import os
import joblib
import pandas as pd




base_dir = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(
    base_dir,
    "model",
    "sales_model.pkl"
)




if not os.path.exists(model_path):
    raise FileNotFoundError(
        f"Trained model not found: {model_path}"
    )

model = joblib.load(model_path)

print("Model loaded successfully!")



previous_sales = 405000
previous_customers = 1130
previous_orders = 1040

# January = 1
next_month = 1




input_data = pd.DataFrame([
    {
        "previous_sales": previous_sales,
        "previous_customers": previous_customers,
        "previous_orders": previous_orders,
        "month_number": next_month
    }
])




prediction = model.predict(input_data)

predicted_sales = prediction[0]




print(f"Previous Sales: ₹{previous_sales:,.2f}")
print(f"Previous Customers: {previous_customers}")
print(f"Previous Orders: {previous_orders}")

print(f"\nPredicted Next Month Sales:")
print(f"₹{predicted_sales:,.2f}")

print("==============================")