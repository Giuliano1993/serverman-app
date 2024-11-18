## Descriptiokn

in the process of deploy and creation of servers and applications many things may going on; we shall handle as much as we can to add ease to dev life

### Digital Ocean


- when creating a droplet, if no right key is given, the server return a 422 response (umprocessable content) "..... are invalid key identifiers for Droplet creation". This means we're trying to use for our server a key fingerprint that doesn't exsist on our registered key so we need to add it