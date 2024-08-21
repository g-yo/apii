from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['RQ_Analytics']

@app.route('/')
def home():
    return "E-commerce Analytics API"

@app.route('/api/total-sales', methods=['GET'])
def total_sales():
    orders = db.shopifyOrders
    pipeline = [
        {
            "$addFields": {
                "created_at": {
                    "$dateFromString": {
                        "dateString": "$created_at",
                        "onError": None
                    }
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "day": {"$dayOfMonth": "$created_at"}
                },
                "total_sales": {"$sum": {"$toDouble": "$total_price_set.shop_money.amount"}}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    try:
        sales_data = list(orders.aggregate(pipeline))
        return jsonify(sales_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/api/sales-growth-rate', methods=['GET'])
def sales_growth_rate():
    orders = db.shopifyOrders
    try:
        pipeline = [
            {
                "$addFields": {
                    "created_at": {
                        "$dateFromString": {
                            "dateString": "$created_at" 
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": {"$year": "$created_at"},
                        "month": {"$month": "$created_at"}
                    },
                    "total_sales": {"$sum": {"$toDouble": "$total_price_set.shop_money.amount"}}
                }
            },
            {
                "$sort": {"_id": 1}
            },
            {
                "$project": {
                    "_id": 1,
                    "total_sales": 1,
                    "sales_growth_rate": {
                        "$cond": [
                            {"$eq": [{"$sum": "$total_sales"}, 0]},
                            0,
                            {"$divide": [
                                {"$subtract": ["$total_sales", {"$sum": "$total_sales"}]},
                                {"$sum": "$total_sales"}
                            ]}
                        ]
                    }
                }
            }
        ]
        growth_data = list(orders.aggregate(pipeline))
        return jsonify(growth_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/new-customers', methods=['GET'])
def new_customers():
    customers = db.shopifyCustomers
    pipeline = [
        {
            "$addFields": {
                "created_at": {
                    "$dateFromString": {
                        "dateString": "$created_at",
                        "onError": None
                    }
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "day": {"$dayOfMonth": "$created_at"}
                },
                "new_customers": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    try:
        customers_data = list(customers.aggregate(pipeline))
        return jsonify(customers_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/repeat-customers', methods=['GET'])
def repeat_customers():
    orders = db.shopifyCustomers
    pipeline = [
        {
            "$group": {
                "_id": "$customer_id",
                "purchase_count": {"$sum": 1}
            }
        },
        {
            "$match": {
                "purchase_count": {"$gt": 1}
            }
        },
        {
            "$group": {
                "_id": None,
                "repeat_customers": {"$sum": 1}
            }
        }
    ]
    try:
        repeat_data = list(orders.aggregate(pipeline))
        return jsonify(repeat_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/customer-geography', methods=['GET'])
def customer_geography():
    customers = db.shopifyCustomers
    pipeline = [
        {
            "$group": {
                "_id": "$default_address.city",
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}}
    ]
    try:
        geography_data = list(customers.aggregate(pipeline))
        return jsonify(geography_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/customer-lifetime-value', methods=['GET'])
def customer_lifetime_value():
    orders = db.shopifyOrders
    pipeline = [
        {
            "$addFields": {
                "created_at": {
                    "$dateFromString": {
                        "dateString": "$created_at",
                        "onError": None
                    }
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "customer_id": "$customer_id"
                },
                "total_spent": {"$sum": {"$toDouble": "$total_price_set.shop_money.amount"}}
            }
        },
        {
            "$group": {
                "_id": {"year": "$_id.year", "month": "$_id.month"},
                "cohort_value": {"$avg": "$total_spent"}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    try:
        lifetime_value_data = list(orders.aggregate(pipeline))
        return jsonify(lifetime_value_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
