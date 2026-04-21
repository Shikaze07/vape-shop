# Vape-Shop System Architecture

### Figure 1: Class Diagram

The diagram represents the system’s structure and relationships between the administrative users and the inventory management components of the Vape Shop. The **Admin** serves as the primary role, responsible for managing product metadata, stock levels, and session security (login/logout). The system architecture centers around the lifecycle of a sale, from product management to the final billing and payment processing.

The **Product** class contains details of inventory items, including cost and selling prices, quantities, and reorder points. When a sale is processed, the system creates **Transaction** records that capture the exact state of products at the time of purchase, grouped under a **Billing** session. This session is finalized through **Payment** entries (using methods like Cash or GCash), ensuring clear financial tracking and automated reporting. Overall, the diagram shows how the system efficiently manages inventory, sales, and financial records for the vape shop.

---

### Downloadable Image
![Vape Shop Class Diagram](file:///C:/Users/Marcos/.gemini/antigravity/brain/eaf0bd1c-bfe0-4c2e-884a-886722c4d749/vape_shop_class_diagram_1776535602578.png)

*You can right-click the image above and select "Save Image As..." to download it with a clear white background.*

---

### Technical Mermaid Schema
```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#000000',
    'lineColor': '#333333',
    'secondaryColor': '#f4f4f4',
    'tertiaryColor': '#ffffff',
    'mainBkg': '#ffffff',
    'nodeBkg': '#ffffff',
    'nodeBorder': '#000000',
    'clusterBkg': '#ffffff',
    'clusterBorder': '#000000',
    'defaultLabelBackground': '#ffffff'
  }
}}%%
classDiagram
    class Admin {
        +Int AdminID
        +String username
        +String password
        +login(formData)
        +logout()
        +updateAccount(formData)
    }

    class Product {
        +Int ProductID
        +String ProductName
        +Decimal CostPrice
        +Decimal SellingPrice
        +Int Quantity
        +Int ReorderPoint
        +DateTime createdAt
        +String PictureURL
        +createProduct(payload)
        +updateProduct(id, payload)
        +deleteProduct(id)
        +uploadImage(file)
    }

    class Billing {
        +Int BillingID
        +String CustomerName
        +Decimal TotalAmount
        +DateTime createdAt
        +processCheckout(details)
        +generateSummary()
    }

    class Transaction {
        +Int TransactionID
        +Int ProductID
        +Int BillingID
        +Int Qty
        +Decimal CostPrice
        +Decimal SellingPrice
        +DateTime createdAt
        +logTransaction(details)
        +fetchRecentSales()
    }

    class Payment {
        +Int PaymentID
        +Int BillingID
        +Decimal Amount
        +Method Method
        +DateTime createdAt
        +recordPayment(details)
    }

    class Method {
        <<enumeration>>
        Cash
        GCash
    }

    Product "1" -- "*" Transaction : managed in
    Billing "1" -- "*" Transaction : groups
    Billing "1" -- "*" Payment : settled by
    Payment "*" -- "1" Method : via
    Admin "1" -- "*" Product : manages
```
