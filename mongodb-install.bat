@echo off
echo Installing MongoDB Community Edition...
msiexec.exe /l*v mdbinstall.log /qb /i mongodb-windows-x86_64-7.0-signed.msi ^
            ADDLOCAL="ServerService,LegacyClient" ^
            SHOULD_INSTALL_COMPASS="1"

echo Creating data directory...
md "\data\db"

echo MongoDB installed successfully!
echo Start MongoDB with: "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="c:\data\db"