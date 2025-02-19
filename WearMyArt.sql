-- User Table
CREATE TABLE Users (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    isVerified BOOLEAN DEFAULT FALSE,
    isAdmin BOOLEAN DEFAULT FALSE,
    OTP INT NOT NULL,
    OTPExpiry DATETIME
);

-- Product Table
CREATE TABLE Products (
    ProductId INT PRIMARY KEY AUTO_INCREMENT,
    ImgURL VARCHAR(255),
    Size ENUM('XXL', 'XL', 'L', 'M', 'S') NOT NULL,
    Cost DECIMAL(10, 2) NOT NULL,
    Sleeve ENUM('full sleeve', 'half sleeve', 'sleeveless') NOT NULL,
    Stock INT NOT NULL,
    Color VARCHAR(100) NOT NULL,
    CustomizeOption ENUM('Photo', 'Text', 'Both') NOT NULL
);

-- Customization Options Table
CREATE TABLE CustomizationOptions (
    CustomizationOptionId INT PRIMARY KEY AUTO_INCREMENT,
    FontOptions TEXT,
    TextStyles TEXT
);

-- Order Table
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY AUTO_INCREMENT,
    ProductId INT,
    CustomerId INT,
    CustomerImg VARCHAR(255),
    Font VARCHAR(255),
    FontSize INT,
    Text VARCHAR(255),
    Color VARCHAR(100),
    FinalProductImg VARCHAR(255),
    Quantity INT DEFAULT 1,
    FinalCost DECIMAL(10, 2) NOT NULL,
    Status ENUM('Process', 'Ready', 'Shipped', 'Completed') DEFAULT 'Process',
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    FOREIGN KEY (CustomerId) REFERENCES Users(UserId)
);
