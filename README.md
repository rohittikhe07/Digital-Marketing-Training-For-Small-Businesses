# Dukaan Digital - Digital Marketing Training for Small Businesses

A website that teaches small shop owners digital marketing with video, audio and picture lessons.
It has learner login, an admin (teacher) portal, quizzes, practical tools, and a certificate generator.

## How to run
1. Unzip the folder.
2. Double-click `index.html` (Chrome or Edge recommended). No installation needed.
3. Keep an internet connection on for the fonts. The site still works without it.

## Demo accounts
| Role | Email | Password |
|------|-------|----------|
| Admin (teacher) | admin@cep.local | Admin@123 |
| Learner | Register a new account on the login page | your own |

Change the admin password in **Admin portal -> Settings** after the first login.

## Project structure (easy to explain)
```
index.html          the one page; loads everything below
css/style.css       colours, fonts and layout (change the look in :root)
js/core.js          small helpers: icons, pop-ups, messages
js/data.js          the COURSE CONTENT: 6 lessons, quiz questions, business examples
js/store.js         the DATABASE: accounts, login, progress, certificates (saved in the browser)
js/certificate.js   draws the certificate, saves PNG, prints/PDF
js/lessons.js       lesson pages: Watch (video), Listen (audio), See (picture), Quiz
js/tools.js         post planner, ad budget calculator, 30-day checklist
js/admin.js         the Admin portal
js/app.js           the main controller: login page, dashboard, certificate page, pop-ups
```

## What each user can do
**Learner:** register, log in, learn 6 lessons, pass quizzes, use tools, fill the certificate form, download the certificate (PNG or PDF), verify certificates.
**Admin:** see totals and lesson completion, search learners, view each learner's progress, reset progress, set a new password, make someone admin, delete accounts, download learners as CSV, view/revoke/reinstate certificates, change certificate details, download or restore a backup.

## How login works
1. On registration the site creates a random salt and turns the password into a scrambled value (PBKDF2 hash). Only the scrambled value is stored, never the real password.
2. On login the same steps are repeated and the two values are compared.
3. Five wrong tries lock that email for one minute.
4. The logged-in user's id is kept in the browser so a refresh does not log them out.

## How the certificate works
1. Learner finishes the required lessons (the admin chooses how many in Settings).
2. Learner fills in name, business or institute, city and batch.
3. The site makes a unique ID like `DD-2026-AB12CD` and draws the certificate.
4. Download as a PNG picture, or use Print and choose "Save as PDF".
5. Anyone can check an ID with **Verify a certificate**. The admin can revoke a certificate.

## Where data is stored
In the browser's `localStorage` (keys starting with `dukaan-digital-`). Nothing is sent to a server.

## Suggested 5-minute demo for your teacher
1. Open the site and show the login page. Click **Project guide** to show the explanation.
2. Register a learner. Show the dashboard.
3. Open Lesson 1: play the video, turn the Voice on, open Listen and See, then take the quiz.
4. Open **Tools** and show the post planner and budget calculator.
5. Log in as admin, open **Admin portal**, click **Learners** -> **View** -> **Mark all lessons complete (demo)**.
6. Log in as the learner again, open **Certificate**, fill the form, generate and download it.
7. Show **Verify a certificate** with the ID, then revoke it from the admin portal and verify again.

## Honest limits (good to mention to your teacher)
- Data is saved per browser and per computer, so the admin only sees learners who registered in the same browser. Use Settings -> Download backup to move data.
- With no server, a technical person could edit the browser's data. A real launch needs a backend.
- Next step for a real launch: replace `js/store.js` with Firebase or Supabase. The screens stay the same.
- Voice reading depends on the voices installed on the device.
