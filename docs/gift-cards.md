# Gift Cards

## Summary
- People should be able to buy gift cards for themselves and others

## Implementation
? How to attach orders to gift card
- Fields
    - amount
    - used : quickly check if giftcard is used up
    - code
    - orders
        - id
        - amount_used
- amount() : gift_card_code -> number
    - Calculates amount left of gift card
- checkout()
    - reduce amount of gift_card OR use dynamically calculate amount of giftcard
- generate()
    - create a uid
- summary()
    - should also use gift cards

