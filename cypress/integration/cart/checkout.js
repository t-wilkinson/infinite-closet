context('Checkout', () => {
  beforeEach(() => {
    cy.task('db:clear:users')

    cy.request('POST', 'http://api.ic.com/auth/local', {
      identifier: 'info+test@infinitecloset.co.uk',
      password: 'asdfasdf!',
    })
      .its('body.user')
      .as('currentUser')
  })

  it('user can add to cart', function () {
    const user = this.currentUser
    cy.visit('/')
    console.log(user)
  })
})
