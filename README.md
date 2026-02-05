# Infinite Closet E-Commerce Platform

This repository showcases the e-commerce platform I built for Infinite Closet, a clothing rental startup. This project demonstrates my full-stack development expertise and ability to manage the entire development lifecycle.

## Overview

**Technologies:**

- Frontend: ReactJS, NextJS, TailwindCSS
- Backend: Node.js (Express.js), Strapi (CMS), NGINX
- Database: PostgreSQL
- DevOps: Docker, Docker Compose, CI/CD (GitHub Actions)
- Other: Stripe (Payments), Cypress & Jest (Testing), Google Workspace (Email)

**Key Features:**

- User Accounts & Dashboard: Manage profiles, upload receipts/clothing pictures.
- Admin Panel: Non-technical friendly interface for managing website content.
- Advanced Search & Filtering: Sophisticated search and filtering options for clothing items.
- Date Selection & Booking: Integrate with delivery providers for accurate date selection and booking.
- Transactional Emails: Automated emails for order updates, reminders, and reviews.
- Partnership Integrations: Seamless integration with third-party services (Hived, ACS, Bloomino).

**Highlights:**

- Full-Stack Development: Owned the entire development process, from backend architecture to frontend UI.
- Database Management: Designed and managed the PostgreSQL database for efficient data storage.
- Scalable Infrastructure: Utilized Docker and CI/CD for automated deployments and a scalable architecture.
- Effective Communication: Collaborated effectively with non-technical stakeholders during meetings.
- Client-Centric Approach: Successfully migrated client's website and domain, prioritizing user experience.
- Secure Development: Implemented secure password practices and data sharing protocols.
- Automated Testing: Established automated testing pipelines using Cypress and Jest.
- Project Management: Utilized Trello for project organization and Figma for design collaboration.

**Codebase:**

- Clean, well-commented code with a focus on maintainability.
- Descriptive Git commits for clear code versioning.
- Modular and organized code structure for easy navigation.

Lines of Code: 35,000+

**This project demonstrates my ability to:**

- Build robust and scalable e-commerce platforms.
- Work effectively in a full-stack development environment.
- Manage databases and server infrastructure.
- Implement automated workflows for efficient development.
- Collaborate and communicate effectively with diverse stakeholders.

**For Recruiters:**

This project is a testament to my skills and experience as a full-stack developer. I am eager to leverage my expertise to contribute to innovative and challenging projects.

Feel free to contact me to discuss this project or my qualifications further.

## Requirements to run

- [docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/install/)

```bash
git clone https://github.com/t-wilkinson/infinite-closet
cd infinite-closet

(cd frontend && yarn install)
(cd backend && yarn install)

scripts/run local up

# You MAY have to run
echo "127.0.0.1 backend" | sudo tee -a /etc/hosts to facilate communication between frontend and backend

```

Visit http://127.0.0.1:3001 and visit static pages

**To visit shop pages:**

1. Visit http://127.0.0.1:8000/admin
2. Create admin account
3. Go to Settings > Users & Permissions Plugin > Roles > Public > Edit
4. Give all permissions to public role so the frontend can pull information

Done!
