# Kawai Expense Tracker

### Why build another expense tracker?

I just wanna practice and imrove my TS, NextJS, React, and Backend skills so why not??

### Features

-   Simple cookie based authentication with login and register server actions
-   Create, update, delete transactions
-   Fully predefined form schemas and custom invalid field messages
-   Authentication checks on private server events
-   Fetch and process transactions (expenses/incomes) data to display meaningfull content on dashboard
-   Calculate and display balance, total incomes, total expenses, savings rate, monthly averages based on user transactions data
-   Process transactions data to display expenses distribution pie chart with date filtering
-   Process transactions data to display monthly expenses, incomes bar chart with date filtering
-   Add limits to each expense group for alerting user based on exceeding monthly expenses
-   Simple yet functional, clean UI focused on simplicity
-   Generate AI summary for your transactions data and get suggestions/reviews from AI, currently I disabled this for every user except myself to not exceed my anthropic usage limit

[Application Link](https://kawai-expense-tracker.vercel.app/)

###  Features that I may add in future

-   Instead of linking transaction to users with username, I may link them with user \_id's
-   I may add email verification for register step, and password reset functionality
-   I may add more detailed/advanced analysis reports and charts
    -   Daily transactions data processing, currently all data is generated months based
    -   Analytics/Reports that can be added are
        -   Weekday vs Weekend Spendings
        -   Recurring vs One time transactions
        -   Monthly comparison
        -   Projected balance
        -   Projected savings
        -   Average daily spendings
        -   Highest spending day
        -   Lowest spending day
        -   Category spending rate
        -   Unusual spendings
        -   Seasonal Trends
    -   Creating custom charts for all possible analytics/reports additions
-   More customized AI suggestions and reviews based on new analytics/reports additions
-   Design updates to make app even better
-   Encrypt user's data so only user can decrypt and see it
    -   I don't know how I can do this but it can be a nice know-how gain and privacy improvement
