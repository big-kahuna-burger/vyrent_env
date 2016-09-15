## Vyrent Environment
This is Vagrant Machine that contains required tools to create Lambda functions for Vyrent.

### Used tools
    1. Ubuntu 16.04.01
    2. PostgreSQL 9.5.3
    3. Node 6.5.0
    4. NPM 3.10.3
    5. Gulp 3.9.1
    6. Mocha 3.0.2
    7. PostgREST 0.3.2.0
    8. Vagrant 1.8.5
    9. Virtual Box 5.1.4

### Configuration
    1. Ubuntu:
        * Username: vagrant
        * Password: vagrant
    2. PostgreSQL:
        * PORT: 5432
        * User: postgres
        * Password: vyrent
        * DB name: vyrent
    3. PostgREST:
        * PORT: 3000
        * No Token required
    4. Vagrant:
        * Box on Atlas
        * PORT map(guest->host):
            * 3000->3001
### Setup
    1. Install Vagrant
    2. Clone project
    3. Vagrant Up

### Todo
    [] Install eslint
    [] Coding policy
