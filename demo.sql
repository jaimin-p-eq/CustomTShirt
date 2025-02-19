-- Create Users Table
CREATE TABLE Users (
  userID INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  role ENUM('Admin', 'Customer') DEFAULT 'Customer',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Animals Table
CREATE TABLE Animals (
  animalID INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  age INT,
  description TEXT,
  imageURLs TEXT, -- Can store URLs in JSON format
  stockQuantity INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE Orders (
  orderID INT PRIMARY KEY AUTO_INCREMENT,
  userID INT NOT NULL,
  orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pending', 'Shipped', 'Delivered') DEFAULT 'Pending',
  totalAmount DECIMAL(10, 2) NOT NULL,
  shippingAddress TEXT,
  paymentStatus ENUM('Paid', 'Pending') DEFAULT 'Pending',
  FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
  orderItemID INT PRIMARY KEY AUTO_INCREMENT,
  orderID INT NOT NULL,
  animalID INT NOT NULL,
  quantity INT NOT NULL,
  priceAtPurchase DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
  FOREIGN KEY (animalID) REFERENCES Animals(animalID) ON DELETE CASCADE
);

-- Create Cart Table
CREATE TABLE Carts (
  cartID INT PRIMARY KEY AUTO_INCREMENT,
  userID INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

-- Create CartItems Table
CREATE TABLE CartItems (
  cartItemID INT PRIMARY KEY AUTO_INCREMENT,
  cartID INT NOT NULL,
  animalID INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (cartID) REFERENCES Carts(cartID) ON DELETE CASCADE,
  FOREIGN KEY (animalID) REFERENCES Animals(animalID) ON DELETE CASCADE
);

-- Create Reviews Table
CREATE TABLE Reviews (
  reviewID INT PRIMARY KEY AUTO_INCREMENT,
  userID INT NOT NULL,
  animalID INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
  FOREIGN KEY (animalID) REFERENCES Animals(animalID) ON DELETE CASCADE
);

-- Create Admin Table
CREATE TABLE Admins (
  adminID INT PRIMARY KEY AUTO_INCREMENT,
  userID INT NOT NULL,
  role ENUM('Admin') DEFAULT 'Admin',
  permissions TEXT, -- Stores JSON of permissions granted to Admin
  FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

-- Create DiscountCodes Table
CREATE TABLE DiscountCodes (
  discountCodeID INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  discountPercentage DECIMAL(5, 2) NOT NULL,
  validFrom TIMESTAMP,
  validUntil TIMESTAMP,
  minPurchaseAmount DECIMAL(10, 2) NOT NULL
);

-- Create Notifications Table
CREATE TABLE Notifications (
  notificationID INT PRIMARY KEY AUTO_INCREMENT,
  userID INT NOT NULL,
  message TEXT NOT NULL,
  sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);