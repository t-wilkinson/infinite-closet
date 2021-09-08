const product = {
  designer: 'gaala',
  slug: 'aimee',
}

context('Add To Cart', () => {
  it.skip('Can select product', () => {
    cy.login()
    cy.visit('/products/clothing')

    cy.get('a[href*="/shop/"]').first().click()
    cy.location('pathname').should('contain', '/shop/')
  })

  it('Can add to cart', function () {
    cy.login()
    cy.visit(`/shop/${product.designer}/${product.slug}`)

    // Select date
    cy.get('button[aria-label="Date selector"]').click()
    cy.get('button[aria-label="Date"]:not(:disabled)').first().click()

    cy.contains('Add to Cart').click()
  })

  it.skip('Can view cart', () => {
    cy.login()
    cy.visit('/user/checkout')
  })
})
