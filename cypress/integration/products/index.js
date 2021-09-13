context('Products', () => {
  it.skip('Can select product', () => {
    cy.login()
    cy.visit('/products/clothing')

    cy.get('a[href*="/shop/"]').first().click()
    cy.location('pathname').should('contain', '/shop/')
  })
})
