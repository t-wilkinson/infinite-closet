context('Checkout', () => {
  beforeEach(() => {
    cy.login()
  })

  it('user can add to cart', function () {
    const user = this.currentUser
    cy.visit('/')
  })
})
