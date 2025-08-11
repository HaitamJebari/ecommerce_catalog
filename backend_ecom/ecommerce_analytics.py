#!/usr/bin/env python3
"""
E-commerce Product Catalog - Analytics Module
Python script for analyzing product and sales data
"""

import json
import os
import sys
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import matplotlib.pyplot as plt
import pandas as pd
from pathlib import Path
import numpy as np

class EcommerceAnalytics:
    def __init__(self, data_dir=None):
        if data_dir is None:
            # Default path relative to this script
            script_dir = Path(__file__).parent
            self.data_dir = script_dir / '../database'
        else:
            self.data_dir = Path(data_dir)
        
        self.products_file = self.data_dir / 'products.json'
        self.categories_file = self.data_dir / 'categories.json'
        self.orders_file = self.data_dir / 'orders.json'
        
        self.products = self.load_data(self.products_file)
        self.categories = self.load_data(self.categories_file)
        self.orders = self.load_data(self.orders_file)
    
    def load_data(self, file_path):
        """Load data from JSON file"""
        try:
            if file_path.exists():
                with open(file_path, 'r') as f:
                    return json.load(f)
            else:
                print(f"Data file not found: {file_path}")
                return []
        except Exception as e:
            print(f"Error loading data from {file_path}: {e}")
            return []
    
    def get_product_stats(self):
        """Get basic product statistics"""
        if not self.products:
            return {
                'total_products': 0,
                'average_price': 0,
                'average_rating': 0,
                'in_stock_count': 0,
                'out_of_stock_count': 0,
                'featured_count': 0
            }
        
        total_products = len(self.products)
        average_price = sum(p.get('price', 0) for p in self.products) / total_products
        average_rating = sum(p.get('rating', 0) for p in self.products) / total_products
        in_stock_count = sum(1 for p in self.products if p.get('inStock', False))
        out_of_stock_count = total_products - in_stock_count
        featured_count = sum(1 for p in self.products if p.get('featured', False))
        
        return {
            'total_products': total_products,
            'average_price': round(average_price, 2),
            'average_rating': round(average_rating, 2),
            'in_stock_count': in_stock_count,
            'out_of_stock_count': out_of_stock_count,
            'featured_count': featured_count
        }
    
    def get_category_analysis(self):
        """Analyze products by category"""
        category_stats = defaultdict(lambda: {
            'count': 0,
            'total_value': 0,
            'average_price': 0,
            'average_rating': 0,
            'total_reviews': 0
        })
        
        for product in self.products:
            category = product.get('category', 'unknown')
            price = product.get('price', 0)
            rating = product.get('rating', 0)
            reviews = product.get('reviews', 0)
            
            category_stats[category]['count'] += 1
            category_stats[category]['total_value'] += price
            category_stats[category]['average_rating'] += rating
            category_stats[category]['total_reviews'] += reviews
        
        # Calculate averages
        for category, stats in category_stats.items():
            if stats['count'] > 0:
                stats['average_price'] = round(stats['total_value'] / stats['count'], 2)
                stats['average_rating'] = round(stats['average_rating'] / stats['count'], 2)
        
        return dict(category_stats)
    
    def get_price_analysis(self):
        """Analyze price distribution"""
        if not self.products:
            return {}
        
        prices = [p.get('price', 0) for p in self.products]
        
        return {
            'min_price': min(prices),
            'max_price': max(prices),
            'median_price': np.median(prices),
            'price_ranges': {
                'under_25': len([p for p in prices if p < 25]),
                '25_to_50': len([p for p in prices if 25 <= p < 50]),
                '50_to_100': len([p for p in prices if 50 <= p < 100]),
                'over_100': len([p for p in prices if p >= 100])
            }
        }
    
    def get_rating_analysis(self):
        """Analyze product ratings"""
        if not self.products:
            return {}
        
        ratings = [p.get('rating', 0) for p in self.products]
        
        return {
            'average_rating': round(np.mean(ratings), 2),
            'median_rating': round(np.median(ratings), 2),
            'rating_distribution': {
                '5_stars': len([r for r in ratings if r >= 4.5]),
                '4_stars': len([r for r in ratings if 4.0 <= r < 4.5]),
                '3_stars': len([r for r in ratings if 3.0 <= r < 4.0]),
                '2_stars': len([r for r in ratings if 2.0 <= r < 3.0]),
                '1_star': len([r for r in ratings if r < 2.0])
            }
        }
    
    def get_sales_analysis(self):
        """Analyze sales data from orders"""
        if not self.orders:
            return {
                'total_orders': 0,
                'total_revenue': 0,
                'average_order_value': 0,
                'orders_by_status': {},
                'monthly_revenue': {}
            }
        
        total_orders = len(self.orders)
        total_revenue = sum(order.get('total', 0) for order in self.orders)
        average_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        # Orders by status
        orders_by_status = Counter(order.get('status', 'unknown') for order in self.orders)
        
        # Monthly revenue
        monthly_revenue = defaultdict(float)
        for order in self.orders:
            try:
                created_at = datetime.fromisoformat(order['createdAt'].replace('Z', '+00:00'))
                month_key = created_at.strftime('%Y-%m')
                monthly_revenue[month_key] += order.get('total', 0)
            except (ValueError, KeyError):
                continue
        
        return {
            'total_orders': total_orders,
            'total_revenue': round(total_revenue, 2),
            'average_order_value': round(average_order_value, 2),
            'orders_by_status': dict(orders_by_status),
            'monthly_revenue': dict(monthly_revenue)
        }
    
    def get_top_products(self, limit=10, sort_by='rating'):
        """Get top products by rating, reviews, or price"""
        if not self.products:
            return []
        
        if sort_by == 'rating':
            sorted_products = sorted(self.products, key=lambda p: p.get('rating', 0), reverse=True)
        elif sort_by == 'reviews':
            sorted_products = sorted(self.products, key=lambda p: p.get('reviews', 0), reverse=True)
        elif sort_by == 'price':
            sorted_products = sorted(self.products, key=lambda p: p.get('price', 0), reverse=True)
        else:
            sorted_products = self.products
        
        return sorted_products[:limit]
    
    def get_inventory_analysis(self):
        """Analyze inventory levels"""
        if not self.products:
            return {}
        
        total_stock = sum(p.get('stock', 0) for p in self.products)
        low_stock_products = [p for p in self.products if p.get('stock', 0) < 10]
        out_of_stock_products = [p for p in self.products if p.get('stock', 0) == 0]
        
        return {
            'total_stock_value': sum(p.get('price', 0) * p.get('stock', 0) for p in self.products),
            'total_stock_units': total_stock,
            'low_stock_count': len(low_stock_products),
            'out_of_stock_count': len(out_of_stock_products),
            'low_stock_products': [p['name'] for p in low_stock_products],
            'out_of_stock_products': [p['name'] for p in out_of_stock_products]
        }
    
    def generate_insights(self):
        """Generate business insights"""
        insights = []
        
        product_stats = self.get_product_stats()
        category_analysis = self.get_category_analysis()
        price_analysis = self.get_price_analysis()
        rating_analysis = self.get_rating_analysis()
        sales_analysis = self.get_sales_analysis()
        inventory_analysis = self.get_inventory_analysis()
        
        # Product insights
        if product_stats['average_rating'] >= 4.0:
            insights.append("🌟 Excellent! Your products have a high average rating.")
        elif product_stats['average_rating'] >= 3.5:
            insights.append("👍 Good product ratings overall, but there's room for improvement.")
        else:
            insights.append("⚠️ Consider improving product quality - ratings are below average.")
        
        # Category insights
        if category_analysis:
            best_category = max(category_analysis.items(), key=lambda x: x[1]['average_rating'])
            insights.append(f"🏆 '{best_category[0]}' category has the highest average rating ({best_category[1]['average_rating']}).")
            
            most_products = max(category_analysis.items(), key=lambda x: x[1]['count'])
            insights.append(f"📊 '{most_products[0]}' category has the most products ({most_products[1]['count']}).")
        
        # Price insights
        if price_analysis:
            if price_analysis['price_ranges']['under_25'] > len(self.products) * 0.5:
                insights.append("💰 Most of your products are budget-friendly (under $25).")
            elif price_analysis['price_ranges']['over_100'] > len(self.products) * 0.3:
                insights.append("💎 You have a significant number of premium products (over $100).")
        
        # Inventory insights
        if inventory_analysis['low_stock_count'] > 0:
            insights.append(f"📦 {inventory_analysis['low_stock_count']} products are running low on stock.")
        
        if inventory_analysis['out_of_stock_count'] > 0:
            insights.append(f"❌ {inventory_analysis['out_of_stock_count']} products are out of stock.")
        
        # Sales insights
        if sales_analysis['total_orders'] > 0:
            insights.append(f"💵 Total revenue: ${sales_analysis['total_revenue']:.2f} from {sales_analysis['total_orders']} orders.")
            insights.append(f"📈 Average order value: ${sales_analysis['average_order_value']:.2f}")
        else:
            insights.append("📊 No sales data available yet.")
        
        return insights
    
    def create_visualizations(self, output_dir=None):
        """Create data visualizations"""
        if output_dir is None:
            output_dir = self.data_dir / '../reports'
        else:
            output_dir = Path(output_dir)
        
        output_dir.mkdir(exist_ok=True)
        
        # Set up the plotting style
        plt.style.use('default')
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle('E-commerce Analytics Dashboard', fontsize=16, fontweight='bold')
        
        # 1. Category Distribution
        category_analysis = self.get_category_analysis()
        if category_analysis:
            categories = list(category_analysis.keys())
            counts = [stats['count'] for stats in category_analysis.values()]
            
            ax1.bar(categories, counts, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'])
            ax1.set_title('Products by Category')
            ax1.set_xlabel('Category')
            ax1.set_ylabel('Number of Products')
            plt.setp(ax1.get_xticklabels(), rotation=45, ha='right')
        
        # 2. Price Distribution
        price_analysis = self.get_price_analysis()
        if price_analysis and 'price_ranges' in price_analysis:
            ranges = list(price_analysis['price_ranges'].keys())
            values = list(price_analysis['price_ranges'].values())
            
            ax2.pie(values, labels=ranges, autopct='%1.1f%%', startangle=90)
            ax2.set_title('Price Distribution')
        
        # 3. Rating Distribution
        rating_analysis = self.get_rating_analysis()
        if rating_analysis and 'rating_distribution' in rating_analysis:
            ratings = list(rating_analysis['rating_distribution'].keys())
            counts = list(rating_analysis['rating_distribution'].values())
            
            colors = ['#FF6B6B', '#FFA07A', '#FFD700', '#98FB98', '#90EE90']
            ax3.bar(ratings, counts, color=colors)
            ax3.set_title('Rating Distribution')
            ax3.set_xlabel('Rating Range')
            ax3.set_ylabel('Number of Products')
        
        # 4. Monthly Revenue (if sales data exists)
        sales_analysis = self.get_sales_analysis()
        if sales_analysis['monthly_revenue']:
            months = sorted(sales_analysis['monthly_revenue'].keys())
            revenues = [sales_analysis['monthly_revenue'][month] for month in months]
            
            ax4.plot(months, revenues, marker='o', linestyle='-', color='#45B7D1')
            ax4.set_title('Monthly Revenue')
            ax4.set_xlabel('Month')
            ax4.set_ylabel('Revenue ($)')
            plt.setp(ax4.get_xticklabels(), rotation=45, ha='right')
        else:
            ax4.text(0.5, 0.5, 'No sales data available', ha='center', va='center', transform=ax4.transAxes)
            ax4.set_title('Monthly Revenue')
        
        plt.tight_layout()
        
        # Save the plot
        output_file = output_dir / 'ecommerce_analytics.png'
        plt.savefig(output_file, dpi=300, bbox_inches='tight')
        print(f"Visualizations saved to: {output_file}")
        
        plt.close()
    
    def generate_report(self, output_file=None):
        """Generate a comprehensive analytics report"""
        product_stats = self.get_product_stats()
        category_analysis = self.get_category_analysis()
        price_analysis = self.get_price_analysis()
        rating_analysis = self.get_rating_analysis()
        sales_analysis = self.get_sales_analysis()
        inventory_analysis = self.get_inventory_analysis()
        insights = self.generate_insights()
        top_products = self.get_top_products(5, 'rating')
        
        report = f"""
# E-commerce Analytics Report
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Product Overview
- Total Products: {product_stats['total_products']}
- Average Price: ${product_stats['average_price']}
- Average Rating: {product_stats['average_rating']}/5.0
- In Stock: {product_stats['in_stock_count']}
- Out of Stock: {product_stats['out_of_stock_count']}
- Featured Products: {product_stats['featured_count']}

## Category Analysis
"""
        
        for category, stats in category_analysis.items():
            report += f"""
### {category.title()}
- Products: {stats['count']}
- Average Price: ${stats['average_price']}
- Average Rating: {stats['average_rating']}/5.0
- Total Reviews: {stats['total_reviews']}
"""
        
        report += f"""
## Price Analysis
- Price Range: ${price_analysis.get('min_price', 0):.2f} - ${price_analysis.get('max_price', 0):.2f}
- Median Price: ${price_analysis.get('median_price', 0):.2f}

### Price Distribution:
"""
        
        if 'price_ranges' in price_analysis:
            for range_name, count in price_analysis['price_ranges'].items():
                report += f"- {range_name.replace('_', ' ').title()}: {count} products\n"
        
        report += f"""
## Rating Analysis
- Average Rating: {rating_analysis.get('average_rating', 0)}/5.0
- Median Rating: {rating_analysis.get('median_rating', 0)}/5.0

### Rating Distribution:
"""
        
        if 'rating_distribution' in rating_analysis:
            for rating, count in rating_analysis['rating_distribution'].items():
                report += f"- {rating.replace('_', ' ').title()}: {count} products\n"
        
        report += f"""
## Sales Analysis
- Total Orders: {sales_analysis['total_orders']}
- Total Revenue: ${sales_analysis['total_revenue']}
- Average Order Value: ${sales_analysis['average_order_value']}

## Inventory Analysis
- Total Stock Value: ${inventory_analysis.get('total_stock_value', 0):.2f}
- Total Stock Units: {inventory_analysis.get('total_stock_units', 0)}
- Low Stock Products: {inventory_analysis.get('low_stock_count', 0)}
- Out of Stock Products: {inventory_analysis.get('out_of_stock_count', 0)}

## Top Rated Products
"""
        
        for i, product in enumerate(top_products, 1):
            report += f"{i}. {product['name']} - {product.get('rating', 0)}/5.0 ({product.get('reviews', 0)} reviews)\n"
        
        report += "\n## Business Insights\n"
        for insight in insights:
            report += f"- {insight}\n"
        
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report)
            print(f"Report saved to: {output_file}")
        else:
            print(report)
        
        return report
    
    def export_to_csv(self, output_dir=None):
        """Export data to CSV files"""
        if output_dir is None:
            output_dir = self.data_dir / '../reports'
        else:
            output_dir = Path(output_dir)
        
        output_dir.mkdir(exist_ok=True)
        
        # Export products
        if self.products:
            df_products = pd.DataFrame(self.products)
            products_file = output_dir / 'products_export.csv'
            df_products.to_csv(products_file, index=False)
            print(f"Products exported to: {products_file}")
        
        # Export orders
        if self.orders:
            df_orders = pd.DataFrame(self.orders)
            orders_file = output_dir / 'orders_export.csv'
            df_orders.to_csv(orders_file, index=False)
            print(f"Orders exported to: {orders_file}")
        
        # Export categories
        if self.categories:
            df_categories = pd.DataFrame(self.categories)
            categories_file = output_dir / 'categories_export.csv'
            df_categories.to_csv(categories_file, index=False)
            print(f"Categories exported to: {categories_file}")

def main():
    """Main function for command-line usage"""
    analytics = EcommerceAnalytics()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'report':
            output_file = sys.argv[2] if len(sys.argv) > 2 else None
            analytics.generate_report(output_file)
        
        elif command == 'visualize':
            output_dir = sys.argv[2] if len(sys.argv) > 2 else None
            analytics.create_visualizations(output_dir)
        
        elif command == 'export':
            output_dir = sys.argv[2] if len(sys.argv) > 2 else None
            analytics.export_to_csv(output_dir)
        
        elif command == 'insights':
            insights = analytics.generate_insights()
            print("Business Insights:")
            print("=" * 20)
            for insight in insights:
                print(f"  {insight}")
        
        else:
            print("Unknown command. Available commands: report, visualize, export, insights")
    
    else:
        # Default: show basic stats
        print("E-commerce Analytics")
        print("=" * 20)
        stats = analytics.get_product_stats()
        for key, value in stats.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
        
        print("\nBusiness Insights:")
        insights = analytics.generate_insights()
        for insight in insights:
            print(f"  {insight}")

if __name__ == "__main__":
    main()

