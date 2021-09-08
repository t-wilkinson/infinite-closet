context('Sign In', () => {
  it('can signin', () => {
    const user = {
      name: 'info+test@infinitecloset.co.uk',
      password: 'asdfasdf!',
    }
    cy.visit('/account/signin?redir=/')
    cy.get('input[name=email]').type(user.name)
    cy.get('input[name=password]').type(user.password)

    cy.intercept('POST', '/auth/local').as('signin')
    cy.get('button[type=submit]').click()
    cy.wait('@signin')
    cy.location('pathname').should('eq', '/')
  })
})
