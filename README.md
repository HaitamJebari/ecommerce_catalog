# E-commerce Product Catalog

A modern, responsive e-commerce product catalog with shopping cart functionality. Built with HTML, CSS, JavaScript, Bootstrap, PHP, and Python for a complete full-stack experience.

## Features

### Frontend Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Product Catalog**: Browse products with high-quality images and detailed information
- **Advanced Search**: Search products by name, description, or category
- **Smart Filtering**: Filter by category, price range, and customer ratings
- **Product Sorting**: Sort by name, price (low to high, high to low), and rating
- **Shopping Cart**: Add, remove, and modify quantities with persistent storage
- **Product Modal**: Quick view with detailed product information
- **Pagination**: Efficient browsing of large product catalogs
- **Category Pages**: Browse products by specific categories
- **Price Calculation**: Automatic subtotal, shipping, tax, and total calculation

### Backend Features
- **RESTful API**: Complete CRUD operations for products and orders
- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products into categories
- **Order Processing**: Handle customer orders and order history
- **Data Validation**: Server-side validation for all inputs
- **Analytics API**: Comprehensive business analytics and reporting
- **JSON Storage**: Lightweight file-based data storage
- **CORS Support**: Cross-origin resource sharing for frontend integration

### Analytics Features
- **Sales Analytics**: Revenue tracking and order analysis
- **Product Performance**: Rating and review analysis
- **Inventory Management**: Stock level monitoring and alerts
- **Category Insights**: Performance analysis by product category
- **Price Analysis**: Price distribution and optimization insights
- **Data Visualization**: Charts and graphs for business metrics
- **Export Functionality**: CSV export for external analysis
- **Business Intelligence**: Automated insights and recommendations

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: PHP 7.4+
- **Analytics**: Python 3.8+
- **Storage**: JSON files
- **Icons**: Font Awesome 6
- **Charts**: Matplotlib, Pandas (Python)
- **Images**: Unsplash API for sample product images

## Project Structure

```
ecommerce-catalog/
├── frontend/
│   ├── index.html          # Main application interface
│   ├── style.css           # Custom styles and responsive design
│   └── script.js           # Frontend JavaScript logic
├── backend/
│   ├── api.php             # PHP REST API
│   └── ecommerce_analytics.py # Python analytics module
├── database/
│   ├── products.json       # Product data (auto-created)
│   ├── categories.json     # Category data (auto-created)
│   └── orders.json         # Order data (auto-created)
├── assets/
│   └── images/             # Product images directory
├── reports/                # Generated reports (auto-created)
└── README.md               # This file
```

## Installation & Setup

### Prerequisites
- Web server with PHP support (Apache, Nginx, or built-in PHP server)
- PHP 7.4 or higher
- Python 3.8+ (for analytics features)
- Modern web browser

### Quick Start

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd ecommerce-catalog
   ```

2. **Start the PHP development server**
   ```bash
   cd backend
   php -S localhost:8000
   ```

3. **Open the application**
   - Open `frontend/index.html` in your web browser
   - Or serve the frontend through a web server

4. **For analytics features (optional)**
   ```bash
   pip install matplotlib pandas numpy
   python backend/ecommerce_analytics.py
   ```

### Production Setup

1. **Web Server Configuration**
   - Upload files to your web server
   - Ensure PHP is enabled and configured
   - Set proper permissions for the `database/` directory (755)

2. **API Configuration**
   - Update API endpoints in `script.js` if needed
   - Configure CORS settings in `api.php` for your domain

3. **Security Considerations**
   - Use HTTPS in production
   - Implement proper authentication for admin features
   - Validate and sanitize all user inputs
   - Set appropriate file permissions

## Usage

### Customer Features

1. **Browsing Products**
   - View all products on the main page
   - Use search bar to find specific products
   - Filter by category, price range, or rating
   - Sort products by various criteria

2. **Product Details**
   - Click on any product card to view details
   - See product images, descriptions, ratings, and reviews
   - Add products to cart with desired quantity

3. **Shopping Cart**
   - View cart contents and modify quantities
   - See automatic price calculations
   - Proceed to checkout (demo functionality)

4. **Category Browsing**
   - Navigate to Categories section
   - Click on category cards to filter products

### API Usage

The PHP backend provides a comprehensive RESTful API:

```bash
# Get all products
GET /api.php/products

