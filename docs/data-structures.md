# Backend core data structures and functions

**Product**
- size[]

**User**
- contact

**Contact**

**Purchase**

**Shipment**

**Order**
- address
- shipment
- contact
- user
- product
- size
- review

**Checkout**
- order[]
- purchase

## Alternatives
- Put insurance, rentalLength, and expectedStart in shipments
    - Shipments should only be created on shipment
    - Putting these values in shipment request potentially confusing data
