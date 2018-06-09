# Pictor Encryption

### Setup
1. Clone repository
2. Run `./scripts/init.sh`
  - If that doesn't work, try running `chmod +x ./scripts/init.sh` then run prompt again
3. The program connects to the database via environment variables, so to start it, please use the following command where the X's are replaced with the correct variables:
  ```
  DBUSER=XXXXXX DBHOST=XXXXXXX DBNAME=XXXXX DBPASSWORD=XXXXXX node index.js
  ```
4. Open browser to `http://localhost:3000`

** For our submission, we have included a file called `run-pictor.txt` which includes all information to run the application locally

### Running Test Suite
Run `yarn test`
