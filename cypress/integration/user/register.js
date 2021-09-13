context('Register', () => {
  it.skip('can register', () => {
    const user = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'info+test@infinitecloset.co.uk',
      password: 'asdfasdf!',
    }
    const fields = ['firstName', 'lastName', 'email', 'password']
    cy.task('users:clear')

    cy.visit('/account/register?redir=/')
    fields.forEach((field) => {
      cy.get(`input[name=${field}]`).type(user[field])
    })

    cy.intercept('POST', '/auth/local/register').as('register')
    cy.get('button[type=submit]').click()
    cy.wait('@register')

    cy.getCookie('token').its('value').should('not.be.empty')
    cy.location('pathname').should('eq', '/')
  })
})
