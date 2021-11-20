# Shipping
Rentals need to be shipped somehow, this handles api integration and similar functionality.

## Context
Handles shipping related services such as:
- Calculate expected time per shipping stage
- Provide an interface with shipping provider api
- Confirm which addresses can be shipped to

A solid shipping api is core to the rental shipping business model.

## Testing
- Rigorously test the timing library (every edge case)
- Ensure all implementations have the same methods

## Monitoring
- Any failure of user-facing api

## Alerting
- Any failure to ship should be alerted

## Security
- Protect api keys and api integration from public

## Implementation
- How do we support multiple potential providers?
    - Make a class and implement multiple times in sub-folder. Then export one of the implementations.
- Separate sub-module per implementation
- Must support the stages of a normal rental life-cycle
    - Warehouse -> Customer -> Cleaner -> Warehouse
    - We can decompose the lifecycles, individually assign to a provider, then compose them
- Identify addresses which can be sent to
- Specify timing of each lifecycle transition (both prediction and actual for existing orders)
    - Notion of available and not-available shipping days
    - Cutoff date?
- Have unique shipping identification
- Notion of shipping class with a 'best' default shipping class
- Default configuration and values
- Map database address to internal representation

### ACS api
- What are the shipping classes?
- What shipper are we using?
- dates must be YYYY-MM-DD
- What are our api keys?
- Product setup
    - Every garment added to stock must be sent to ACS. To do this refactor the facebook shop controller for products
    - One row for each stock item
    - Must include:
        - Garment Name/Description
        - Supplier (designer)
        - Garment Type
        - Size
        - Product SKU
        - Unique SKU
    - How to add/remove products after initialization?
- Order creation
    - Uses *PUT* for both order creation and modification
    - Use order.id for *OrderNumber*
    - Endpoints:
        - https://partnerapis.acsclothing.co.uk/api/v1/orders/{ordernumber}
        - https://uat-partnerapis.acsclothing.co.uk/api/v1/orders/{ordernumber}
    - API headers
        - Content-Type: application/json
        - Auth: Basic Auth
    - Content
        - See API specification
- Order status?
    - Assume *GET* of order creation endpoint
- Create an order on checkout (instead of running a script through cron)
