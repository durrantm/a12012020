## Get component working with Object

Note: You will not be able to actually test without my .env file.  
I can supply that if needed.  
Ideally you can figure it out without that as the issue is quite specific.

Weather app

In App.js

Lines 201 - 205 work but are clearly repetitive.  They call a simple function and get a string back

Line: 207 This works and uses a component - better - and passes in a forecast for a day - forecast[1]

Lines: 209-212 This is where I am stuck.  I get errors about forecast.entries and I am not sure how to pass the day in correctly through the map function to the component the way I did with one entry.

The console.log on line 137 of the old method shows:

    {day: {…}}
    day:
    app_max_temp: 35.2
    app_min_temp: 27.2
    clouds: 21
    clouds_hi: 0
    clouds_low: 21
    clouds_mid: 11
    datetime: "2020-12-02"

the fact that I have day within day (which you can see on line 138) is no doubt part of my confusion.