# Get products with filters
GET /api.php/products?category=electronics&minPrice=50&maxPrice=200

# Get specific product
GET /api.php/products?id=1

# Create new product (admin)
POST /api.php/products
Content-Type: application/json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "image": "image_url",
  "stock": 100
}

# Update product (admin)
PUT /api.php/products?id=1
Content-Type: application/json
{
  "name": "Updated Name",
  "price": 89.99
}

# Delete product (admin)
DELETE /api.php/products?id=1

# Get all categories
GET /api.php/categories

# Create order
POST /api.php/orders
Content-Type: application/json
{
  "items": [{"id": 1, "quantity": 2}],
  "total": 199.98,
  "customerInfo": {...}
}

# Get analytics
GET /api.php/analytics
```

### Analytics Features

The Python analytics module provides advanced insights:

```bash
# Generate comprehensive report
python ecommerce_analytics.py report [output_file.md]

# Create data visualizations
python ecommerce_analytics.py visualize [output_directory]

# Export data to CSV
python ecommerce_analytics.py export [output_directory]

# Show business insights
python ecommerce_analytics.py insights
```

## Customization

### Adding New Products
- Use the API to add products programmatically
- Or manually edit the `database/products.json` file
- Include proper product images and descriptions

### Styling Customization
- Modify `frontend/style.css` for visual changes
- Update CSS custom properties for theme colors
- Customize Bootstrap components as needed

### Functionality Extensions
- Add user authentication and accounts
- Implement payment processing
- Add product reviews and ratings system
- Create admin dashboard for product management

### Data Storage
- Currently uses JSON files for simplicity
- Can be easily modified to use databases (MySQL, PostgreSQL)
- Update the API classes to use different storage backends

## Sample Data

The application includes sample data for demonstration:
- 12 sample products across 4 categories
- Electronics, Clothing, Home & Garden, Books
- Realistic product information with images from Unsplash
- Sample categories with descriptions and images

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Lazy loading for product images
- Efficient pagination for large catalogs
- Client-side caching using localStorage
- Optimized API responses with minimal data transfer
- Responsive images for different screen sizes

## Security Features

- Input validation on both client and server side
- XSS protection through proper data sanitization
- CSRF protection can be added for production
- Secure file handling and permissions
- API rate limiting can be implemented

## Testing

### Manual Testing
1. Open the application in different browsers
2. Test responsive design on various screen sizes
3. Verify all CRUD operations work correctly
4. Test search and filtering functionality
5. Validate shopping cart operations

### API Testing
```bash
# Test product retrieval
curl -X GET "http://localhost:8000/api.php/products"

# Test product creation
curl -X POST "http://localhost:8000/api.php/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":29.99,"category":"electronics"}'
```

## Deployment Options

### Shared Hosting
- Upload files via FTP/SFTP
- Ensure PHP is available
- Set proper file permissions

### VPS/Dedicated Server
- Use Apache or Nginx as web server
- Configure PHP-FPM for better performance
- Set up SSL certificates

### Cloud Platforms
- Deploy to AWS, Google Cloud, or Azure
- Use cloud databases for scalability
- Implement CDN for static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
- Check the documentation
- Review the code comments
- Create an issue in the repository

## Future Enhancements

- User authentication and profiles
- Advanced product recommendations
- Real-time inventory updates
- Multi-language support
- Advanced analytics dashboard
- Mobile app version
- Integration with payment gateways
- Automated testing suite
- Performance monitoring
- SEO optimization

