# OuchBot-DiscordBot

This is the OuchBot Discord bot created by the Brutelegance [OUCH] guild.

Existing features:

When a member gains ones of the wvw tag roles mentioned below the bot will announce to the channel that a commander is active, after losing the role the bot will update the same annoucement to close the session. A disscussion thread is also created with each annoucement.
  "ACTIVE-TAG-EBG": "Eternal Battlegrounds",
  "ACTIVE-TAG-GBL": "Green Borderlands",
  "ACTIVE-TAG-BBL": "Blue Borderlands",
  "ACTIVE-TAG-RBL": "Red Borderlands"


Project was created to run in Docker using node.js

1) Update .env with your bots key
2) run $docker build -t discord-bot .
3) run $docker run -d --name ouch-discord-bot --env-file .env discord-bot
