CALL npm ci
set /p host=What's the host IP? 
set /p user=What's the user? 
set /p password=What's the password? 
set /p database=What's the database? 
cd src
echo import { createPool } from "mysql2/promise";  >  db.js
echo const pool = createPool({                     >> db.js
echo     host: '%host%',                           >> db.js
echo     user: '%user%',                           >> db.js
echo     password: '%password%',                   >> db.js
echo     database: '%database%'                    >> db.js
echo });                                           >> db.js
echo export default pool;                          >> db.js
cd ..

set /p port=What's the desired localhost port? 

echo export default %port%; > src\port.js

echo ^<?xml version="1.0" encoding="UTF-8"?^> > web.config
echo ^<configuration^> >> web.config
echo   ^<system.webServer^> >> web.config
echo     ^<rewrite^> >> web.config
echo       ^<rules^> >> web.config
echo         ^<rule name="Force HTTPS"^> >> web.config
echo           ^<match url="(.*)" /^> >> web.config
echo           ^<conditions^> >> web.config
echo             ^<add input="{HTTPS}" pattern="^OFF$" /^> >> web.config
echo           ^</conditions^> >> web.config
echo           ^<action type="Redirect" url="https://{HTTP_HOST}/{R:1}" /^> >> web.config
echo         ^</rule^> >> web.config
echo         ^<rule name="ReverseProxyInboundRule1" stopProcessing="true"^> >> web.config
echo           ^<match url="(.*)" /^> >> web.config
echo           ^<action type="Rewrite" url="http://localhost:%port%/{R:1}" /^> >> web.config
echo         ^</rule^> >> web.config
echo       ^</rules^> >> web.config
echo     ^</rewrite^> >> web.config
echo   ^</system.webServer^> >> web.config
echo ^</configuration^> >> web.config

CALL pm2 delete pareto
CALL pm2 start server.js --name pareto