# Gift Cards

## Summary
- People should be able to buy gift cards for themselves and others

## Concerns
- Ensure each purchase corresponds to a single gift card
    - The code can be generated from the clientsecret of the purchase
- Giftcard code must be computationally secure
    - 1 code /machine / 10s
    - 10e5 machines (2^10 concurrent connections)
    - 10e4 codes /s ~ 2^13
    - 5-length base64 == 2^6^5 / 2^13
    - 5-length base58 == 2^6^6 / 2^7 (for concurrent connections) == 2^48
        - 2^48 / (60 * 60 * 24 * 365) == 2^24

## Implementation
? How to attach orders to gift card
- Fields
    - amount
    - used : quickly check if giftcard is used up
    - code
    - paymentIntent : field used to validate giftcard has been payed for
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
- purchase()
    - validate the

## Test
- Frontend interface works
- Generating a code works
- Calculating amount of gift card before/after purchase works
- Validate that giftcard code is correct
