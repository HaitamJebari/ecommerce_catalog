<?php
/**
 * E-commerce Product Catalog - PHP Backend API
 * Provides RESTful API endpoints for product management
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class EcommerceAPI {
    private $productsFile;
    private $categoriesFile;
    private $ordersFile;
    
    public function __construct() {
        $this->productsFile = __DIR__ . '/../database/products.json';
        $this->categoriesFile = __DIR__ . '/../database/categories.json';
        $this->ordersFile = __DIR__ . '/../database/orders.json';
        $this->ensureDataFiles();
    }
    
    private function ensureDataFiles() {
        $dir = dirname($this->productsFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        if (!file_exists($this->productsFile)) {
            $this->initializeProducts();
        }
        
        if (!file_exists($this->categoriesFile)) {
            $this->initializeCategories();
        }
        
        if (!file_exists($this->ordersFile)) {
            file_put_contents($this->ordersFile, json_encode([]));
        }
    }
    
    private function initializeProducts() {
        $products = [
            [
                'id' => 1,
                'name' => 'Wireless Bluetooth Headphones',
                'description' => 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
                'price' => 99.99,
                'originalPrice' => 129.99,
                'category' => 'electronics',
                'rating' => 4.5,
                'reviews' => 1250,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
                'inStock' => true,
                'stock' => 50,
                'featured' => true,
                'badges' => ['sale', 'featured'],
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 2,
                'name' => 'Smartphone Case',
                'description' => 'Durable protective case for smartphones with wireless charging compatibility.',
                'price' => 24.99,
                'category' => 'electronics',
                'rating' => 4.2,
                'reviews' => 890,
                'image' => 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop',
                'inStock' => true,
                'stock' => 100,
                'featured' => false,
                'badges' => ['new'],
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 3,
                'name' => 'Cotton T-Shirt',
                'description' => 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
                'price' => 19.99,
                'category' => 'clothing',
                'rating' => 4.0,
                'reviews' => 456,
                'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
                'inStock' => true,
                'stock' => 200,
                'featured' => false,
                'badges' => [],
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ]
        ];
        
        file_put_contents($this->productsFile, json_encode($products, JSON_PRETTY_PRINT));
    }
    
    private function initializeCategories() {
        $categories = [
            [
                'id' => 'electronics',
                'name' => 'Electronics',
                'description' => 'Latest gadgets and electronic devices',
                'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
                'active' => true,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'clothing',
                'name' => 'Clothing & Accessories',
                'description' => 'Fashion and lifestyle products',
                'image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
                'active' => true,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'home',
                'name' => 'Home & Garden',
                'description' => 'Everything for your home and garden',
                'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
                'active' => true,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'books',
                'name' => 'Books',
                'description' => 'Educational and entertainment books',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                'active' => true,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ]
        ];
        
        file_put_contents($this->categoriesFile, json_encode($categories, JSON_PRETTY_PRINT));
    }
    
    private function loadData($file) {
        if (!file_exists($file)) {
            return [];
        }
        $data = file_get_contents($file);
        return json_decode($data, true) ?: [];
    }
    
    private function saveData($file, $data) {
        return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    private function generateId() {
        return time() . rand(1000, 9999);
    }
    
    // Product methods
    public function getAllProducts($filters = []) {
        $products = $this->loadData($this->productsFile);
        
        // Apply filters
        if (!empty($filters['category']) && $filters['category'] !== 'all') {
            $products = array_filter($products, function($product) use ($filters) {
                return $product['category'] === $filters['category'];
            });
        }
        
        if (!empty($filters['minPrice'])) {
            $products = array_filter($products, function($product) use ($filters) {
                return $product['price'] >= floatval($filters['minPrice']);
            });
        }
        
        if (!empty($filters['maxPrice'])) {
            $products = array_filter($products, function($product) use ($filters) {
                return $product['price'] <= floatval($filters['maxPrice']);
            });
        }
        
        if (!empty($filters['minRating'])) {
            $products = array_filter($products, function($product) use ($filters) {
                return $product['rating'] >= floatval($filters['minRating']);
            });
        }
        
        if (!empty($filters['search'])) {
            $searchTerm = strtolower($filters['search']);
            $products = array_filter($products, function($product) use ($searchTerm) {
                return strpos(strtolower($product['name']), $searchTerm) !== false ||
                       strpos(strtolower($product['description']), $searchTerm) !== false ||
                       strpos(strtolower($product['category']), $searchTerm) !== false;
            });
        }
        
        // Sort products
        if (!empty($filters['sort'])) {
            switch ($filters['sort']) {
                case 'name':
                    usort($products, function($a, $b) {
                        return strcmp($a['name'], $b['name']);
                    });
                    break;
                case 'price-low':
                    usort($products, function($a, $b) {
                        return $a['price'] <=> $b['price'];
                    });
                    break;
                case 'price-high':
                    usort($products, function($a, $b) {
                        return $b['price'] <=> $a['price'];
                    });
                    break;
                case 'rating':
                    usort($products, function($a, $b) {
                        return $b['rating'] <=> $a['rating'];
                    });
                    break;
            }
        }
        
        return [
            'success' => true,
            'data' => array_values($products),
            'count' => count($products)
        ];
    }
    
    public function getProduct($id) {
        $products = $this->loadData($this->productsFile);
        
        foreach ($products as $product) {
            if ($product['id'] == $id) {
                return [
                    'success' => true,
                    'data' => $product
                ];
            }
        }
        
        return [
            'success' => false,
            'message' => 'Product not found'
        ];
    }
    
    public function createProduct($data) {
        $errors = $this->validateProduct($data);
        if (!empty($errors)) {
            return [
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ];
        }
        
        $products = $this->loadData($this->productsFile);
        
        $product = [
            'id' => intval($this->generateId()),
            'name' => trim($data['name']),
            'description' => trim($data['description']),
            'price' => floatval($data['price']),
            'originalPrice' => isset($data['originalPrice']) ? floatval($data['originalPrice']) : null,
            'category' => $data['category'],
            'rating' => floatval($data['rating'] ?? 0),
            'reviews' => intval($data['reviews'] ?? 0),
            'image' => $data['image'] ?? '',
            'inStock' => boolval($data['inStock'] ?? true),
            'stock' => intval($data['stock'] ?? 0),
            'featured' => boolval($data['featured'] ?? false),
            'badges' => $data['badges'] ?? [],
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        
        $products[] = $product;
        
        if ($this->saveData($this->productsFile, $products)) {
            return [
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to save product'
        ];
    }
    
    public function updateProduct($id, $data) {
        $errors = $this->validateProduct($data);
        if (!empty($errors)) {
            return [
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ];
        }
        
        $products = $this->loadData($this->productsFile);
        
        for ($i = 0; $i < count($products); $i++) {
            if ($products[$i]['id'] == $id) {
                $products[$i]['name'] = trim($data['name']);
                $products[$i]['description'] = trim($data['description']);
                $products[$i]['price'] = floatval($data['price']);
                $products[$i]['originalPrice'] = isset($data['originalPrice']) ? floatval($data['originalPrice']) : null;
                $products[$i]['category'] = $data['category'];
                $products[$i]['rating'] = floatval($data['rating'] ?? $products[$i]['rating']);
                $products[$i]['reviews'] = intval($data['reviews'] ?? $products[$i]['reviews']);
                $products[$i]['image'] = $data['image'] ?? $products[$i]['image'];
                $products[$i]['inStock'] = boolval($data['inStock'] ?? $products[$i]['inStock']);
                $products[$i]['stock'] = intval($data['stock'] ?? $products[$i]['stock']);
                $products[$i]['featured'] = boolval($data['featured'] ?? $products[$i]['featured']);
                $products[$i]['badges'] = $data['badges'] ?? $products[$i]['badges'];
                $products[$i]['updatedAt'] = date('c');
                
                if ($this->saveData($this->productsFile, $products)) {
                    return [
                        'success' => true,
                        'message' => 'Product updated successfully',
                        'data' => $products[$i]
                    ];
                }
                
                return [
                    'success' => false,
                    'message' => 'Failed to save product'
                ];
            }
        }
        
        return [
            'success' => false,
            'message' => 'Product not found'
        ];
    }
    
    public function deleteProduct($id) {
        $products = $this->loadData($this->productsFile);
        $originalCount = count($products);
        
        $products = array_filter($products, function($product) use ($id) {
            return $product['id'] != $id;
        });
        
        if (count($products) < $originalCount) {
            if ($this->saveData($this->productsFile, array_values($products))) {
                return [
                    'success' => true,
                    'message' => 'Product deleted successfully'
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Failed to delete product'
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Product not found'
        ];
    }
    
    private function validateProduct($data) {
        $errors = [];
        
        if (empty($data['name'])) {
            $errors[] = 'Product name is required';
        }
        
        if (empty($data['description'])) {
            $errors[] = 'Product description is required';
        }
        
        if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] <= 0) {
            $errors[] = 'Valid price is required';
        }
        
        if (empty($data['category'])) {
            $errors[] = 'Product category is required';
        }
        
        return $errors;
    }
    
    // Category methods
    public function getAllCategories() {
        $categories = $this->loadData($this->categoriesFile);
        $products = $this->loadData($this->productsFile);
        
        // Add product count to each category
        foreach ($categories as &$category) {
            $category['count'] = count(array_filter($products, function($product) use ($category) {
                return $product['category'] === $category['id'];
            }));
        }
        
        return [
            'success' => true,
            'data' => $categories
        ];
    }
    
    // Order methods
    public function createOrder($data) {
        $errors = $this->validateOrder($data);
        if (!empty($errors)) {
            return [
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ];
        }
        
        $orders = $this->loadData($this->ordersFile);
        
        $order = [
            'id' => $this->generateId(),
            'items' => $data['items'],
            'subtotal' => floatval($data['subtotal']),
            'shipping' => floatval($data['shipping']),
            'tax' => floatval($data['tax']),
            'total' => floatval($data['total']),
            'customerInfo' => $data['customerInfo'] ?? [],
            'status' => 'pending',
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        
        $orders[] = $order;
        
        if ($this->saveData($this->ordersFile, $orders)) {
            return [
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to save order'
        ];
    }
    
    private function validateOrder($data) {
        $errors = [];
        
        if (empty($data['items']) || !is_array($data['items'])) {
            $errors[] = 'Order items are required';
        }
        
        if (!isset($data['total']) || !is_numeric($data['total']) || $data['total'] <= 0) {
            $errors[] = 'Valid order total is required';
        }
        
        return $errors;
    }
    
    // Analytics methods
    public function getAnalytics() {
        $products = $this->loadData($this->productsFile);
        $orders = $this->loadData($this->ordersFile);
        
        $totalProducts = count($products);
        $totalOrders = count($orders);
        $totalRevenue = array_sum(array_column($orders, 'total'));
        
        $categoryStats = [];
        foreach ($products as $product) {
            $category = $product['category'];
            if (!isset($categoryStats[$category])) {
                $categoryStats[$category] = 0;
            }
            $categoryStats[$category]++;
        }
        
        $averageRating = $totalProducts > 0 ? 
            array_sum(array_column($products, 'rating')) / $totalProducts : 0;
        
        return [
            'success' => true,
            'data' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalRevenue' => round($totalRevenue, 2),
                'averageRating' => round($averageRating, 2),
                'categoryStats' => $categoryStats,
                'recentOrders' => array_slice(array_reverse($orders), 0, 10)
            ]
        ];
    }
}

// Initialize API
$api = new EcommerceAPI();

// Get request method and parse URL
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Get the endpoint (last part of path)
$endpoint = end($pathParts);

// Get request data
$input = json_decode(file_get_contents('php://input'), true);
$queryParams = $_GET;

try {
    switch ($method) {
        case 'GET':
            if ($endpoint === 'products' || $endpoint === 'api.php') {
                $response = $api->getAllProducts($queryParams);
            } elseif ($endpoint === 'categories') {
                $response = $api->getAllCategories();
            } elseif ($endpoint === 'analytics') {
                $response = $api->getAnalytics();
            } elseif (isset($queryParams['id'])) {
                $response = $api->getProduct($queryParams['id']);
            } else {
                $response = $api->getAllProducts($queryParams);
            }
            break;
            
        case 'POST':
            if ($endpoint === 'products') {
                $response = $api->createProduct($input);
            } elseif ($endpoint === 'orders') {
                $response = $api->createOrder($input);
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Invalid endpoint for POST request'
                ];
            }
            break;
            
        case 'PUT':
            if ($endpoint === 'products' && isset($queryParams['id'])) {
                $response = $api->updateProduct($queryParams['id'], $input);
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Product ID is required for updates'
                ];
            }
            break;
            
        case 'DELETE':
            if ($endpoint === 'products' && isset($queryParams['id'])) {
                $response = $api->deleteProduct($queryParams['id']);
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Product ID is required for deletion'
                ];
            }
            break;
            
        default:
            $response = [
                'success' => false,
                'message' => 'Method not allowed'
            ];
            http_response_code(405);
            break;
    }
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ];
    http_response_code(500);
}

// Send response
echo json_encode($response, JSON_PRETTY_PRINT);
?>

