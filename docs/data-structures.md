# Core data structures

## Implementation

- Most below data structures should include a contact, which itself would hold a user

**User**
+ Contact

**Contact**
- Anywhere mailchimp api is interacted with
- Most email templates should take a contact
+ email
+ firstName
+ lastName
+ phoneNumber
+ dateOfBirth
+ subscribed
+ metadata
+ User

**Purchase**
+ paymentIntent
+ paymentMethod
+ giftCard
+ charge
+ giftCardDiscount
+ coupon
+ status : success | refunded

**Rental**
+ confirmed
+ shipped
+ start
+ end
+ cleaning
+ completed
+ status : delayed | normal
+ rentalLength
+ insurance
+ shipmentId
+ shippingClass
+ lifecycle()
    - Move rental through its lifecycle

**Order**
+ status : cart | list | shipping | dropped
+ size
+ Product
+ User
+ Contact
+ Review
+ Address
+ Rental

**Checkout**
+ Order[]
+ Address
+ Purchase
+ User
+ Contact

**Cart**
+ price()

## Migration
- Orders -> rentals, purchases, contacts, etc.
? Rename orders table and only migrate cart/list items
