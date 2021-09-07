context('User', () => {
  it.skip('can register', () => {
    const user = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'info+test@infinitecloset.co.uk',
      password: 'asdfasdf!',
    }
    const fields = ['firstName', 'lastName', 'email', 'password']
    cy.task('db:clear:users')

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

  it.skip('localStorage', () => {
    cy.window()
      .its('localStorage')
      .then((storage) => {
        console.log(
          storage.getItem('cart'),
          storage.getItem('logged-in'),
          storage.getItem('cart-used'),
          storage.getItem('cookie-consent')
        )
      })
  })
})
